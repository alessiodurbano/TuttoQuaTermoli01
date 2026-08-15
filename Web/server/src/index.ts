import { createApp } from './app.js';
import { env } from './lib/env.js';
import { prisma } from './lib/prisma.js';
import { scheduleRetentionCleanup } from './lib/retention.js';

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`\n  TuttoQua API in ascolto su http://localhost:${env.port}`);
  console.log(`  Origini frontend autorizzate: ${env.clientOrigins.join(', ')}\n`);
});

scheduleRetentionCleanup();

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`\n[${signal}] chiusura in corso...`);
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
