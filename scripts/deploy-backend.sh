#!/usr/bin/env bash
set -euo pipefail

# Prepares the AEGIS backend for Zoho Catalyst AppSail.
# The script validates the backend build contract without changing application logic.

echo 'Installing dependencies at the repository root...'
npm install

echo 'Generating Prisma artifacts for the server workspace...'
npm run prisma:generate --workspace server

echo 'Building the full workspace...'
npm run build

echo 'Backend validation complete. Deploy AppSail with the Catalyst console or CLI next.'