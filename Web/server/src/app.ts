import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './lib/env.js';
import { generalLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/errors.js';
import leadsRouter from './routes/leads.js';
import applicationsRouter from './routes/applications.js';
import consentsRouter from './routes/consents.js';
import adminRouter from './routes/admin.js';

export function createApp(): Express {
  const app = express();

  // Dietro un reverse proxy (nginx, Railway, Render) serve per leggere l'IP reale
  // e far funzionare correttamente il rate limiting.
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin(origin, callback) {
        // Nessuna origin = chiamata da curl/server-to-server: consentita.
        if (!origin || env.clientOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error('CORS_NOT_ALLOWED'));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));
  app.use(cookieParser());
  app.use('/api', generalLimiter);

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      privacyVersion: env.privacyVersion,
      env: env.isProd ? 'production' : 'development',
    });
  });

  app.use('/api/franchise-leads', leadsRouter);
  app.use('/api/job-applications', applicationsRouter);
  app.use('/api/consents', consentsRouter);
  app.use('/api/admin', adminRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
