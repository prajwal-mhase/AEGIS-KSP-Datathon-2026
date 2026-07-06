#!/usr/bin/env bash
set -euo pipefail

# Runs the full AEGIS deployment preparation flow for both Catalyst targets.

echo 'Installing dependencies at the repository root...'
npm install

echo 'Generating Prisma artifacts for the server workspace...'
npm run prisma:generate --workspace server

echo 'Building the full workspace...'
npm run build

echo 'Deployment preparation complete for AppSail and Slate.'