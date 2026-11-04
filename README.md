# НаТочку (ad-app)

B2B **field-service** для точек в Беларуси: заявка → диспетчер → мастер → фотоотчёт → подтверждение.

Репозиторий: https://github.com/Jackman108/ad-app  
Ранее: C2C «Объявки BY» (код заморожен) → пивот «Завхоз» → бренд UI **НаТочку** ([ADR 0004](docs/adr/0004-product-pivot-zavhoz.md)).

## Стек

Next.js App Router · TypeScript · FSD · Prisma · PostgreSQL · Better Auth · CSS Modules + design tokens · Yarn 1.22 · Docker → VPS (временно `:3010`)

## Что умеет (MVP)

- Организация / объект (Site), категории работ с базовым прайсом
- Заявка с фото «до», FSM статусов (`canTransitionWorkOrder`)
- Диспетчер (ADMIN): оценка цены, комиссия платформы 20% (UI split), назначение мастера
- Мастер: accept → в работу → фото «после»
- Клиент: подтвердить закрытие или вернуть на доработку
- Лендинг `/`, RU-лейблы статусов

## Быстрый старт

```bash
yarn install
docker compose up -d db
yarn prisma migrate deploy
yarn db:seed
yarn dev
```

Нужны переменные из `.env.example` (не коммитить секреты).

## Документация

| Документ | Содержание |
| --- | --- |
| [docs/README.md](docs/README.md) | Индекс |
| [docs/guides/sprint-map-zavhoz-ru.md](docs/guides/sprint-map-zavhoz-ru.md) | Спринты Z0–Z7 |
| [docs/guides/domain-model-zavhoz-ru.md](docs/guides/domain-model-zavhoz-ru.md) | Домен |
| [hire-prep/](hire-prep/) | Подготовка к найму (вынести в отдельный репо) |

## Тесты

```bash
yarn tsc --noEmit
yarn test:e2e -- e2e/zavhoz-core.spec.ts
```
