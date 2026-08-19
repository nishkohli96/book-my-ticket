# Build context must be the monorepo root:
#   docker build -f apps/user-service/Dockerfile .

# === Define reusable versions ===
ARG NODE_VERSION=24-bookworm-slim
ARG PNPM_VERSION=11.20.0

# === Base Image (Builder) ===
FROM node:${NODE_VERSION} AS builder

ARG PNPM_VERSION
WORKDIR /app

RUN npm i -g pnpm@${PNPM_VERSION}

# Copy workspace + package manifests first (for dependency-layer caching)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/user-service/package.json apps/user-service/package.json
COPY packages/types/package.json packages/types/package.json

RUN pnpm install --frozen-lockfile --filter @book-my-ticket/user-service...

# Copy the rest of the source
COPY apps/user-service apps/user-service
COPY packages/types packages/types

# @book-my-ticket/types resolves through its built dist/ (see exports in
# its package.json), so it must be built before the service's own tsc run.
RUN pnpm --filter @book-my-ticket/types run lib:build
RUN pnpm --filter @book-my-ticket/user-service run build

# === Final Image (Production) ===
FROM node:${NODE_VERSION} AS runner

ARG PNPM_VERSION
WORKDIR /app

RUN npm i -g pnpm@${PNPM_VERSION} pm2

# Only the service's own manifest is needed — @book-my-ticket/types is a
# devDependency (type-only import, erased at compile time by tsc).
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/user-service/package.json apps/user-service/package.json

RUN pnpm install --frozen-lockfile --prod --filter @book-my-ticket/user-service

COPY --from=builder /app/apps/user-service/dist apps/user-service/dist
COPY --from=builder /app/apps/user-service/ecosystem.config.js apps/user-service/ecosystem.config.js

WORKDIR /app/apps/user-service

# Expose the port (change if necessary)
EXPOSE 8000

# Start the application
CMD ["pnpm", "start"]
