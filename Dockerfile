# Install dependencies only when needed
FROM oven/bun:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --minify --splitting


# Build the app with cache dependencies
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run nest build


# Production image, copy all the files and run next
FROM oven/bun:alpine AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install --minify --splitting
COPY --from=builder /app/dist ./dist

RUN bun run start:prod