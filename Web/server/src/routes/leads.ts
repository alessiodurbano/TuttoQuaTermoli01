import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { env } from '../lib/env.js';
import { requestMeta, retentionDate } from '../lib/privacy.js';
import { notify } from '../lib/mailer.js';
import { formLimiter } from '../middleware/rateLimit.js';
import { asyncRoute } from '../middleware/errors.js';

const router = Router();

const leadSchema = z.object({
  name: z.string().trim().min(2, 'Inserisci nome e cognome').max(120),
  email: z.string().trim().toLowerCase().email('Indirizzo email non valido').max(180),
  city: z.string().trim().min(2, 'Indica la città di interesse').max(120),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  consentPrivacy: z.literal(true, {
    errorMap: () => ({ message: "Devi accettare l'informativa privacy per inviare la richiesta" }),
  }),
  // Campo esca invisibile all'utente: se è compilato, è un bot.
  website: z.string().max(0).optional().or(z.literal('')),
});

export type LeadInput = z.infer<typeof leadSchema>;

router.post(
  '/',
  formLimiter,
  asyncRoute(async (req, res) => {
    const data = leadSchema.parse(req.body);

    if (data.website) {
      // Rispondiamo 201 senza salvare: il bot non capisce di essere stato scartato.
      res.status(201).json({ ok: true });
      return;
    }

    const lead = await prisma.franchiseLead.create({
      data: {
        name: data.name,
        email: data.email,
        city: data.city,
        phone: data.phone || null,
        message: data.message || null,
        consentPrivacy: true,
        consentAt: new Date(),
        privacyVersion: env.privacyVersion,
        retentionUntil: retentionDate(env.retentionDays.leads),
        ...requestMeta(req),
      },
    });

    await notify({
      to: env.mail.toFranchising,
      subject: `Nuova richiesta franchising — ${lead.city}`,
      text: [
        `Nome: ${lead.name}`,
        `Email: ${lead.email}`,
        `Città: ${lead.city}`,
        `Telefono: ${lead.phone ?? '—'}`,
        '',
        lead.message ?? '(nessun messaggio)',
      ].join('\n'),
    });

    res.status(201).json({ ok: true, id: lead.id });
  }),
);

export default router;
