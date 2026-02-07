#!/bin/sh
set -e
if [ -d prisma ]; then
  npx prisma generate || true
  npx prisma db push || true
fi
node dist/main.js
