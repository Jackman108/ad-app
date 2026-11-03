# Чистый код и архитектура (Ad App)

**Обновлено**: 03.11.2026

Практические правила для этого репозитория. Не теория ради теории: применяем, когда снижает связность и ускоряет поддержку.

## Clean Architecture (в монолите Next)

```text
UI / routes (app/)           → delivery
features/*/model             → use-cases (application)
entities/*/model             → domain (DTO, FSM, инварианты)
shared/lib + Prisma/Auth     → adapters / infrastructure
```

- Бизнес-правила **не** живут в JSX и не знают про HTTP cookies напрямую.
- Server Actions в `app/**/actions.ts` — тонкая обёртка: session → use-case → revalidate/redirect.
- Prisma вызываем из features/shared adapters, не размазываем raw-queries по компонентам.

См. также [architecture-ru.md](architecture-ru.md).

## SOLID (как у нас)

| Принцип | Практика |
| --- | --- |
| **S** | Один use-case — один файл/функция (`createAndPublishListing`, `sendMessage`) |
| **O** | Новые поля категории → `attributes` JSONB / новые features, без ломки Listing core |
| **L** | DTO: `ListingPublic` ⊆ контактных данных; не подсовывать «полный» Prisma row в UI |
| **I** | Узкие порты: не тащить SMS-клиент в create-listing |
| **D** | UI зависит от use-case и DTO, не от схемы таблиц |

## Чистый код

- Имена по делу (`toListingPublic`, не `map1`)
- Функции короткие; ветвления FSM — в `canTransitionListing`, не в форме
- Без мёртвого кода и «на всякий случай»
- Ошибки домена — явный `Error`/`Result` на границе action
- Комментарии только где неочевидный инвариант

## Паттерны (когда полезны)

| Паттерн | Где |
| --- | --- |
| DTO / Mapper | `entities/listing/model/dto.ts` |
| FSM | `entities/listing/model/status.ts` |
| Repository-lite | prisma-вызовы внутри feature model (без лишнего слоя до боли) |
| Adapter | Better Auth, filesystem storage |
| Guard / ACL | session check в actions; телефон только auth |

Не внедряем: CQRS, Event Sourcing, microservices — без доказанной нужды (YAGNI).

## Производительность и поддержка

- Индексы Prisma на ленте (`status+publishedAt`, category, locality)
- `take` на списках; не грузить лишние relations
- RSC по умолчанию; client components только для форм/интерактива
- Картинки: отдельный route, не base64 в БД
- После изменений — `tsc` / точечный smoke; docs + rules синхронно
