#!/bin/sh
set -eu
if [ -n "${DATABASE_URL:-}" ]; then
  echo "prisma migrate deploy…"
  npx prisma migrate deploy
fi
exec node server.js
