# AppSail Deployment Notes

This folder documents the Node/Express AppSail contract for AEGIS.

Use the repository root as the deployment source, because the backend depends on the shared workspace packages.

Expected runtime behavior:

- Start command: `npm start`
- Build path: repository root
- Port binding: `X_ZOHO_CATALYST_LISTEN_PORT` first, then `PORT`
- Production mode: `NODE_ENV=production`

Required environment variables:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN`

Optional environment variables:

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

If you need to stage files for a separate deployment bundle, copy the built server output and Prisma assets after running the root build.