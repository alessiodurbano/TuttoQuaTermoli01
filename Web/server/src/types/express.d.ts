/**
 * Estende il tipo Request di Express con l'utente admin autenticato,
 * valorizzato dal middleware `requireAdmin`.
 */
import type { AdminSession } from '../middleware/auth.js';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminSession;
    }
  }
}

export {};
