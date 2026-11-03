'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { canTransitionWorkOrder } from '@/entities/work-order/model/status';
import { prisma } from '@/shared/lib/prisma';

const schema = z.object({
  workOrderId: z.string().min(1),
  masterUserId: z.string().min(1),
});

/** Диспетчер: ESTIMATED → OFFERED + назначение мастера. */
export async function offerWorkOrderToMaster(actorUserId: string, input: unknown) {
  const data = schema.parse(input);
  const actor = await prisma.user.findUnique({ where: { id: actorUserId } });
  if (!actor || actor.role !== 'ADMIN') {
    throw new Error('Только диспетчер (ADMIN)');
  }

  const master = await prisma.masterProfile.findFirst({
    where: { userId: data.masterUserId, isActive: true },
  });
  if (!master) throw new Error('Мастер не найден или неактивен');

  const order = await prisma.workOrder.findFirst({
    where: { id: data.workOrderId, deletedAt: null },
  });
  if (!order) throw new Error('Заявка не найдена');
  if (!canTransitionWorkOrder(order.status, 'OFFERED')) {
    throw new Error(`Нельзя предложить из статуса ${order.status}`);
  }

  const updated = await prisma.workOrder.update({
    where: { id: order.id },
    data: {
      status: 'OFFERED',
      masterId: data.masterUserId,
    },
  });

  revalidatePath('/dispatch');
  revalidatePath('/master/orders');
  revalidatePath(`/orders/${updated.id}`);
  return updated;
}
