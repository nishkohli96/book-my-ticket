# === Define reusable versions ===
ARG NODE_VERSION=24-bookworm-slim
ARG PNPM_VERSION=11.20.0

# === Base Image (Builder) ===
FROM node:${NODE_VERSION} AS builder

# Use the same ARGs inside this stage
ARG PNPM_VERSION

# Set working directory
WORKDIR /app

# Copy package files first (for caching dependencies)
COPY --chown=node:node package.json tsconfig.json pnpm-lock.yaml ./

# Install dependencies
RUN npm i -g pnpm@${PNPM_VERSION}
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY --chown=node:node . .

# Build TypeScript app
RUN pnpm build

# === Final Image (Production) ===
FROM node:${NODE_VERSION} AS runner

# Use the same ARG again for this stage
ARG PNPM_VERSION

# Set working directory
WORKDIR /app

# Copy built application & dependencies from builder stage
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/ecosystem.config.js ./
COPY --from=builder /app/dist ./dist

# Install pnpm & pm2
RUN npm i -g pnpm@${PNPM_VERSION} pm2
RUN pnpm install --frozen-lockfile --production

# Expose the port (change if necessary)
EXPOSE 8000

# Start the application
CMD ["pnpm", "start"]
