#!/bin/sh
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Starting API..."
node dist/main