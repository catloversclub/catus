#!/bin/sh
set -e

echo "⏳ Running Prisma migrate deploy..."
until nc -z postgres 5432; do echo "waiting for postgres..."; sleep 2; done
pnpm dlx prisma migrate deploy

echo "🚀 Starting NestJS API..."
exec node dist/main.js