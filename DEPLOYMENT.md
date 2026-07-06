# Zoho Catalyst Deployment Guide

This repository is prepared for two Catalyst targets:

- AppSail for the Express backend
- Slate for the React/Vite frontend

The original monorepo is preserved. Deployment uses the same source tree with a small number of Catalyst-specific settings and scripts.

## Repository Layout For Deployment

```text
/
├── client/
├── server/
├── shared/
├── deployment/
│   ├── appsail/
│   └── slate/
├── scripts/
├── app-config.json
└── catalyst.json
```

The deployment manifests live at [deployment/appsail/app-config.json](./deployment/appsail/app-config.json) and [deployment/slate/slate-config.json](./deployment/slate/slate-config.json).

## Environment Variables

Create a local `.env` file from [.env.example](./.env.example) and keep secrets out of source control.

Required backend values:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN`

Catalyst runtime values:

- `X_ZOHO_CATALYST_LISTEN_PORT` for AppSail, if provided by the platform
- `PORT` for local or fallback runtime binding

Frontend build values:

- `VITE_API_BASE_URL` for the deployed AppSail API origin
- `VITE_BASE_PATH` if the static host is mounted under a subpath

Optional AI values:

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

## Backend Deployment: AppSail

### What Changed

- The server now binds to `process.env.X_ZOHO_CATALYST_LISTEN_PORT` first, then `process.env.PORT`.
- The root package now exposes a `start` script so AppSail can launch the workspace server directly.
- `app-config.json` now describes a Node deployment instead of the stale Java placeholder.

### CLI Steps

1. Install dependencies.
2. Run the root build.
3. Generate Prisma client artifacts.
4. Deploy the AppSail service using the Catalyst CLI or console.

### Console Steps

1. Open the Catalyst project.
2. Create or open the AppSail service.
3. Point the service at the repository root.
4. Set `command` to `npm start`.
5. Set environment variables in the AppSail console.
6. Deploy and confirm the health endpoint responds successfully.

### Backend Verification

- `npm install`
- `npm run prisma:generate --workspace server`
- `npm run build`
- `npm start`

## Frontend Deployment: Slate

### What Changed

- The Vite config now supports an explicit `VITE_BASE_PATH` for Catalyst hosting.
- The API client already supports `VITE_API_BASE_URL`, which should point to the deployed AppSail origin.

### CLI Steps

1. Install dependencies.
2. Set `VITE_API_BASE_URL` to the deployed AppSail URL.
3. Set `VITE_BASE_PATH` only if Slate serves the app from a subpath.
4. Run the client build.
5. Upload the resulting `client/dist` output to Slate.

### Console Steps

1. Open the Catalyst project.
2. Create or open the Slate static app.
3. Use `client/dist` as the published artifact.
4. Set the deployed API origin as the frontend API base URL.
5. Enable SPA fallback routing so `/login`, `/analytics`, `/reports`, and `/admin` all resolve to `index.html`.

### Frontend Verification

- `npm install`
- `npm run build --workspace client`
- Open the built site and confirm `/login` and protected routes load correctly.

## Deployment Commands

Use the helper scripts in [scripts/](./scripts) for repeatable local validation and deployment prep.

## Rollback

1. Revert the AppSail deployment to the previous successful build.
2. Revert the Slate static bundle to the previous successful `client/dist` release.
3. Restore the previous environment variable set in the Catalyst console.

## Troubleshooting

- If AppSail fails to start, confirm the service is using `npm start` and not the old Java command placeholder.
- If the frontend cannot reach the API, confirm `VITE_API_BASE_URL` points to the AppSail public URL.
- If routes 404 on refresh, confirm SPA fallback is enabled in Slate.
- If Prisma initialization fails, confirm `DATABASE_URL` is reachable from Catalyst.

## Expected URLs

- AppSail backend: the Catalyst-generated service URL
- Slate frontend: the Catalyst-generated static site URL

## Verification Checklist

- `npm install`
- `npm run prisma:generate --workspace server`
- `npm run build`
- `npm run lint`
- `npm test`
- Confirm AppSail health endpoint returns 200
- Confirm Slate loads `/login` and nested routes after refresh