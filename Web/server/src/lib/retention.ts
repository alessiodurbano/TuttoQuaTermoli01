import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma } from './prisma.js';
import { env } from './env.js';
import { audit } from './audit.js';

export interface RetentionSummary {
  leads: number;
  applications: number;
  consents: number;
  cvFiles: number;
}

/**
 * Cancella i dati personali scaduti. "Conserviamo i dati solo per il tempo
 * necessario" è una promessa che va mantenuta anche tecnicamente, non solo
 * scritta in informativa: questa funzione è l'implementazione di quella riga.
 */
export async function runRetentionCleanup(): Promise<RetentionSummary> {
  const now = new Date();
  const summary: RetentionSummary = { leads: 0, applications: 0, consents: 0, cvFiles: 0 };

  // Le candidature vanno lette prima di cancellarle, per rimuovere anche i CV.
  const expiredApplications = await prisma.jobApplication.findMany({
    where: { retentionUntil: { lt: now } },
    select: { id: true, cvStoredName: true },
  });

  for (const application of expiredApplications) {
    if (!application.cvStoredName) continue;
    try {
      await fs.unlink(path.resolve(env.uploadDir, application.cvStoredName));
      summary.cvFiles += 1;
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== 'ENOENT') {
        console.error('[retention] CV non rimosso:', application.cvStoredName, code);
      }
    }
  }

  if (expiredApplications.length > 0) {
    const { count } = await prisma.jobApplication.deleteMany({
      where: { id: { in: expiredApplications.map((a) => a.id) } },
    });
    summary.applications = count;
  }

  summary.leads = (await prisma.franchiseLead.deleteMany({ where: { retentionUntil: { lt: now } } }))
    .count;
  summary.consents = (await prisma.cookieConsent.deleteMany({ where: { retentionUntil: { lt: now } } }))
    .count;

  const total = summary.leads + summary.applications + summary.consents;
  if (total > 0) {
    console.log('[retention] record cancellati:', summary);
    await audit({ action: 'retention_cleanup', detail: JSON.stringify(summary) });
  }

  return summary;
}

/** Avvia la pulizia all'avvio del server e poi una volta al giorno. */
export function scheduleRetentionCleanup(): NodeJS.Timeout {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const run = () => {
    runRetentionCleanup().catch((e: unknown) =>
      console.error('[retention]', e instanceof Error ? e.message : e),
    );
  };

  run();
  const timer = setInterval(run, ONE_DAY);
  timer.unref();
  return timer;
}

// Esecuzione manuale: `npm run retention`
if (process.argv.includes('--once')) {
  runRetentionCleanup()
    .then(async (summary) => {
      console.log('Pulizia completata:', summary);
      await prisma.$disconnect();
    })
    .catch(async (error: unknown) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
