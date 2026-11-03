'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { canTransitionWorkOrder } from '@/entities/work-order/model/status';
import { prisma } from '@/shared/lib/prisma';
import { saveWorkOrderImage } from '@/shared/lib/storage';

const createSchema = z.object({
  organizationId: z.string().min(1),
  siteId: z.string().min(1),
  categoryId: z.string().min(1),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(10).max(8000),
});

export async function createAndSubmitWorkOrder(
  userId: string,
  input: unknown,
  imageFile?: File | null,
) {
  const data = createSchema.parse(input);

  const membership = await prisma.orgMembership.findUnique({
    where: {
      organizationId_userId: { organizationId: data.organizationId, userId },
    },
  });
  if (!membership || membership.role === 'VIEWER') {
    throw new Error('Нет прав на создание заявки в этой организации');
  }

  const site = await prisma.site.findFirst({
    where: {
      id: data.siteId,
      organizationId: data.organizationId,
      isActive: true,
    },
  });
  if (!site) throw new Error('Объект недоступен');

  const category = await prisma.workCategory.findFirst({
    where: { id: data.categoryId, isActive: true, allowsOrder: true },
  });
  if (!category) throw new Error('Категория работ недоступна');

  if (!canTransitionWorkOrder('DRAFT', 'SUBMITTED')) {
    throw new Error('Недопустимый переход статуса');
  }

  let imageKey: string | null = null;
  if (imageFile && imageFile.size > 0) {
    imageKey = (await saveWorkOrderImage(imageFile)).storageKey;
  }

  const order = await prisma.workOrder.create({
    data: {
      organizationId: data.organizationId,
      siteId: data.siteId,
      categoryId: data.categoryId,
      createdById: userId,
      title: data.title,
      description: data.description,
      status: 'SUBMITTED',
      currency: 'BYN',
      images: imageKey
        ? { create: [{ storageKey: imageKey, sortOrder: 0, kind: 'BEFORE' }] }
        : undefined,
    },
  });

  revalidatePath('/orders');
  revalidatePath(`/orders/${order.id}`);
  return order;
}
