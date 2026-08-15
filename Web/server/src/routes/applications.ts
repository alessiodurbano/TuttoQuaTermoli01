import fs from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { env } from '../lib/env.js';
import { requestMeta, retentionDate } from '../lib/privacy.js';
import { notify } from '../lib/mailer.js';
import { formLimiter } from '../middleware/rateLimit.js';
import { handleCvUpload, cvDirectory } from '../middleware/upload.js';
import { asyncRoute } from '../middleware/errors.js';

const router = Router();

export const PERSONALITIES = ['Creativo', 'Risolutore', 'People person'] as const;

const applicationSchema = z.object({
  name: z.string().trim().min(2, 'Inserisci il tuo nome').max(120),
  email: z.string().trim().toLowerCase().email('Indirizzo email non valido').max(180),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  role: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  personality: z.enum(PERSONALITIES).optional().or(z.literal('')),
  // I campi di un multipart/form-data arrivano sempre come stringhe.
  consentPrivacy: z
    .union([z.literal('true'), z.literal(true)])
    .refine((value) => value === 'true' || value === true, {
      message: "Devi accettare l'informativa privacy per candidarti",
    }),
  website: z.string().max(0).optional().or(z.literal('')),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Rimuove un CV già scritto su disco quando la candidatura viene scartata. */
async function discardUploadedCv(filename: string | undefined): Promise<void> {
  if (!filename) return;
  await fs.unlink(path.resolve(cvDirectory, filename)).catch(() => undefined);
}

router.post(
  '/',
  formLimiter,
  handleCvUpload,
  asyncRoute(async (req, res) => {
    let data: ApplicationInput;
    try {
      data = applicationSchema.parse(req.body);
    } catch (error) {
      await discardUploadedCv(req.file?.filename);
      throw error;
    }

    if (data.website) {
      await discardUploadedCv(req.file?.filename);
      res.status(201).json({ ok: true });
      return;
    }

    const application = await prisma.jobApplication.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        role: data.role || null,
        message: data.message || null,
        personality: data.personality || null,
        cvStoredName: req.file?.filename ?? null,
        cvOriginalName: req.file?.originalname ?? null,
        cvMimeType: req.file?.mimetype ?? null,
        cvSizeBytes: req.file?.size ?? null,
        consentPrivacy: true,
        consentAt: new Date(),
        privacyVersion: env.privacyVersion,
        retentionUntil: retentionDate(env.retentionDays.applications),
        ...requestMeta(req),
      },
    });

    await notify({
      to: env.mail.toJobs,
      subject: `Nuova candidatura — ${application.role ?? 'posizione non specificata'}`,
      text: [
        `Nome: ${application.name}`,
        `Email: ${application.email}`,
        `Telefono: ${application.phone ?? '—'}`,
        `Posizione: ${application.role ?? '—'}`,
        `Profilo: ${application.personality ?? '—'}`,
        `CV: ${application.cvOriginalName ?? 'non allegato'}`,
        '',
        application.message ?? '(nessun messaggio)',
      ].join('\n'),
    });

    res.status(201).json({ ok: true, id: application.id });
  }),
);

export default router;
