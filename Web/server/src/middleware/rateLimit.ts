import rateLimit from 'express-rate-limit';

const message = { error: 'Troppe richieste. Riprova tra qualche minuto.' };

/** Form pubblici: pochi invii per IP, per fermare lo spam automatico. */
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message,
});

/** Login admin: protezione contro tentativi a forza bruta. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Troppi tentativi di accesso. Riprova tra 15 minuti.' },
});

/** Registrazione consensi cookie: generosa, è una scrittura leggera. */
export const consentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message,
});

/** Tetto generale su tutte le API. */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message,
});
