#!/bin/sh
set -e
npx prisma generate || true
npx prisma db push || true
node dist/src/seed.js || true
node dist/main.js
