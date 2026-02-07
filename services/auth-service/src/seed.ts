import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  let tenant = await prisma.tenant.findFirst({ where: { name: 'Default' } });
  if (!tenant) tenant = await prisma.tenant.create({ data: { name: 'Default' } });
  const email = 'admin@acme.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('StrongPass!23', 10);
    await prisma.user.create({ data: { email, passwordHash, role: 'admin', tenantId: tenant.id, name: 'Admin' } });
    console.log('Seeded default admin user.');
  } else {
    console.log('Admin already exists, skipping seed.');
  }
}

main().finally(() => prisma.$disconnect());
