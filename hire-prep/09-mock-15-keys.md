# Ключи к mock-15 (коротко — не подглядывай сразу)

1. Роль + НаТочку 2 мин + стек.  
2. RSC на сервере/данные; client — state/DOM; `'use client'`.  
3. Мутация на сервере из формы; не для тяжёлого CPU без очереди.  
4. Функция + внешняя переменная; var в for → одна переменная.  
5. Microtasks (then) до macrotask (timeout).  
6. Статика типов; unknown безопаснее any.  
7. value+onChange vs ref.  
8. Только top-level; []/deps; stale closure.  
9. Округление float ломает деньги; int копейки.  
10. Версии схемы; push без истории на shared prod опасен.  
11. Запрос в цикле → include/один query.  
12. Session серверная; JWT самодостаточен — XSS/отзыв.  
13. Нарисовать цепочку статусов НаТочку.  
14. features use-case → prisma shared; app тонкий.  
15. STAR без токсичности.

Развёрнуто: [03-qa-fullstack.md](03-qa-fullstack.md).
