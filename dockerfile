FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

# Pass as build arg — never baked into the image
RUN DATABASE_URL="mongodb://placeholder:placeholder@localhost/placeholder" npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

RUN chmod +x ./scripts/start.sh

EXPOSE 3001

CMD ["sh", "./scripts/start.sh"]