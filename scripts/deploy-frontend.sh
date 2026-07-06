#!/usr/bin/env bash
set -euo pipefail

# Prepares the AEGIS frontend for Zoho Catalyst Slate.
# The generated static files will be written to client/dist.

echo 'Installing dependencies at the repository root...'
npm install

echo 'Building the client workspace...'
npm run build --workspace client

echo 'Frontend build complete. Upload client/dist to Slate.'