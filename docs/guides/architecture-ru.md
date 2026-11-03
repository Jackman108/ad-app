# Архитектура — Завхоз (репо ad-app)

**Обновлено:** 04.11.2026  
Домен: [domain-model-zavhoz-ru.md](domain-model-zavhoz-ru.md) · [ADR 0005](../adr/0005-zavhoz-domain-model.md)  
Пивот: [ADR 0004](../adr/0004-product-pivot-zavhoz.md)  
Качество: [clean-code-ru.md](clean-code-ru.md) · `.cursor/rules/clean-architecture.mdc`

## Продукт (MVP Завхоз)

B2B «Завхоз на аутсорсе» (РБ, BYN):

1. Org / Site — точки клиента  
2. Заявка WorkOrder + фото BEFORE  
3. Диспетчер (ADMIN): оценка → offer мастеру  
4. Мастер: accept → in progress → фото AFTER → ожидание подтверждения  
5. Клиент org: подтверждение CLOSED (Z5)  
6. Auth Better Auth; гео Region/Locality reuse  

**Архив в том же монолите:** C2C Объявки BY (Listing…) — не развиваем без ADR.

Вне MVP: платежи, ЭДО, подписки сетей, geo-push, native apps.

## Стиль

**Модульный монолит Next.js App Router** + FSD в `src/`.  
Стек: [ADR 0001](../adr/0001-core-stack.md).

```text
src/
├── app/           # routes: /orders, /dispatch, /master/orders, …
├── features/      # create-work-order, dispatch-work-order, master-work-order, …
├── entities/      # work-order (FSM/DTO), listing (архив), …
└── shared/        # prisma, auth, storage, ui
```

Зависимости только вниз. Мутации — use-case, не сырой Prisma в JSX.  
Статусы WorkOrder — только `canTransitionWorkOrder`.  
Фото — `WorkOrderImage` / `saveWorkOrderImage` (байты без перекодирования).

## Маршруты (текущие)

| Путь | Кто | Спринт |
| --- | --- | --- |
| `/orders`, `/orders/new`, `/orders/[id]` | OrgMembership | Z2 |
| `/dispatch` | ADMIN | Z3 |
| `/master/orders` | MasterProfile | Z4 |
| Listing `/`, `/listings/*` | архив | — |

## Деплой

Временно VPS lendings (`:3010`). Витрина Завхоз — Z6.
