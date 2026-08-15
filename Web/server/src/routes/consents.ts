import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { env } from '../lib/env.js';
import { requestMeta, retentionDate } from '../lib/privacy.js';
import { consentLimiter } from '../middleware/rateLimit.js';
import { asyncRoute } from '../middleware/errors.js';

const router = Router();

const consentSchema = z.object({
  visitorId: z.string().trim().min(8).max(64),
  functional: z.boolean(),
  analytics: z.boolean(),
  action: z.enum(['accept_all', 'reject_all', 'custom', 'withdraw']),
});

export type ConsentInput = z.infer<typeof consentSchema>;

/**
 * Registra la scelta cookie del visitatore. Serve a dimostrare il consenso
 * (art. 7.1 GDPR): il visitorId è un UUID casuale generato dal browser, non
 * collegato a nessun dato identificativo.
 */
router.post(
  '/',
  consentLimiter,
  asyncRoute(async (req, res) => {
    const data = consentSchema.parse(req.body);

    await prisma.cookieConsent.create({
      data: {
        visitorId: data.visitorId,
        necessary: true,
        functional: data.functional,
        analytics: data.analytics,
        action: data.action,
        policyVersion: env.privacyVersion,
        retentionUntil: retentionDate(env.retentionDays.consents),
        ...requestMeta(req),
      },
    });

    res.status(201).json({ ok: true, policyVersion: env.privacyVersion });
  }),
);

/** Il frontend la usa per capire se l'informativa è cambiata dall'ultimo consenso. */
router.get('/version', (_req, res) => {
  res.json({ policyVersion: env.privacyVersion });
});

export default router;
