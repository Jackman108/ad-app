# ADR 0005 — Доменная модель Завхоз (MVP)

- **Статус:** Принято
- **Дата:** 2026-11-04
- **Канон:** [domain-model-zavhoz-ru.md](../guides/domain-model-zavhoz-ru.md)
- **Связано:** ADR 0004 (пивот) · ADR 0001 (стек) · ADR 0003 (объявления — архив)

## Контекст

Нужен канон сущностей до миграции Prisma и use-case слоёв. Продукт — B2B завхоз: организация → объекты (точки) → заявки с фото → мастер → фото «после» → закрытие. Платежи/ЭДО/подписки — не в первой миграции.

## Решение

1. Канон — `docs/guides/domain-model-zavhoz-ru.md`.
2. MVP-таблицы: User (+ Better Auth), Organization, OrgMembership, Site, WorkCategory, WorkOrder, WorkOrderImage, MasterProfile; Region/Locality **переиспользуем** из объявлений.
3. Деньги в домене заказа — `priceMinor` + `BYN` (копейки); комиссия платформы — поле/конфиг, списание — фаза Z3.
4. Статусы WorkOrder — только через FSM в use-case (`canTransitionWorkOrder`).
5. Медиа — `WorkOrderImage` с `kind` BEFORE|AFTER, не JSON-массив URL.
6. Роли через `OrgMembership.role` и `MasterProfile`, не отдельные Buyer/Seller-таблицы.
7. Listing/Conversation C2C **не расширяем**; новый контур рядом (или позже deprecate).

## Последствия

Плюсы: ясный вертикальный срез; фото-инвариант; BY geo уже есть.  
Минусы: две доменные зоны в одной БД до чистки архива объявлений.

## Проверка готовности

- [x] Guide domain-model-zavhoz написан
- [x] MVP / phase2 / anti-model разделены
- [ ] Prisma migration под канон
- [ ] Сиды WorkCategory + демо Org/Site
