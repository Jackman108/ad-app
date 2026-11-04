# Самоподготовка к собесу — Full-stack TypeScript (RU)

Вопрос → короткий ответ → варианты уточнений. Говори вслух 1–2 мин на вопрос.

Стек фокуса: JS/TS, React, Next.js App Router, Node, Prisma/SQL, auth, твой Завхоз (FSM/FSD).

---

## 1. JavaScript

**Q: Чем `let`/`const` отличаются от `var`?**  
A: Блочная область видимости, нет hoisting как у var (TDZ). `const` — нельзя переназначить binding.  
Варианты: temporal dead zone; const и мутация объекта.

**Q: Что такое замыкание?**  
A: Функция помнит лексическое окружение, где создана.  
Варианты: цикл + var vs let; модуль как замыкание.

**Q: Event loop: microtasks vs macrotasks?**  
A: Сначала call stack, потом microtasks (Promise.then, queueMicrotask), потом macrotasks (setTimeout, I/O).  
Варианты: порядок `setTimeout(0)` и `Promise.resolve().then`.

**Q: `==` vs `===`?**  
A: `===` без приведения типов. В TS/современном коде почти всегда `===`.

**Q: Что такое Promise / async-await?**  
A: Promise — результат асинхронной операции; async-await — синтаксис над промисами. Ошибка → try/catch или .catch.  
Варианты: Promise.all / allSettled / race.

**Q: Деструктуризация, spread, rest?**  
A: Уметь разобрать объект/массив; rest в параметрах; shallow copy через spread.

**Q: this в обычной функции vs стрелка?**  
A: Стрелка берёт this из лексики; у function — от вызова (метод, bind, call).

---

## 2. TypeScript

**Q: Зачем TypeScript?**  
A: Статическая проверка, лучше рефакторинг, контракты API.  
Варианты: any vs unknown; type vs interface.

**Q: Что такое union / narrowing?**  
A: `string | number`; сужение через typeof, in, discriminants.

**Q: generics простыми словами?**  
A: Параметр типа: `function id<T>(x: T): T`.  
Варианты: generic в React `PropsWithChildren`.

**Q: utility types: Partial, Pick, Omit?**  
A: Кратко что делают + когда в DTO.

**Q: enum vs union string?**  
A: Часто предпочитают `as const` + union — меньше runtime мусора.

---

## 3. React

**Q: Что такое Virtual DOM / reconciliation (упрощённо)?**  
A: React сравнивает деревья и минимально обновляет DOM. Ключи в списках важны.

**Q: useState / useEffect — правила?**  
A: Хуки только на верхнем уровне; зависимости useEffect; cleanup.  
Варианты: бесконечный цикл из плохого deps; stale closure.

**Q: controlled vs uncontrolled input?**  
A: value+onChange vs ref/defaultValue.

**Q: lifting state up?**  
A: Общее состояние поднимаем к ближайшему родителю.

**Q: memo / useMemo / useCallback — когда?**  
A: Не по умолчанию; при дорогом рендере / стабильных колбэках детям.  
(У вас в правилах — не раздувать useMemo без нужды.)

**Q: Error Boundary?**  
A: Ловит ошибки рендера в дереве; не ловит async в event handlers без доп. обработки.

---

## 4. Next.js (App Router) — твой козырь

**Q: RSC vs Client Component?**  
A: Server по умолчанию — данные на сервере, меньше JS на клиенте; `'use client'` для state/эффектов/браузерных API.  
Варианты: нельзя передать функцию-сервер в client без server actions.

**Q: Server Actions?**  
A: Мутации с сервера (формы); у вас estimate/confirm через actions + use-case.  
Варианты: revalidatePath.

**Q: Зачем App Router layouts?**  
A: Общий UI/шапка без ремаунта на каждый route.

**Q: SSR / SSG / CSR — когда?**  
A: Динамичные кабинетные страницы — dynamic/SSR; лендинг можно статичнее.

**Q: Как не светить секреты?**  
A: Только server; env без NEXT_PUBLIC_ для секретов.

---

## 5. Node / API

**Q: REST: идемпотентность?**  
A: GET/PUT/DELETE идемпотентны в идеале; POST — создание.  
Варианты: 401 vs 403; 404 vs 400.

**Q: Валидация входа?**  
A: Zod (у вас) на границе; не доверять клиенту.

**Q: Ошибки в API?**  
A: Понятные сообщения; не утекать stack в prod; логировать на сервере.

**Q: Middleware / rate limit?**  
A: Защита auth и мутаций от брутфорса (у вас уже мысль в продукте).

---

## 6. Prisma / SQL / деньги

**Q: Почему цена в копейках int, не float?**  
A: Деньги и float → ошибки округления; `priceMinor` + BYN.  
Варианты: комиссия в bps (2000 = 20%).

**Q: Что такое миграция?**  
A: Версионирование схемы БД; migrate deploy на prod.  
Варианты: migrate vs db push.

**Q: N+1 проблема?**  
A: Много запросов в цикле; лечится include/select / одним запросом.

**Q: Индексы?**  
A: На поля фильтра/сортировки (status, organizationId…); не индексировать всё подряд.

**Q: Транзакция когда?**  
A: Несколько записей должны пройти атомарно (позже ledger).

---

## 7. Auth

**Q: Session vs JWT?**  
A: Session — сервер хранит состояние; JWT — клиент носит токен (плюс/минусы). Better Auth у вас — cookie session модель.  
Варианты: XSS и httpOnly cookie; CSRF для cookie-based.

**Q: Почему пароль не храним plain?**  
A: Хэш (bcrypt/argon); сравнение constant-time по возможности.

---

## 8. Архитектура (Завхоз) — расскажи как историю

**Q: Что такое use-case / Clean Architecture у вас?**  
A: Мутации в `features/*/model`, не сырой Prisma в JSX; app — тонкие actions.  
Варианты: FSD слои вниз.

**Q: FSM WorkOrder?**  
A: Статусы только через `canTransitionWorkOrder`; нельзя прыгнуть CLOSED из SUBMITTED.  
Нарисовать: SUBMITTED→ESTIMATED→OFFERED→ACCEPTED→IN_PROGRESS→AWAITING_CONFIRM→CLOSED.

**Q: Зачем DTO без телефона?**  
A: Публичные контракты не утекают ПДн (из старого ADR объявлений — принцип тот же).

**Q: YAGNI?**  
A: Нет микросервисов/Redis «на вырост» без сигнала.

**Q: Комиссия платформы?**  
A: `platformFeeBps`, split клиент / платформа / мастер в UI; ledger — следующий этап.

---

## 9. CSS / UI

**Q: CSS Modules vs Tailwind?**  
A: У вас Modules + tokens — изоляция классов, дизайн-токены; честно сказать почему не Tailwind (ADR).

**Q: Адаптив?**  
A: clamp, flex/grid, mobile-first по необходимости.

---

## 10. Git / процесс

**Q: Conventional Commits?**  
A: feat/fix/docs…; PR не обязателен на solo — но понимать ветки.  
Варианты: зачем не commit secrets.

**Q: Как отладишь баг на prod?**  
A: Логи, воспроизведение, feature flag / hotfix, миграции осторожно.

---

## 11. Поведенческие (RU)

**Q: Расскажи о проекте.**  
A: Завхоз — B2B заявки для точек РБ; роли орг/диспетчер/мастер; FSM; Prisma; Next. Проблема → решение → стек → чему научился.

**Q: Конфликт / дедлайн?**  
A: STAR: Situation–Task–Action–Result.

**Q: Почему уходишь с «своего» продукта?**  
A: Честно: закончилось финансирование; хочу команду и рост; продукт в портфолио.

---

## Бесплатные ресурсы (RU / читается без сильного EN)

| Тема | Ресурс |
| --- | --- |
| JS глубоко | learn.javascript.ru |
| TS | typescript-lang.org/docs (EN, но с примерами) + статьи на Habr «TypeScript для …» |
| React | ru.react.dev |
| Next | nextjs.org/docs (смотреть App Router) — параллельно свои routes |
| SQL | sql-ex.ru / stepik бесплатные курсы SQL |
| Собесы JS | «Собеседование JavaScript» подборки на Habr; вопросы senior-frontend.ru (фильтруй устаревшее) |
| Алгоритмы (лёгко) | code-basics.com, leetcode Easy 5–10 задач (массивы/хэш) — не увлекаться |
| Nest (если спросят) | docs.nestjs.com + свой auth_nestjs |

Практика: каждый день **10 вопросов вслух** из этого файла + 1 рассказ про FSM Завхоз на таймер 3 минуты.

---

## Мини-чеклист накануне собеса

- [ ] Нарисовать FSM на бумаге  
- [ ] Объяснить priceMinor и 20% bps  
- [ ] RSC vs client одной минутой  
- [ ] CV + ссылки GitHub открыты  
- [ ] 2 вопроса работодателю готовы («стек команды», «онбординг»)  
