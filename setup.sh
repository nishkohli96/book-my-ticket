#!/bin/bash

# Exit immediately if any command fails (i.e., returns a non-zero exit code).
set -euo pipefail

REQUIRED_PNPM_VERSION="11.20.0"
REQUIRED_TURBO_VERSION="2.10.0"

echo "🏁 Initiating Setup..."
echo "🔍 Checking for global dependencies..."

# Load NVM (optional - falls back to whatever `node` is already on PATH,
# e.g. when Node was provisioned by CI's actions/setup-node)
export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  if [ ! -f ".nvmrc" ]; then
    echo "❌ .nvmrc not found."
    exit 1
  fi
  echo "🔧 Using Node version from .nvmrc..."
  nvm install
  nvm use
elif command -v node &> /dev/null; then
  echo "⚠️ nvm not found, using system Node."
else
  echo "❌ Neither nvm nor node is installed."
  exit 1
fi
echo "✅ Node version: $(node -v)"

# Check for pnpm
echo "🔍 Checking for pnpm..."
if [ "$(pnpm -v 2>/dev/null || true)" != "$REQUIRED_PNPM_VERSION" ]; then
  echo "📦 Installing pnpm@$REQUIRED_PNPM_VERSION..."
  npm install -g pnpm@$REQUIRED_PNPM_VERSION
else
  echo "✅ pnpm@$REQUIRED_PNPM_VERSION already installed."
fi

# Check for Turbo
echo "🔍 Checking for Turbo..."
if [ "$(turbo --version 2>/dev/null || true)" != "$REQUIRED_TURBO_VERSION" ]; then
  echo "📦 Installing turbo@$REQUIRED_TURBO_VERSION..."
  npm install -g turbo@$REQUIRED_TURBO_VERSION
else
  echo "✅ turbo@$REQUIRED_TURBO_VERSION already installed."
fi

# Check for pm2
if ! command -v pm2 &> /dev/null; then
  echo "🚀 pm2 not found. Installing..."
  npm install -g pm2
else
  echo "✅ pm2 is already installed."
fi

# Clean old dependencies
echo "🧹 Removing old dependencies..."
find . -name node_modules -type d -prune -exec rm -rf {} + 2>/dev/null || true

# Install dependencies
echo "📁 Installing project dependencies..."
pnpm install

echo "Linting workspace..."
pnpm lint

echo "🛠️  Building the apps!"
turbo build

echo "✅ Setup complete!"
