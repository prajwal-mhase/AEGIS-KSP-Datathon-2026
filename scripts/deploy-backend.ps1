<#
.SYNOPSIS
    Prepares the AEGIS backend for Zoho Catalyst AppSail.

.DESCRIPTION
    This script runs the backend validation steps that should succeed before you push
    the AppSail deployment through Catalyst. It does not rewrite the application.
#>

$ErrorActionPreference = 'Stop'

Write-Host 'Installing dependencies at the repository root...'
npm install

Write-Host 'Generating Prisma artifacts for the server workspace...'
npm run prisma:generate --workspace server

Write-Host 'Building the full workspace...'
npm run build

Write-Host 'Backend validation complete. Deploy AppSail with the Catalyst console or CLI next.'