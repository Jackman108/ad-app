'use server';

import { revalidatePath } from 'next/cache';
import { canTransitionWorkOrder } from '@/entities/work-order/model/status';
import { prisma } from '@/shared/lib/prisma';

async function assertOrgManager(userId: string, organizationId: string) {
  const membership = await prisma.orgMembership.findUnique({
    where: { organizationId_userId: { organizationId, userId } },
  });
  if (!membership || membership.role === 'VIEWER') {
    throw new Error('Нет прав подтверждать заявки этой организации');
  }
}

/** Org: AWAITING_CONFIRM → CLOSED. */
export async function confirmWorkOrder(userId: string, workOrderId: string) {
  const order = await prisma.workOrder.findFirst({
    where: { id: workOrderId, deletedAt: null },
  });
  if (!order) throw new Error('Заявка не найдена');
  await assertOrgManager(userId, order.organizationId);

  if (!canTransitionWorkOrder(order.status, 'CLOSED')) {
    throw new Error(`Нельзя закрыть из ${order.status}`);
  }

  const updated = await prisma.workOrder.update({
    where: { id: order.id },
    data: { status: 'CLOSED', closedAt: new Date() },
  });

  revalidatePath('/orders');
  revalidatePath(`/orders/${updated.id}`);
  revalidatePath('/master/orders');
  return updated;
}

/** Org: AWAITING_CONFIRM → IN_PROGRESS (доработка). */
export async function requestWorkOrderRework(userId: string, workOrderId: string) {
  const order = await prisma.workOrder.findFirst({
    where: { id: workOrderId, deletedAt: null },
  });
  if (!order) throw new Error('Заявка не найдена');
  await assertOrgManager(userId, order.organizationId);

  if (!canTransitionWorkOrder(order.status, 'IN_PROGRESS')) {
    throw new Error(`Нельзя вернуть на доработку из ${order.status}`);
  }

  const updated = await prisma.workOrder.update({
    where: { id: order.id },
    data: { status: 'IN_PROGRESS' },
  });

  revalidatePath('/orders');
  revalidatePath(`/orders/${updated.id}`);
  revalidatePath('/master/orders');
  return updated;
}
