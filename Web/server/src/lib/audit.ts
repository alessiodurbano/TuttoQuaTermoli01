import type { Request } from 'express';
import { prisma } from './prisma.js';
import { hashIp, clientIp } from './privacy.js';

export type AuditAction =
  | 'login'
  | 'view_cv'
  | 'update_status'
  | 'delete'
  | 'export'
  | 'retention_cleanup';

export type AuditEntity = 'FranchiseLead' | 'JobApplication' | 'CookieConsent';

export interface AuditInput {
  req?: Request;
  actor?: { id: string; email: string } | null;
  action: AuditAction;
  entity?: AuditEntity;
  entityId?: string;
  detail?: string;
}

/**
 * Traccia le operazioni sui dati personali (accountability, art. 5.2 GDPR).
 * Non deve mai interrompere la richiesta in corso: gli errori sono solo loggati.
 */
export async function audit({ req, actor, action, entity, entityId, detail }: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: actor?.id ?? null,
        actorEmail: actor?.email ?? null,
        action,
        entity: entity ?? null,
        entityId: entityId ?? null,
        detail: detail ?? null,
        ipHash: req ? hashIp(clientIp(req)) : null,
      },
    });
  } catch (error) {
    console.error('[audit] scrittura fallita:', error instanceof Error ? error.message : error);
  }
}
