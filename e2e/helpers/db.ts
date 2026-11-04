import { PrismaClient } from '@prisma/client';

/** Test-only Prisma (reads DATABASE_URL from env / .env via process). */
export function testPrisma() {
  return new PrismaClient();
}

export async function promoteAdminByEmail(email: string) {
  const prisma = testPrisma();
  try {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function ensureMasterByEmail(email: string) {
  const prisma = testPrisma();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error(`user ${email} not found`);
    await prisma.masterProfile.upsert({
      where: { userId: user.id },
      update: { isActive: true },
      create: { userId: user.id, isActive: true, skills: [] },
    });
    return user.id;
  } finally {
    await prisma.$disconnect();
  }
}
