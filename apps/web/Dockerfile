# Build context must be the monorepo root:
#   docker build -f apps/web/Dockerfile .

# ==========================
# Build constants
# ==========================
ARG NODE_VERSION=24-bookworm-slim
ARG PNPM_VERSION=11.20.0

# === Base Image (Builder) ===
FROM node:${NODE_VERSION} AS builder

ARG PNPM_VERSION
WORKDIR /app

RUN npm i -g pnpm@${PNPM_VERSION}

# Copy workspace + package manifests first (for dependency-layer caching)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/common/package.json packages/common/package.json

RUN pnpm install --frozen-lockfile --filter @book-my-ticket/web...

# Copy the rest of the source
COPY apps/web apps/web
COPY packages/common packages/common

# @book-my-ticket/common resolves through its built dist/ (see exports in
# its package.json), so it must be built before Next's own build - the
# app imports real zod schemas from it at build and runtime, not just types.
RUN pnpm --filter @book-my-ticket/common run lib:build
RUN pnpm --filter @book-my-ticket/web run build

# === Final Image (Production) ===
FROM node:${NODE_VERSION} AS runner

ARG PNPM_VERSION
WORKDIR /app

RUN npm i -g pnpm@${PNPM_VERSION}

# @book-my-ticket/common is a real runtime dependency (its zod schemas are
# used at request time in the API routes, not just types), so it needs its
# own manifest and built dist/ in this stage too - not just web's manifest.
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/common/package.json packages/common/package.json

RUN pnpm install --frozen-lockfile --prod --filter @book-my-ticket/web...

COPY --from=builder /app/packages/common/dist packages/common/dist
COPY --from=builder /app/apps/web/.next apps/web/.next
COPY --from=builder /app/apps/web/public apps/web/public

WORKDIR /app/apps/web

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Expose the port the Next.js app runs on (default: 3000)
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
