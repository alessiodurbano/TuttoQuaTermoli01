import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { env } from '../src/lib/env.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = env.admin.email.toLowerCase();
  const passwordHash = await bcrypt.hash(env.admin.password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: 'Amministratore', role: 'admin' },
  });

  console.log(`\n  Account admin pronto: ${user.email}`);
  if (env.admin.password.startsWith('CambiaQuesta')) {
    console.log('  ⚠  Stai usando la password di default: cambiala in server/.env\n');
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => void prisma.$disconnect());
