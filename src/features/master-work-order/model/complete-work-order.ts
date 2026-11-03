'use server';

import { revalidatePath } from 'next/cache';
import { canTransitionWorkOrder } from '@/entities/work-order/model/status';
import { prisma } from '@/shared/lib/prisma';
import { saveWorkOrderImage } from '@/shared/lib/storage';

/** Мастер: IN_PROGRESS → AWAITING_CONFIRM + фото AFTER. */
export async function completeWorkOrderWithAfterPhotos(
  masterUserId: string,
  workOrderId: string,
  imageFiles: File[],
) {
  const order = await prisma.workOrder.findFirst({
    where: { id: workOrderId, deletedAt: null, masterId: masterUserId },
    include: { images: { where: { kind: 'AFTER' } } },
  });
  if (!order) throw new Error('Заявка не найдена или не ваша');
  if (!canTransitionWorkOrder(order.status, 'AWAITING_CONFIRM')) {
    throw new Error(`Нельзя сдать из ${order.status}`);
  }

  const files = imageFiles.filter((f) => f && f.size > 0).slice(0, 8);
  if (files.length === 0 && order.images.length === 0) {
    throw new Error('Нужно хотя бы одно фото «после»');
  }

  const keys: string[] = [];
  for (const file of files) {
    keys.push((await saveWorkOrderImage(file)).storageKey);
  }

  const baseSort = order.images.length;
  const updated = await prisma.workOrder.update({
    where: { id: order.id },
    data: {
      status: 'AWAITING_CONFIRM',
      images:
        keys.length > 0
          ? {
              create: keys.map((storageKey, i) => ({
                storageKey,
                sortOrder: baseSort + i,
                kind: 'AFTER' as const,
              })),
            }
          : undefined,
    },
  });

  revalidatePath('/master/orders');
  revalidatePath('/orders');
  revalidatePath(`/orders/${updated.id}`);
  return updated;
}
