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

## Z2 — Вертикаль «создать заявку» ✅

| # | Задача | Статус |
| --- | --- | --- |
| Z2.1 | use-case `createAndSubmitWorkOrder` + upload BEFORE | ✅ |
| Z2.2 | UI: `/orders/new`, список `/orders` (org) | ✅ |
| Z2.3 | Карточка `/orders/[id]` (org DTO) | ✅ |
| Z2.4 | Auth guard: OrgMembership (+ demo bootstrap) | ✅ |

**Exit:** менеджер точки создаёт заявку с фото «до» — ✅ (нужен migrate+seed на БД).

**Следующий:** Z3 диспетчер.

---

## Z3 — Диспетчер ✅ (оценка + offer; accept — Z4)

| # | Задача | Статус |
| --- | --- | --- |
| Z3.1 | Очередь SUBMITTED/ESTIMATED/OFFERED на `/dispatch` | ✅ |
| Z3.2 | Оценка `priceMinor` SUBMITTED→ESTIMATED | ✅ |
| Z3.3 | Назначение `masterId` ESTIMATED→OFFERED | ✅ |
| Z3.4 | Роль dispatcher = `User.role === ADMIN` | ✅ |

**Exit:** заявка предложена мастеру (OFFERED) — ✅; accept мастером → Z4.

**Следующий:** Z4 кабинет мастера.

---

## Z4 — Кабинет мастера ✅

| # | Задача | Статус |
| --- | --- | --- |
| Z4.1 | MasterProfile (auto) + `/master/orders` | ✅ |
| Z4.2 | Accept / IN_PROGRESS | ✅ |
| Z4.3 | Upload AFTER → AWAITING_CONFIRM | ✅ |

**Exit:** мастер сдаёт работу фото-отчётом — ✅.

**Следующий:** Z5 подтверждение клиентом.

---

## Z5 — Подтверждение клиентом ✅ (без e2e пока)

| # | Задача | Статус |
| --- | --- | --- |
| Z5.1 | Org confirm → CLOSED | ✅ |
| Z5.2 | Возврат на доработку → IN_PROGRESS | ✅ |
| Z5.3 | e2e happy-path Playwright | ⬜ |

**Exit:** цикл без денег в UI — ✅; e2e — после migrate на живой БД.

**Следующий:** Z6 бренд/VPS или e2e Z5.3.

---

## Z6 — Бренд и VPS 🟡

| # | Задача | Статус |
| --- | --- | --- |
| Z6.1 | Бренд/копирайт Завхоз (siteConfig + шапка) | ✅ |
| Z6.2 | Лендинг `/` под Завхоз (CTA заявка/вход) | ✅ |
| Z6.3 | Выкладка на VPS `:3010` + migrate/seed Завхоз | ✅ |
| Z6.4 | Лента Listing — архив (роуты живы, с `/` убрана) | ✅ |

**Exit:** локально `/` = Завхоз; VPS redeploy — следующий шаг.

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
