# Карта спринтов Завхоз

**Обновлено:** 04.11.2026  
**Канон:** [strategy-plan-ru.md](strategy-plan-ru.md) · [ADR 0004](../adr/0004-product-pivot-zavhoz.md) · [ADR 0005](../adr/0005-zavhoz-domain-model.md)  
**Архив объявлений:** [sprint-map-ru.md](sprint-map-ru.md)

```text
[Z0 Docs]─►[Z1 Schema]─►[Z2 Заявка UI]─►[Z3 Диспетчер]─►[Z4 Мастер]
                                              │
                                              ▼
                                    [Z5 Закрытие]─►[Z6 VPS/бренд]─►[Z7+]
```

## Z0 — Документы и правила ✅

| # | Задача | Статус |
| --- | --- | --- |
| Z0.1 | ADR 0004 пивот + business-model | ✅ |
| Z0.2 | Strategy Z0–Z4 | ✅ |
| Z0.3 | ADR 0005 + domain-model-zavhoz | ✅ |
| Z0.4 | Sprint-map Завхоз + обновление docs/README/rules | ✅ |

**Exit:** агент и человек читают один канон до кода.

---

## Z1 — Prisma-схема и сиды ✅ (код) / migrate на БД — при поднятом Postgres

| # | Задача | Статус |
| --- | --- | --- |
| Z1.1 | Модели Organization, OrgMembership, Site, WorkCategory, MasterProfile, WorkOrder, WorkOrderImage | ✅ |
| Z1.2 | Миграция `20261104000000_zavhoz_work_orders` (без drop Listing) | ✅ файл |
| Z1.3 | Сиды: WorkCategory дерево; демо Org+Site в Минске | ✅ |
| Z1.4 | entities: FSM `canTransitionWorkOrder`, DTO | ✅ |

**Exit:** typecheck ✅; `prisma migrate deploy` + `db seed` — на локальном/VPS Postgres.

**Следующий:** Z2 UI/use-case создания заявки.

---

## Z2 — Вертикаль «создать заявку»

| # | Задача | Статус |
| --- | --- | --- |
| Z2.1 | use-case `createWorkOrder` + upload BEFORE | ⬜ |
| Z2.2 | UI: `/orders/new`, список `/orders` (org) | ⬜ |
| Z2.3 | Карточка `/orders/[id]` (org DTO) | ⬜ |
| Z2.4 | Auth guard: только OrgMembership | ⬜ |

**Exit:** менеджер точки создаёт заявку с фото «до».

---

## Z3 — Диспетчер

| # | Задача | Статус |
| --- | --- | --- |
| Z3.1 | Очередь SUBMITTED/ESTIMATED | ⬜ |
| Z3.2 | Оценка `priceMinor` + переход ESTIMATED→OFFERED | ⬜ |
| Z3.3 | Назначение `masterId` (OFFERED→ACCEPTED со стороны диспетчера или accept мастером) | ⬜ |
| Z3.4 | Роль dispatcher (User flag или Org platform) | ⬜ |

**Exit:** заявка назначена мастеру без оплаты.

---

## Z4 — Кабинет мастера

| # | Задача | Статус |
| --- | --- | --- |
| Z4.1 | MasterProfile + `/master/orders` | ⬜ |
| Z4.2 | Accept / IN_PROGRESS | ⬜ |
| Z4.3 | Upload AFTER → AWAITING_CONFIRM | ⬜ |

**Exit:** мастер закрывает работу фото-отчётом.

---

## Z5 — Подтверждение клиентом

| # | Задача | Статус |
| --- | --- | --- |
| Z5.1 | Org confirm → CLOSED | ⬜ |
| Z5.2 | Возврат на доработку → IN_PROGRESS | ⬜ |
| Z5.3 | e2e happy-path Playwright | ⬜ |

**Exit:** полный цикл без денег.

---

## Z6 — Бренд и VPS

| # | Задача | Статус |
| --- | --- | --- |
| Z6.1 | Бренд/копирайт Завхоз (вместо Объявки BY в UI) | ⬜ |
| Z6.2 | Лендинг `/` под Завхоз (CTA заявка/вход) | ⬜ |
| Z6.3 | Выкладка на VPS `:3010` (замена витрины объявлений) | ⬜ |
| Z6.4 | Решение по данным Listing (оставить read-only / скрыть роуты) | ⬜ |

**Exit:** с телефона открывается Завхоз, не доска объявлений.

---

## Z7+ (после вертикали)

- Прайс / комиссия / баланс  
- Гео-радиус и уведомления  
- Подписка на Site  
- Материалы + наценка  
- ЭДО/акты  

---

## Готовность (оценка 04.11)

| Срез | % | Комментарий |
| --- | --- | --- |
| Документы пивота | ~90% | Z0 |
| Код Завхоз | ~0% | после Z1 |
| Переиспользуемый фундамент | ~70% | auth, upload, geo, FSD |
