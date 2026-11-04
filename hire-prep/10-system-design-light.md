# System design light (для middle, без FAANG-circus)

Говори 5–8 минут. Рисуй коробочки.

## Задача-рамка: «НаТочку» как сервис заявок

1. **Клиенты:** веб орг / диспетчер / мастер (один Next app, роли).  
2. **API:** Server Actions + Prisma сейчас; при росте — REST/Route Handlers.  
3. **Данные:** Postgres (WorkOrder, images keys, users). Файлы — диск/S3-like.  
4. **Auth:** session cookie.  
5. **Инварианты:** FSM на сервере, не на клиенте.  
6. **Масштаб MVP:** один регион РБ, десятки–сотни заявок/день — монолит ок.  
7. **Что добавишь позже:** очередь уведомлений, ledger, поиск мастеров по geo.

### Вопросы, которые зададут

- Почему не микросервисы? → YAGNI, одна команда, одна БД.  
- Как не потерять фото? → storageKey в БД, файлы вне git, бэкап volume.  
- Как считать деньги? → minor int + bps, не float.  
- Узкое место? → upload и список очереди диспетчера → индексы, pagination.

## Мини-упражнение

Нарисуй: Browser → Next server → Prisma → Postgres; Upload → filesystem; FSM в features.
