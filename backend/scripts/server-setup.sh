#!/bin/bash
# Ejecutar EN EL SERVIDOR: bash server-setup.sh
# (copiar con scp o pegar los comandos a mano)
set -e
cd "$(dirname "$0")/.." || cd ~/servicios

echo "==> Instalando dependencias del backend Nest..."
npm install \
  @nestjs/common@^11 \
  @nestjs/core@^11 \
  @nestjs/config@^4 \
  @nestjs/jwt@^11 \
  @nestjs/passport@^11 \
  @nestjs/platform-express@^11 \
  @prisma/client@^7 \
  @prisma/adapter-better-sqlite3@^7 \
  better-sqlite3 \
  bcrypt \
  passport \
  passport-jwt \
  class-validator \
  class-transformer \
  reflect-metadata \
  rxjs \
  dotenv

echo "==> Generando cliente Prisma con vuestro schema..."
npx prisma generate

echo "==> Probando arranque manual (Ctrl+C para cortar)..."
node dist/index.js
