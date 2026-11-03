# Аудит продукта — 04.11.2026

**Объявки BY** · host план `abyawki.by` · live временно `http://<vps>:3010` · репо https://github.com/Jackman108/ad-app

Канон: [sprint-map-ru.md](sprint-map-ru.md) · [domain-model-ru.md](domain-model-ru.md) · предыдущий [аудит 03.11](sprint-audit-2026-11-03-ru.md).

## Процент готовности

| Срез | Оценка | Что значит |
| --- | --- | --- |
| **Ядро сделки** (регистрация → объявление с фото → лента/карточка → in-app чат → телефон после входа) | **~88%** | Код закрыт S0–S4; ручной смоук двумя аккаунтами + домен — остаток |
| **Discovery / каталог / гео / «горячая» лента** | **~28%** | Плоские фильтры, урезанные сиды городов, нет bump/hot, дерево категорий в UI слабое |
| **Продукт к soft-launch BY** (взвешенно) | **~65–68%** | Ядро есть; отстаём от Kufar/OLX по навигации, геосправочнику и выдаче |

Веса soft-launch (упрощённо): auth 10 · CRUD 15 · media 8 · feed/search 15 · categories UX 8 · geo 8 · messaging 12 · trust 4 · favorites 3 · deploy 8 · quality 5 · auth extras 4.

## Что реализовано (функционал)

| Область | Есть | Пробел |
| --- | --- | --- |
| Auth | Email+пароль, session, sign-out, `/login` `/register` | SMTP reset, Google, Telegram, phone OTP |
| Объявления | Create/publish, edit, FSM статусы, «Мои», public DTO без телефона | Массовые операции, черновики UX |
| Медиа | `ListingImage`, upload local, обложка в ленте/карточке | CDN, лимиты UX, порядок drag |
| Лента | Published на `/`, `orderBy publishedAt desc`, q + category + locality + price | Region cascade, condition, «с фото», sort, hot/bump, diversity |
| Категории | Дерево в Prisma (`parentId`), ~6 корней + подкатегории в сиде | UI выбора дерева, URL по slug, include children в фильтре |
| Гео | 7 Region + **~3 locality на область** (MVP-урезок) | Полный справочник городов/районов BY по областям |
| Сделки | Conversation UNIQUE, Message, `/inbox`, телефон только auth | Badge непрочитанных, блокировка |
| Trust | Report минимум | Админ-модерация, UserBlock |
| Избранное | Toggle + `/favorites` | — |
| Качество | ESLint, `tsc`, Husky+commitlint, Playwright smoke 3 сценария | Chromium install по сети; CI |
| Деплой | VPS `:3010`, migrate+seed, health | Домен/TLS abyawki.by |

## Конкуренты — что взять

| Источник | Паттерн | Для нас (MVP+) |
| --- | --- | --- |
| **Kufar.by** | Region → город/район; категории → подкатегории → параметры; sort новизна/цена; «только с фото» | S6–S7: cascade гео, дерево категорий, расширенные фильтры + sort |
| **Kufar UX-жалобы** | Длинный несортированный список категорий | Поиск по категориям + группировка на главной |
| **OLX** | Sort «Recommended» = text match + freshness + простые signals (без ML в v1) | S8: sort `new` / `price` / `relevant` (q в title выше) |
| **Avito (главная)** | Свежесть + разнообразие категорий (не клеить 10 одинаковых) | S8 light: interleave по categoryId в «горячей» ленте |
| **Collectorium / eBay disclosures** | Paid boost отдельно и честно; organic = freshness + eligibility | Позже: `bumpedAt` / promote; сейчас free bump лимитом |

**Не тащить сейчас:** радиус в км, карта недвижимости, ML-ранкер, маркетплейс компаний, рассрочка.

## Спринты дальше

```text
[S5 дожать]──►[S6 Каталог+гео]──►[S7 Фильтры+]──►[S8 Горячая лента]──►[S9 UX polish]
```

Детали — в [sprint-map-ru.md](sprint-map-ru.md) (S6–S9).

## Риски

| Риск | Митигация |
| --- | --- |
| Сид «все города РБ» раздует миграции/UI | JSON/CSV справочник + lazy select (сначала область, потом locality) |
| «Горячее» без метрик = шум | v1: `bumpedAt` + publishedAt + лёгкий diversity; CTR — фаза 2 |
| Shared VPS | Уже mem/cpu limits |
| Домен не куплен | IP:3010 ок до покупки abyawki.by |
