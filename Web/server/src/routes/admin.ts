import fs from 'node:fs';
import path from 'node:path';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { audit } from '../lib/audit.js';
import { requireAdmin, issueSession, clearSession } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { cvDirectory } from '../middleware/upload.js';
import { asyncRoute } from '../middleware/errors.js';

const router = Router();

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'] as const;
export const APPLICATION_STATUSES = ['new', 'reviewing', 'interview', 'hired', 'rejected'] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// --- Autenticazione ---------------------------------------------------------

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

router.post(
  '/login',
  loginLimiter,
  asyncRoute(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.adminUser.findUnique({ where: { email } });
    const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false;

    // Messaggio identico in entrambi i casi: non riveliamo se l'email esiste.
    if (!user || !user.isActive || !passwordOk) {
      res.status(401).json({ error: 'Credenziali non valide' });
      return;
    }

    await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    issueSession(res, user);
    await audit({ req, actor: user, action: 'login' });

    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  }),
);

router.post('/logout', (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({ user: req.admin });
});

// --- Cruscotto --------------------------------------------------------------

router.get(
  '/stats',
  requireAdmin,
  asyncRoute(async (_req, res) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [leadsTotal, leadsNew, leadsRecent, appsTotal, appsNew, appsRecent, consents] =
      await Promise.all([
        prisma.franchiseLead.count(),
        prisma.franchiseLead.count({ where: { status: 'new' } }),
        prisma.franchiseLead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.jobApplication.count(),
        prisma.jobApplication.count({ where: { status: 'new' } }),
        prisma.jobApplication.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
        prisma.cookieConsent.count(),
      ]);

    res.json({
      leads: { total: leadsTotal, new: leadsNew, last7Days: leadsRecent },
      applications: { total: appsTotal, new: appsNew, last7Days: appsRecent },
      consents: { total: consents },
    });
  }),
);

// --- Richieste franchising --------------------------------------------------

const listQuery = z.object({
  status: z.string().optional(),
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(25),
});

router.get(
  '/leads',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const { status, q, page, perPage } = listQuery.parse(req.query);

    const where = {
      ...(status && (LEAD_STATUSES as readonly string[]).includes(status) ? { status } : {}),
      ...(q
        ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { city: { contains: q } }] }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.franchiseLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.franchiseLead.count({ where }),
    ]);

    res.json({ items, total, page, perPage });
  }),
);

const leadPatch = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().trim().max(4000).nullish(),
});

router.patch(
  '/leads/:id',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const data = leadPatch.parse(req.body);
    const lead = await prisma.franchiseLead.update({ where: { id: req.params.id }, data });

    await audit({
      req,
      actor: req.admin,
      action: 'update_status',
      entity: 'FranchiseLead',
      entityId: lead.id,
      detail: JSON.stringify(data),
    });

    res.json(lead);
  }),
);

router.delete(
  '/leads/:id',
  requireAdmin,
  asyncRoute(async (req, res) => {
    await prisma.franchiseLead.delete({ where: { id: req.params.id } });

    await audit({
      req,
      actor: req.admin,
      action: 'delete',
      entity: 'FranchiseLead',
      entityId: req.params.id,
    });

    res.json({ ok: true });
  }),
);

// --- Candidature ------------------------------------------------------------

router.get(
  '/applications',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const { status, q, page, perPage } = listQuery.parse(req.query);

    const where = {
      ...(status && (APPLICATION_STATUSES as readonly string[]).includes(status) ? { status } : {}),
      ...(q
        ? { OR: [{ name: { contains: q } }, { email: { contains: q } }, { role: { contains: q } }] }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.jobApplication.count({ where }),
    ]);

    res.json({ items, total, page, perPage });
  }),
);

const applicationPatch = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  notes: z.string().trim().max(4000).nullish(),
});

router.patch(
  '/applications/:id',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const data = applicationPatch.parse(req.body);
    const application = await prisma.jobApplication.update({ where: { id: req.params.id }, data });

    await audit({
      req,
      actor: req.admin,
      action: 'update_status',
      entity: 'JobApplication',
      entityId: application.id,
      detail: JSON.stringify(data),
    });

    res.json(application);
  }),
);

router.get(
  '/applications/:id/cv',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const application = await prisma.jobApplication.findUnique({ where: { id: req.params.id } });

    if (!application?.cvStoredName) {
      res.status(404).json({ error: 'CV non disponibile' });
      return;
    }

    // path.basename impedisce che un valore manipolato esca dalla cartella uploads.
    const filePath = path.join(cvDirectory, path.basename(application.cvStoredName));
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File non più presente sul server' });
      return;
    }

    await audit({
      req,
      actor: req.admin,
      action: 'view_cv',
      entity: 'JobApplication',
      entityId: application.id,
    });

    res.download(filePath, application.cvOriginalName ?? 'cv.pdf');
  }),
);

router.delete(
  '/applications/:id',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const application = await prisma.jobApplication.findUnique({ where: { id: req.params.id } });

    if (!application) {
      res.status(404).json({ error: 'Candidatura non trovata' });
      return;
    }

    if (application.cvStoredName) {
      await fs.promises
        .unlink(path.join(cvDirectory, path.basename(application.cvStoredName)))
        .catch(() => undefined);
    }

    await prisma.jobApplication.delete({ where: { id: application.id } });

    await audit({
      req,
      actor: req.admin,
      action: 'delete',
      entity: 'JobApplication',
      entityId: application.id,
    });

    res.json({ ok: true });
  }),
);

// --- Export CSV -------------------------------------------------------------

function toCsv<T extends Record<string, unknown>>(rows: T[], columns: (keyof T & string)[]): string {
  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    const text = value instanceof Date ? value.toISOString() : String(value);
    return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const header = columns.join(';');
  const body = rows.map((row) => columns.map((column) => escape(row[column])).join(';'));
  return `﻿${[header, ...body].join('\n')}`; // BOM: Excel legge correttamente gli accenti
}

router.get(
  '/export/leads.csv',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const rows = await prisma.franchiseLead.findMany({ orderBy: { createdAt: 'desc' } });
    await audit({ req, actor: req.admin, action: 'export', entity: 'FranchiseLead' });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="richieste-franchising.csv"');
    res.send(
      toCsv(rows, ['createdAt', 'name', 'email', 'phone', 'city', 'message', 'status', 'notes']),
    );
  }),
);

router.get(
  '/export/applications.csv',
  requireAdmin,
  asyncRoute(async (req, res) => {
    const rows = await prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' } });
    await audit({ req, actor: req.admin, action: 'export', entity: 'JobApplication' });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="candidature.csv"');
    res.send(
      toCsv(rows, [
        'createdAt',
        'name',
        'email',
        'phone',
        'role',
        'personality',
        'message',
        'cvOriginalName',
        'status',
        'notes',
      ]),
    );
  }),
);

export default router;
