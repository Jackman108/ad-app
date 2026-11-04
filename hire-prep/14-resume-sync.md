# Синхронизация резюме

**Канон (source of truth):** [07-cv-draft-ru.md](07-cv-draft-ru.md)  
Акцент: **коммерческий опыт** (Пауэр-Строй → Лайкит → Вэб Моушн → ИП). Пет-проекты — вторично / в портфолио.

## Поверхности

| ID | Где | URL / путь | Роль |
|----|-----|------------|------|
| `canon` | hire-prep | `07-cv-draft-ru.md` | Правки сначала сюда |
| `hh-fs` | HH.ru Full-stack | `https://hh.ru/resume/7ed4d4e1ff0b1738140039ed1f517265365770` | Title: Full-stack Developer (TypeScript / Next.js / Node) |
| `hh-fe` | HH.ru Frontend | `https://hh.ru/resume/479212e7ff0ccdd4620039ed1f65793448324c` | Title: Frontend-разработчик; те же даты/компании, «О себе» с FE-акцентом |
| `pdf` | GitHub `Jackman108/cv` | `Korobov-fullstack-TS-2026.pdf` | EN PDF из `cv-work/build_cv.py` |
| `site` | github.io | `https://jackman108.github.io/` | Краткий профиль + ссылки на проекты |
| `snapshot` | hire-prep | `resume-snapshot-ru.md` | Выгрузка текста после правок HH |

## Правила синхрона

1. Меняешь даты / обязанности / «О себе» → обнови `07-cv-draft-ru.md`, затем HH (`hh-fs` + `hh-fe`), затем PDF/site при релизе.
2. На HH опыт общий через «резюме с этим местом»: оба чекбокса (Full-stack + Frontend) на актуальных местах.
3. Пет-проекты (НаТочку, Job Search) — только блок проектов / портфолио, не вместо коммерческих буллетов.
4. После правок HH — обнови `resume-snapshot-ru.md` и строку **Last synced** ниже.

## Last synced

- **Дата:** 2026-11-04 (ночь)  
- **Что выровнено:** Пауэр-Строй (ноя 2024 — сейчас), Лайкит (фев 2023 — окт 2024), «О себе» commercial-first на обоих HH; PDF about + github.io hero — commercial-first; Job Search = один продукт в каноне; **зарплата на обоих HH: 100 000 ₽ на руки** (канон 3000–4000 BYN → ~100k RUB).  
- **Открыто:** skill **674 Средний** фейл, ретрай с **05.12.2026**; до тех пор Базовый/Продвинутый вручную. Банк: `hh-skill-tests-qa.md`.

## Чеклист перед откликами

- [ ] Даты опыта совпадают на `hh-fs` и `hh-fe`
- [ ] «О себе» без лида с пет-проектов
- [ ] Навыки на HH ≈ блок Strong в `07-cv-draft-ru.md`
- [ ] PDF и github.io не старше канона больше чем на 1 правку опыта
- [ ] Snapshot обновлён
