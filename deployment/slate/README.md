# Slate Deployment Notes

This folder documents the static frontend deployment contract for AEGIS.

Build output:

- `client/dist`

Frontend environment variables:

- `VITE_API_BASE_URL` must point to the deployed AppSail URL
- `VITE_BASE_PATH` should stay `/` unless Slate is mounted under a subpath

SPA routing requirements:

- All non-asset routes must fall back to `index.html`
- `/login`, `/analytics`, `/reports`, and `/admin` must be refresh-safe

Deployment sanity check:

- Open the built site
- Confirm login renders
- Confirm protected routes render after authentication
- Confirm API requests target the deployed AppSail origin