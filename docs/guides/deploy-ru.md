# Деплой Завхоз (VPS)

**Обновлено:** 04.11.2026  
Продукт: **Завхоз** ([ADR 0004](../adr/0004-product-pivot-zavhoz.md)). Временно — mesh-VPS рядом с feb-code (`/opt/ad-app`, порт **3010**), см. `Documents/server/ad-app/`.  
Скрипт: `Documents/server/scripts/deploy-adapp.ps1` (после `yarn build` standalone).

## Домен

Планируемый FQDN был **`abyawki.by`** (архив бренда Объявки). Покупка отложена — работаем по IP:`3010`.

## Локальный prod-smoke

```powershell
cd "C:\Users\user\Documents\ad app project"
# .env.prod не коммитить
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
curl http://127.0.0.1:3000/api/health
```

## Образ / VPS

- `Dockerfile` — Next **standalone**, `prisma migrate deploy` в `docker/entrypoint.sh` (подтянет миграцию Завхоз `20261104000000_zavhoz_work_orders`)
- Том uploads → `/data/uploads` (compose) / `/app/uploads`
- Health: `GET /api/health`
- После первого migrate — `prisma db seed` (work categories + демо Org/Site) на контейнере/хосте с `DATABASE_URL`

## Выкладка

```powershell
cd "C:\Users\user\Documents\ad app project"
yarn build
& "$env:USERPROFILE\Documents\server\scripts\deploy-adapp.ps1"
curl http://193.181.222.49:3010/api/health
```

Секреты только в `/opt/ad-app/.env` на VPS.
