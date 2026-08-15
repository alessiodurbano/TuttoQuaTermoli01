import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

function required(name: string, fallback: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Variabile d'ambiente mancante: ${name}. Copia server/.env.example in server/.env`);
  }
  if (isProd && value.startsWith('cambiami')) {
    throw new Error(`${name} ha ancora il valore di default: cambialo prima di andare in produzione.`);
  }
  return value;
}

function num(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  isProd,
  port: num('PORT', 4000),
  clientOrigins: (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  jwtSecret: required('JWT_SECRET', 'cambiami-dev-secret'),
  ipHashSalt: required('IP_HASH_SALT', 'cambiami-dev-salt'),

  uploadDir: process.env.UPLOAD_DIR ?? './uploads',
  maxCvSizeBytes: num('MAX_CV_SIZE_MB', 5) * 1024 * 1024,

  retentionDays: {
    leads: num('RETENTION_DAYS_LEADS', 730),
    applications: num('RETENTION_DAYS_APPLICATIONS', 365),
    consents: num('RETENTION_DAYS_CONSENTS', 365),
  },

  privacyVersion: process.env.PRIVACY_VERSION ?? '1.0',

  admin: {
    email: process.env.ADMIN_EMAIL ?? 'admin@tuttoqua.it',
    password: process.env.ADMIN_PASSWORD ?? 'CambiaQuestaPassword123!',
  },

  mail: {
    host: process.env.SMTP_HOST ?? '',
    port: num('SMTP_PORT', 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.MAIL_FROM ?? 'TuttoQua <no-reply@tuttoqua.it>',
    toFranchising: process.env.MAIL_TO_FRANCHISING ?? 'franchising@tuttoqua.it',
    toJobs: process.env.MAIL_TO_JOBS ?? 'info@tuttoqua.it',
  },
} as const;
