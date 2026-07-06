# AEGIS

AEGIS is a hackathon-ready crime intelligence and response analytics platform built for a real-world command-center demo. It combines authenticated dashboards, GIS visualization, verified analytics, report workflows, and an AI assistant that stays grounded in database-backed evidence.

## Why This Project Wins Demos

- One login opens a full command center instead of a static landing page.
- The assistant answers from structured data and can fall back to local evidence when hosted AI is unavailable.
- The dashboard shows operational value immediately through KPIs, trends, incidents, and geographic patterns.
- The repo is already split for deployment: web, API, shared contracts, Docker images, and GitHub Actions CI.

## What's Inside

```text
client/    React + TypeScript + Vite web app
server/    Express + TypeScript API, auth, analytics, AI, reports
shared/    Zod schemas and API types shared by both apps
docker/    Dockerfiles, compose file, and nginx config
.github/   GitHub Actions CI workflow
docs/      Architecture notes
```

The backend uses feature-based modules with request IDs, structured logging, security middleware, Zod validation, Prisma persistence, and an OpenAI-compatible AI layer. The frontend uses React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, Leaflet, and Recharts.

## Core Features

- JWT authentication with refresh tokens and role-based access control
- Command-center dashboard with filters, KPIs, crime trends, and recent records
- AI assistant for investigative queries with evidence-backed responses
- Interactive map view for spatial incident analysis
- Analytics pages for categories, trends, and geographic patterns
- Scheduled reports and admin views for operational oversight
- Shared API contracts to keep client and server in sync

## Tech Stack

Frontend: React 19, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Zustand, React Hook Form, Zod, Leaflet, Recharts.

Backend: Node.js 20+, Express, TypeScript, Prisma ORM, PostgreSQL, pgvector, JWT, Argon2, OpenAI-compatible provider abstraction.

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure environment variables

Copy [.env.example](./.env.example) to `.env` and fill in the required values.

Required values:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN`

Optional AI values:

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

### 3. Start PostgreSQL

```bash
docker compose -f docker/docker-compose.yml up postgres -d
```

### 4. Run migrations and seed data

```bash
npm run prisma:migrate --workspace server
npm run prisma:seed --workspace server
```

### 5. Start the apps

```bash
npm run dev:server
npm run dev:client
```

If you want the root server start command only, use `npm run dev`.

## Local Demo Credentials

Seeded admin account:

```text
email: admin@aegis.local
password: AegisAdmin!2026
```

Use this only for local demo and judge walkthroughs. Rotate or replace it before any public deployment.

## Docker Run

Bring up the full stack with one command:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Expected services:

- Web: http://localhost:5173
- API: http://localhost:8080
- PostgreSQL: localhost:5432

## GitHub Deployment Ready

This repo is already set up for GitHub push workflows and hackathon submission:

1. Push the full monorepo to GitHub, including [client/](./client), [server/](./server), [shared/](./shared), [docker/](./docker), and [.github/workflows/ci.yml](./.github/workflows/ci.yml).
2. Keep secrets out of the repo and store them in GitHub repository secrets.
3. Use the existing GitHub Actions workflow as the gate for `main` and pull requests.
4. Build the deployable images from [docker/server.Dockerfile](./docker/server.Dockerfile) and [docker/client.Dockerfile](./docker/client.Dockerfile).
5. Run Prisma migrations before starting the API in your deployment job or release step.
6. Point the client at the deployed API origin through environment variables.
7. Serve the web app through nginx or another static host behind the published client image.

Suggested GitHub secrets:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN`
- `OPENAI_API_KEY` if hosted AI is enabled

The CI workflow currently runs install, build, lint, and tests on push and pull request events.

## API Surface

- `GET /health`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `GET /api/crimes`
- `GET /api/crimes/recent`
- `GET /api/analytics/overview`
- `GET /api/analytics/categories`
- `GET /api/analytics/trends`
- `GET /api/analytics/geo`
- `POST /api/ai/chat`
- `GET /api/ai/conversations`
- `POST /api/reports/scheduled`
- `GET /api/reports/scheduled`
- `GET /api/admin/users`
- `GET /api/admin/audit-logs`

Protected routes require `Authorization: Bearer <accessToken>`.

## Verification

Use these commands before pushing to GitHub or submitting the hackathon entry:

```bash
npm run build
npm run lint
npm test
```

You can also run the same checks from GitHub Actions, which mirrors the repository CI pipeline.

## Screenshot Guidance

For a strong submission, capture the app after seeding data and logging in as the demo admin. The product is data-driven, so screenshots should show the dashboard, map, and analytics views with real records instead of placeholders.

## Suggested Hackathon Pitch

AEGIS turns raw incident data into an operational command center with evidence-backed AI, geospatial analysis, and deployable infrastructure. It is built to be demoed locally, pushed to GitHub cleanly, and deployed with minimal extra setup.

## License

Copyright 2026. Internal government and authorized evaluation use unless a separate license is issued.
