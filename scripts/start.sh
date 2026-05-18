#!/bin/sh
echo "Syncing Prisma schema..."
npx prisma db push --accept-data-loss
echo "Starting API..."
node dist/main