# ADR 0003 — Доменная модель и границы MVP

**Обновлено**: 03.11.2026

## Статус

Принято.

## Контекст

Нужна основа для TypeScript-типов, Prisma и use-case до scaffold. Ориентиры: Kufar (region/area, категории), OLX-класс (listing+chat), marketplace patterns (единый User, JSONB attributes, conversation unique, favorites), Sharetribe (гибкие атрибуты). Требования продукта: только РБ, in-app переписка, телефон только авторизованным, частные лица.

## Решение

1. Канон сущностей и инвариантов — [docs/guides/domain-model-ru.md](../guides/domain-model-ru.md).
2. MVP-таблицы: User (+ Better Auth), Category, Region, Locality, Listing, ListingImage, Conversation, Message, Favorite, Report.
3. Цена — `priceMinor` (копейки) + `BYN`; статусы Listing — явный FSM в use-case.
4. Категорийные доп.поля — `Listing.attributes` JSONB; полноценный EAV — фаза 2.
5. Гео — Region + Locality (не свободный текст города как единственный источник).
6. Медиа — отдельная `ListingImage`, не только массив URL в JSON.
7. Один User на роли покупатель/продавец; без Buyer/Seller tables.
8. Фаза 2 (Notification, Review, Payment, …) не создавать в первой миграции.

## Последствия

Плюсы: ясный контракт для агента и кода; безопасность контактов заложена в DTO; рост категорий без миграций колонок.

Минусы: JSONB-фильтры слабее нормализованного EAV; sellerId денорм. в Conversation нужно держать согласованным при смене владельца listing (в MVP владелец не меняется).

## Проверка готовности

- [x] Документ domain-model написан
- [x] MVP / phase2 / anti-model разделены
- [ ] Prisma schema при scaffold соответствует канону
- [ ] Сиды Region/Locality/Category РБ
