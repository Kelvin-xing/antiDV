# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app
ENV HUSKY=0 \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG XIAOAN_API_ORIGIN=http://xiaoan-api
ARG NEXT_PUBLIC_ENABLE_DEBUG_EXPORT=false
ARG NEXT_PUBLIC_ENABLE_CHAT_DEBUG=false

ENV XIAOAN_API_ORIGIN=$XIAOAN_API_ORIGIN \
    NEXT_PUBLIC_ENABLE_DEBUG_EXPORT=$NEXT_PUBLIC_ENABLE_DEBUG_EXPORT \
    NEXT_PUBLIC_ENABLE_CHAT_DEBUG=$NEXT_PUBLIC_ENABLE_CHAT_DEBUG

RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
