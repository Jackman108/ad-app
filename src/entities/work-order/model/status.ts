/** WorkOrder FSM — transitions only via use-cases (ADR 0005). */
export const workOrderStatuses = [
  'DRAFT',
  'SUBMITTED',
  'ESTIMATED',
  'OFFERED',
  'ACCEPTED',
  'IN_PROGRESS',
  'AWAITING_CONFIRM',
  'CLOSED',
  'CANCELLED',
] as const;

export type WorkOrderStatus = (typeof workOrderStatuses)[number];

const allowed: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  DRAFT: ['SUBMITTED', 'CANCELLED'],
  SUBMITTED: ['ESTIMATED', 'CANCELLED'],
  ESTIMATED: ['OFFERED', 'CANCELLED'],
  OFFERED: ['ACCEPTED', 'CANCELLED'],
  ACCEPTED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['AWAITING_CONFIRM', 'CANCELLED'],
  AWAITING_CONFIRM: ['CLOSED', 'IN_PROGRESS'],
  CLOSED: [],
  CANCELLED: [],
};

export function canTransitionWorkOrder(from: WorkOrderStatus, to: WorkOrderStatus): boolean {
  return allowed[from].includes(to);
}

const labelsRu: Record<WorkOrderStatus, string> = {
  DRAFT: 'Черновик',
  SUBMITTED: 'Новая',
  ESTIMATED: 'Оценена',
  OFFERED: 'Предложена мастеру',
  ACCEPTED: 'Принята мастером',
  IN_PROGRESS: 'В работе',
  AWAITING_CONFIRM: 'Ждёт подтверждения',
  CLOSED: 'Закрыта',
  CANCELLED: 'Отменена',
};

export function workOrderStatusLabel(status: string): string {
  if ((workOrderStatuses as readonly string[]).includes(status)) {
    return labelsRu[status as WorkOrderStatus];
  }
  return status;
}
