# Документация — Завхоз (репо ad-app)

**Обновлено**: 04.11.2026

**Продукт:** B2B «Завхоз на аутсорсе» (РБ).  
**Было:** Объявки BY / abyawki.by — **заморожено** ([ADR 0004](adr/0004-product-pivot-zavhoz.md)).  
Репо: https://github.com/Jackman108/ad-app

Индекс живых документов. Один источник правды — без копипасты между файлами.

## Текущее состояние

| Область | Статус |
| --- | --- |
| Продукт | **Завхоз** · пивот 04.11 |
| Бизнес-модель | [guides/business-model-zavhoz-ru.md](guides/business-model-zavhoz-ru.md) |
| Код объявлений | S0–S7 заморожен (reference) |
| Стек | **Принято** — [ADR 0001](adr/0001-core-stack.md) |
| Auth / контакт | [ADR 0002](adr/0002-auth-and-contact.md) — пересмотр под B2B роли |
| Домен объявлений | Архив — [ADR 0003](adr/0003-domain-model.md) |
| Пивот | **Принято** — [ADR 0004](adr/0004-product-pivot-zavhoz.md) |
| Домен Завхоз | **Принято** — [ADR 0005](adr/0005-zavhoz-domain-model.md) |
| Спринты Завхоз | [guides/sprint-map-zavhoz-ru.md](guides/sprint-map-zavhoz-ru.md) · следующий **Z1** schema |

## Гайды

| Файл | Тема |
| --- | --- |
| [guides/business-model-zavhoz-ru.md](guides/business-model-zavhoz-ru.md) | Value prop, monetization, MVP-запуск |
| [guides/strategy-plan-ru.md](guides/strategy-plan-ru.md) | Фазы Z0–Z4 |
| [guides/sprint-map-zavhoz-ru.md](guides/sprint-map-zavhoz-ru.md) | Спринты Z0–Z7 |
| [guides/domain-model-zavhoz-ru.md](guides/domain-model-zavhoz-ru.md) | Домен Завхоз |
| [guides/environment-ru.md](guides/environment-ru.md) | Инструменты и локальное окружение |
| [guides/git-workflow-ru.md](guides/git-workflow-ru.md) | Commit + push после задачи |
| [guides/architecture-ru.md](guides/architecture-ru.md) | Архитектура / FSD (обновить под Завхоз) |
| [guides/domain-model-ru.md](guides/domain-model-ru.md) | Домен объявлений (архив) |
| [guides/sprint-map-ru.md](guides/sprint-map-ru.md) | Спринты объявлений (архив S0–S7) |
| [guides/clean-code-ru.md](guides/clean-code-ru.md) | Clean Architecture, SOLID |
| [guides/deploy-ru.md](guides/deploy-ru.md) | Docker prod + VPS |

## ADR

| Файл | Тема |
| --- | --- |
| [adr/README.md](adr/README.md) | Реестр решений |
| [adr/0001-core-stack.md](adr/0001-core-stack.md) | Стек |
| [adr/0002-auth-and-contact.md](adr/0002-auth-and-contact.md) | Auth / контакт |
| [adr/0003-domain-model.md](adr/0003-domain-model.md) | Домен объявлений (архив) |
| [adr/0004-product-pivot-zavhoz.md](adr/0004-product-pivot-zavhoz.md) | Пивот на Завхоз |
| [adr/0005-zavhoz-domain-model.md](adr/0005-zavhoz-domain-model.md) | Домен WorkOrder / Org / Site |

## Changelog

[changelog.md](changelog.md)
