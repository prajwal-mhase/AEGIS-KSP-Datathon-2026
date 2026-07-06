<#
.SYNOPSIS
    Prepares the AEGIS frontend for Zoho Catalyst Slate.

.DESCRIPTION
    This script validates the frontend build contract and leaves the generated assets in
    client/dist for upload to Slate.
#>

$ErrorActionPreference = 'Stop'

Write-Host 'Installing dependencies at the repository root...'
npm install

Write-Host 'Building the client workspace...'
npm run build --workspace client

Write-Host 'Frontend build complete. Upload client/dist to Slate.'