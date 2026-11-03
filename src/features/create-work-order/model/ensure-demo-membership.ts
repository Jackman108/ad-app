'use server';

import { prisma } from '@/shared/lib/prisma';

const DEMO_ORG_ID = 'seed-org-demo-zavhoz';

/** MVP: если у юзера нет org — привязать к демо-организации (после seed). */
export async function ensureDemoOrgMembership(userId: string) {
  const existing = await prisma.orgMembership.count({ where: { userId } });
  if (existing > 0) return;

  const org = await prisma.organization.findUnique({ where: { id: DEMO_ORG_ID } });
  if (!org) return;

  await prisma.orgMembership.create({
    data: {
      organizationId: org.id,
      userId,
      role: 'OWNER',
    },
  });
}
