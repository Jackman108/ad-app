'use server';

import { revalidatePath } from 'next/cache';
import { canTransitionWorkOrder } from '@/entities/work-order/model/status';
import { prisma } from '@/shared/lib/prisma';

export async function acceptWorkOrder(masterUserId: string, workOrderId: string) {
  const order = await prisma.workOrder.findFirst({
    where: { id: workOrderId, deletedAt: null, masterId: masterUserId },
  });
  if (!order) throw new Error('Заявка не найдена или не ваша');
  if (!canTransitionWorkOrder(order.status, 'ACCEPTED')) {
    throw new Error(`Нельзя принять из ${order.status}`);
  }

  const updated = await prisma.workOrder.update({
    where: { id: order.id },
    data: { status: 'ACCEPTED' },
  });

  revalidatePath('/master/orders');
  revalidatePath('/dispatch');
  revalidatePath(`/orders/${updated.id}`);
  return updated;
}

export async function startWorkOrder(masterUserId: string, workOrderId: string) {
  const order = await prisma.workOrder.findFirst({
    where: { id: workOrderId, deletedAt: null, masterId: masterUserId },
  });
  if (!order) throw new Error('Заявка не найдена или не ваша');
  if (!canTransitionWorkOrder(order.status, 'IN_PROGRESS')) {
    throw new Error(`Нельзя начать из ${order.status}`);
  }

  const updated = await prisma.workOrder.update({
    where: { id: order.id },
    data: { status: 'IN_PROGRESS' },
  });

  revalidatePath('/master/orders');
  revalidatePath(`/orders/${updated.id}`);
  return updated;
}
