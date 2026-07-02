# ==========================
# Build constants
# ==========================
ARG NODE_VERSION=24
ARG ALPINE_VERSION=3.23
ARG PNPM_VERSION=11.9.0

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder

# Set working directory in the container
WORKDIR /app

COPY --chown=node:node package.json tsconfig.json pnpm-lock.yaml ./

# Install dependencies
RUN npm i -g pnpm@${PNPM_VERSION}

RUN pnpm install --frozen-lockfile

# Copy the rest of the application code to the container
COPY --chown=node:node . .

# Build the Next.js app
RUN pnpm build

# Production image
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS runner

# Set working directory in the container
WORKDIR /app

# Copy only the necessary build files from the builder stage
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm i -g pnpm@${PNPM_VERSION}
RUN pnpm install --frozen-lockfile --production

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Optional: Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Set environment to production
ENV NODE_ENV production

# Expose the port the Next.js app runs on (default: 3000)
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
