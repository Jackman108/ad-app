# Шпаргалка перед собесом (1 экран)

## Я

Middle full-stack TS: Next.js · React · Node · Prisma · SQL.  
Кейс: **НаТочку** — B2B заявки на объект (диспетчер → мастер → фото → закрытие).

## Next App Router

- Server Component по умолчанию; `'use client'` только для state/DOM  
- Server Actions = мутации с сервера + `revalidatePath`  
- Секреты только на сервере (`NEXT_PUBLIC_*` не для ключей)

## React

- Хуки сверху, deps в useEffect, cleanup  
- Controlled input: value + onChange  
- Ключи в списках стабильные

## JS/TS

- `===`, замыкание, event loop: microtask → macrotask  
- Union + narrowing; `unknown` лучше `any`  
- Деньги: **int копейки**, не float

## Prisma / API

- Миграции версионируют схему  
- Валидация Zod на входе  
- N+1 → `include`/`select`  
- Индексы на фильтры (status, orgId)

## Auth

- Session cookie (httpOnly) vs JWT — плюсы/минусы  
- Пароль только хэш

## НаТочку (архитектура)

```
SUBMITTED → ESTIMATED → OFFERED → ACCEPTED
  → IN_PROGRESS → AWAITING_CONFIRM → CLOSED
```

- Переходы только FSM (`canTransitionWorkOrder`)  
- Use-case в `features/`, не Prisma в JSX  
- Комиссия `platformFeeBps` (2000 = 20%): клиент / платформа / мастер  

## Поведение

STAR: Situation → Task → Action → Result.  
Почему ищешь работу: закончилось финансирование своего продукта; хочу команду и рост; кейс в портфолио.
