<#
.SYNOPSIS
    Runs the full AEGIS deployment preparation flow.

.DESCRIPTION
    This script validates backend and frontend build output in one pass so the repository
    can be deployed to Catalyst with minimal manual work.
#>

$ErrorActionPreference = 'Stop'

Write-Host 'Installing dependencies at the repository root...'
npm install

Write-Host 'Generating Prisma artifacts for the server workspace...'
npm run prisma:generate --workspace server

Write-Host 'Building the full workspace...'
npm run build

Write-Host 'Deployment preparation complete for AppSail and Slate.'