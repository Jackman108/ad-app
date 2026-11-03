# Карта разработки — архив Объявки BY (S0–S7)

**Обновлено**: 04.11.2026  
**Статус:** **архив** после пивота на Завхоз — [ADR 0004](../adr/0004-product-pivot-zavhoz.md) · план: [strategy-plan-ru.md](strategy-plan-ru.md)  
**Бренд (архив):** Объявки BY · **host:** abyawki.by (план)  
~~**Цель «готово»:** частник…~~ → новая цель в strategy-plan (фазы Z0–Z4).

Канон: [strategy-plan-ru.md](strategy-plan-ru.md) · [domain-model-ru.md](domain-model-ru.md) · ADR 0001–0003 · [аудит 04.11](sprint-audit-2026-11-04-ru.md).

```text
[S0]─►[S1]─►[S2]─►[S3]─►[S4]─►[S5]  ✅/🟡 ядро
                              │
                              ▼
                    [S6 Каталог+гео]─►[S7 Фильтры+ ✅]─►[S8 Горячая лента]─►[S9 UX]
```

**Готовность (04.11, уточн.):** ядро сделки **~93%** · discovery **~55%** (S6+S7) · soft-launch BY **~72%**.

---

## S0 — Foundation ✅

| # | Задача | Статус |
| --- | --- | --- |
| S0.1–S0.5 | Docs, Next, Prisma, сиды, главная | ✅ |

---

## S1 — Identity ✅ / ⏸

| # | Задача | Статус |
| --- | --- | --- |
| S1.1–S1.3 | Better Auth email, UI, sign-out | ✅ |
| S1.4 | Reset password (SMTP) | ⏸ |
| S1.5 | Google / Telegram / phone OTP | ⏸ |

---

## S2 — Listings CRUD ✅

Create/publish, my+FSM+edit, карточка, guard, лента published — ✅

---

## S3 — Лента, фото, фильтры ✅ (базовый)

| # | Задача | Статус |
| --- | --- | --- |
| S3.1–S3.5 | Лента, category/locality/price, upload, обложка, q | ✅ |
| — | Дерево категорий в UI, полный geo, расширенные фильтры | → S6–S7 |

---

## S4 — Сделки in-app ✅

| # | Задача | Статус |
| --- | --- | --- |
| S4.1–S4.5 | Conversation, Message, inbox, телефон auth, Report | ✅ |
| S4.6 | Unread (`readAt`) + badge в шапке/inbox | ✅ |
| S4.7 | ContactPanel + общий AppHeader | ✅ |
| S4.8 | E2E ядра (2 browser context) | ✅ |

**Exit:** два юзера переписываются in-app — ✅

---

## S5 — Качество и выкладка 🟡

| # | Задача | Статус |
| --- | --- | --- |
| S5.1 | Playwright smoke | ✅ (канал chrome; полный chromium — по сети) |
| S5.2 | Rate limit | ✅ |
| S5.3 | Dockerfile / standalone deploy | ✅ |
| S5.4 | VPS без домена | 🟡 live `:3010` |
| S5.5 | GitHub | ✅ |
| S5.6 | Quality gates (ESLint, tsc, Husky, commitlint) | ✅ |
| S5.7 | Домен abyawki.by + TLS | ⏸ покупка |

---

## S6 — Каталог и геосправочник ✅

**Цель:** структурированные категории/подкатегории + полный список городов по областям РБ.

| # | Задача | Статус |
| --- | --- | --- |
| S6.1 | UI дерева категорий (родитель → дети; только leaf в create) | ✅ |
| S6.2 | Фильтр/навигация: выбор parent включает children в where | ✅ |
| S6.3 | Расширить сид Category (ближе к Kufar-корзине, без EAV) | ✅ |
| S6.4 | Справочник Locality: полный CSV/JSON городов+районов BY по Region | ✅ |
| S6.5 | UI: сначала Region, затем Locality (cascade; не плоский select на 1000+) | ✅ |
| S6.6 | URL/slug категории (опционально `/c/[slug]`) | ⬜ later |

**Exit:** создать объявление с подкатегорией; фильтр по области сужает города; в БД ≥ основных райцентров всех 6 областей + Минск.

**Опора:** Kufar region→area; domain-model Region/Locality уже есть.

---

## S7 — Расширенный поиск и фильтры ✅ (почти)

| # | Задача | Статус |
| --- | --- | --- |
| S7.1 | Фильтры: regionId, condition, «только с фото», sort (new / priceAsc / priceDesc) | ✅ |
| S7.2 | Relevant sort при `q`: title match выше description (без отдельного search engine) | ✅ |
| S7.3 | Sticky/compact filter bar + сброс; счётчик «Найдено N» | ✅ |
| S7.4 | Пагинация `take`+`skip` + page в URL | ✅ |
| S7.5 | Поиск по имени категории в мобилке (ответ на боль Kufar) | ⬜ |

**Exit:** выдача как у Kufar-минимум: гео cascade + цена + состояние + фото + сортировка — ✅; S7.5 — следующий мелкий UX.

**Следующий:** S8 горячая лента / bump.

---

## S8 — Актуальная / «горячая» лента на главной

| # | Задача | Статус |
| --- | --- | --- |
| S8.1 | Поле `bumpedAt` (или reuse publishedAt bump) + лимит bump для продавца | ⬜ |
| S8.2 | Режимы главной: «Новые» / «Актуальные» (bumpedAt desc) | ⬜ |
| S8.3 | Лёгкий diversity: не более N подряд из одной category (Avito-inspired, без ML) | ⬜ |
| S8.4 | Блок «Горячее» = недавние с фото + bump за 48ч (эвристика) | ⬜ |
| S8.5 | Явная метка «Поднято» на карточке (честность как у promote disclosures) | ⬜ |

**Exit:** главная не только сырой `publishedAt`; продавец может «поднять» в разумных лимитах.

**Не в S8:** paid promote, CTR-ML, personalized home.

---

## S9 — UX polish по лучшим практикам

| # | Задача | Статус |
| --- | --- | --- |
| S9.1 | Сетка категорий на главной (иконки/чипы) | ⬜ |
| S9.2 | Notification badge непрочитанных в inbox | ⬜ |
| S9.3 | Сохранённый поиск (опционально, auth) | ⬜ |
| S9.4 | Empty states + «похожие» по category на карточке | ⬜ |
| S9.5 | Ручной смоук + e2e на S6–S8 сценарии | ⬜ |

---

## Вне ближайших спринтов

EAV-атрибуты · модерация-админка · платежи/promote paid · радиус км · карта · компании · отдельный хост.

## Блокеры снаружи

SMTP · Google OAuth · Telegram bot · SMS BY · покупка домена — **не** блокируют S6–S8.
