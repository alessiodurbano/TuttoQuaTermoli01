import crypto from 'node:crypto';
import type { Request } from 'express';
import { env } from './env.js';

/**
 * L'indirizzo IP è un dato personale. Non lo salviamo in chiaro: teniamo solo
 * un hash con salt, sufficiente a riconoscere abusi/spam ma non a risalire
 * alla persona (principio di minimizzazione, art. 5.1.c GDPR).
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  return crypto.createHmac('sha256', env.ipHashSalt).update(String(ip)).digest('hex').slice(0, 32);
}

export function clientIp(req: Request): string | null {
  return req.ip ?? req.socket?.remoteAddress ?? null;
}

/** User agent troncato: serve per il log, non per profilare. */
export function shortUserAgent(req: Request): string | null {
  const ua = req.get('user-agent');
  return ua ? ua.slice(0, 255) : null;
}

/** Data oltre la quale il record va cancellato. */
export function retentionDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export interface RequestMeta {
  ipHash: string | null;
  userAgent: string | null;
}

/** Metadati tecnici comuni a tutte le scritture che contengono dati personali. */
export function requestMeta(req: Request): RequestMeta {
  return {
    ipHash: hashIp(clientIp(req)),
    userAgent: shortUserAgent(req),
  };
}
