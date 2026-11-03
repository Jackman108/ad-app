'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { canTransitionWorkOrder } from '@/entities/work-order/model/status';
import { prisma } from '@/shared/lib/prisma';

const schema = z.object({
  workOrderId: z.string().min(1),
  priceByn: z.string().trim().min(1),
});

function parsePriceMinor(raw: string): number {
  const value = Number(raw.replace(',', '.').replace(/\s/g, ''));
  if (!Number.isFinite(value) || value < 0) throw new Error('Некорректная цена');
  return Math.round(value * 100);
}

/** Диспетчер: SUBMITTED → ESTIMATED с ценой BYN. */
export async function estimateWorkOrder(actorUserId: string, input: unknown) {
  const data = schema.parse(input);
  const actor = await prisma.user.findUnique({ where: { id: actorUserId } });
  if (!actor || actor.role !== 'ADMIN') {
    throw new Error('Только диспетчер (ADMIN)');
  }

  const order = await prisma.workOrder.findFirst({
    where: { id: data.workOrderId, deletedAt: null },
  });
  if (!order) throw new Error('Заявка не найдена');
  if (!canTransitionWorkOrder(order.status, 'ESTIMATED')) {
    throw new Error(`Нельзя оценить из статуса ${order.status}`);
  }

  const updated = await prisma.workOrder.update({
    where: { id: order.id },
    data: {
      status: 'ESTIMATED',
      priceMinor: parsePriceMinor(data.priceByn),
      currency: 'BYN',
      platformFeeBps: order.platformFeeBps ?? 2000,
    },
  });

  revalidatePath('/dispatch');
  revalidatePath(`/orders/${updated.id}`);
  return updated;
}
