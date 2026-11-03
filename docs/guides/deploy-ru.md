# Деплой Объявки BY (VPS)

**Обновлено**: 03.11.2026  
Продукт: **Объявки BY**. Временно — mesh-VPS рядом с feb-code (`/opt/ad-app`, лимиты RAM/CPU), см. `Documents/server/ad-app/`.  
Канон стека: [ADR 0001](../adr/0001-core-stack.md).

## Домен

Планируемый FQDN: **`abyawki.by`** (+ `www`) — латиница от бел. **Аб'яўкі**.  
**Покупка домена отложена** — работаем без публичного `.by`: временный host/IP/port на mesh-VPS рядом с feb-code.

## Локальный prod-smoke

```powershell
cd "C:\Users\user\Documents\ad app project"
# .env.prod не коммитить
@"
POSTGRES_PASSWORD=$( -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 24 | ForEach-Object {[char]$_}) )
BETTER_AUTH_SECRET=$( -join ((48..57)+(65..90)+(97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_}) )
BETTER_AUTH_URL=http://127.0.0.1:3000
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
ADAPP_PORT=3000
"@ | Set-Content -Encoding utf8 .env.prod

docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
curl http://127.0.0.1:3000/api/health
```

Остановка: `docker compose -f docker-compose.prod.yml --env-file .env.prod down`.

## Образ

- `Dockerfile` — Next **standalone**, `prisma migrate deploy` в `docker/entrypoint.sh`
- Том `adapp_uploads` → `/app/uploads`
- Health: `GET /api/health` (проверка Postgres)

## VPS (общий хост lendings)

1. Собрать и прогнать smoke локально.
2. Завести DNS / nginx upstream на порт (или внутренний `expose`) — по аналогии с febcode в `lendings-vps-infra`.
3. Секреты только на сервере (`.env` / Docker secrets), не в git.
4. Вынос на отдельный хост — новый ADR.

Пока нет отдельного домена — достаточно `docker compose.prod` на машине/VPS и проверка `/api/health`.
