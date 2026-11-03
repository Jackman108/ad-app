'use server';

import { prisma } from '@/shared/lib/prisma';

/** MVP: создать MasterProfile при первом заходе в кабинет мастера. */
export async function ensureMasterProfile(userId: string) {
  const existing = await prisma.masterProfile.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.masterProfile.create({
    data: {
      userId,
      isActive: true,
      skills: [],
    },
  });
}
