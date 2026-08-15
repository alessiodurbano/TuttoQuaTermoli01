import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../lib/env.js';

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Endpoint non trovato' });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Dati non validi',
      fields: Object.fromEntries(
        error.issues.map((issue) => [issue.path.join('.') || '_', issue.message]),
      ),
    });
    return;
  }

  if (error instanceof Error && error.message === 'CORS_NOT_ALLOWED') {
    res.status(403).json({ error: 'Origine non autorizzata' });
    return;
  }

  console.error('[errore]', error);
  res.status(500).json({
    error: 'Errore interno del server',
    ...(env.isProd ? {} : { detail: error instanceof Error ? error.message : String(error) }),
  });
}

/** Evita di ripetere try/catch in ogni handler async. */
export const asyncRoute =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
