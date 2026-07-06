# AEGIS — Smart Unified Threat & Response Analytics

AEGIS is an AI-powered conversational intelligence and crime analytics platform for the Karnataka State Police Crime Database. It combines verified SQL-backed answers, RBAC-secured workflows, interactive GIS visualization, trend analytics, citations, confidence scoring, scheduled reports, and auditability in one operational command center.

## Architecture

```text
client/          React + TypeScript + Vite command center
server/          Express + TypeScript API, auth, analytics, AI orchestration
shared/          Zod contracts and shared TypeScript types
docker/          PostgreSQL pgvector, API, web images
docs/            Architecture and deployment notes
.github/         CI build, lint, and test workflow
```

The backend follows feature-based modules. Requests pass through request IDs, structured logging, Helmet, CORS, compression, rate limiting, JWT verification, Zod validation, service-layer business logic, and Prisma persistence. AI chat uses deterministic intent/entity extraction, validated database retrieval, optional OpenAI-compatible answer generation, citations, confidence scoring, and persisted conversation history.

## Features

- JWT authentication with rotating refresh tokens and RBAC roles: Officer, Inspector, SP, Analyst, Admin
- Crime dashboard with KPIs, category distribution, trend analysis, recent FIRs, and district filters
- Conversational assistant with SQL evidence, citations, confidence score, follow-up questions, markdown rendering, and export
- GIS map with incident markers and severity-weighted visualization
- Analytics workbench for trend, category, district, station, and hotspot analysis
- Scheduled report creation with recipient validation
- Admin users and audit log views
- Prisma PostgreSQL schema with pgvector-ready RAG document chunks
- Docker Compose for PostgreSQL, API, and web runtime
- GitHub Actions CI for install, build, lint, and test

## Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router, Zustand, React Hook Form, Zod, Leaflet, Recharts.

Backend: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, pgvector, JWT, Argon2, OpenAI-compatible provider abstraction.

## Local Development

```bash
npm install
copy .env.example .env
npm run build
npm run lint
npm test
```

Start PostgreSQL:

```bash
docker compose -f docker/docker-compose.yml up postgres -d
```

Run migrations and seed data:

```bash
npm run prisma:migrate --workspace server
npm run prisma:seed --workspace server
```

Start the API and client:

```bash
npm run dev:server
npm run dev:client
```

Default seeded administrator:

```text
email: admin@aegis.local
password: AegisAdmin!2026
```

Rotate this credential before any shared or production deployment.

## Environment Variables

See [.env.example](./.env.example).

Required:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN`

Optional AI configuration:

- `OPENAI_API_KEY`
- `OPENAI_BASE_URL`
- `OPENAI_MODEL`

When no AI key is configured, AEGIS still answers using the local evidence provider over verified database results. It does not fabricate records.

## Docker

```bash
docker compose -f docker/docker-compose.yml up --build
```

Services:

- Web: `http://localhost:5173`
- API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

## API Overview

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

All protected endpoints require `Authorization: Bearer <accessToken>`.

## Deployment

AEGIS is ready for GitHub push and hackathon submission workflows. The repo already includes a CI pipeline, Docker builds, and a clear split between client, server, and shared packages.

### GitHub Push Ready Checklist

1. Create a GitHub repository and push the full workspace, including [client/](./client), [server/](./server), [shared/](./shared), [docker/](./docker), and [.github/workflows/ci.yml](./.github/workflows/ci.yml).
2. Confirm the project builds locally before pushing:
   - `npm install`
   - `npm run build`
   - `npm run lint`
   - `npm test`
3. Keep secrets out of the repo and define them in GitHub repository secrets:
   - `DATABASE_URL`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CLIENT_ORIGIN`
   - `OPENAI_API_KEY` if hosted AI generation is enabled
4. Use the GitHub Actions workflow as the push gate for pull requests and `main`.
5. Build and publish container images from the Dockerfiles in [docker/server.Dockerfile](./docker/server.Dockerfile) and [docker/client.Dockerfile](./docker/client.Dockerfile).
6. Run Prisma migrations during deployment before starting the API.
7. Point the client to the deployed API origin and serve the UI through nginx or a static host.

### Hackathon Submission Notes

1. Include a short project summary in the GitHub repository description.
2. Add sample credentials or a seed-data note in this README so judges can run the demo quickly.
3. Link the live demo, if available, in the repository README and submission form.
4. Keep the default seeded admin credential documented here for local demo use only, and rotate it before any public deployment.

### Zoho Catalyst

If you are deploying to Zoho Catalyst AppSail instead of GitHub-hosted infrastructure:

1. Build the server image from [docker/server.Dockerfile](./docker/server.Dockerfile).
2. Configure environment variables in Catalyst secrets.
3. Provision PostgreSQL with pgvector support or map compatible storage through Catalyst services.
4. Run Prisma migrations as a release step.
5. Serve the client from Catalyst static hosting or the nginx image from [docker/client.Dockerfile](./docker/client.Dockerfile).

## Verification

Current verification completed locally:

```bash
npm run build
npm run lint
npm test
npm audit --omit=dev
```

Production dependency audit reports zero vulnerabilities. Dev dependency audit still reports transitive advisories from tooling and should be reviewed during dependency governance.

## Screenshots

Run the app locally and capture the command center after seeding data. The UI is intentionally data-backed, so screenshots should be generated from a running environment with real seed records.

## Roadmap

- Add station boundary polygon ingestion and polygon selection workflows
- Expand RAG ingestion pipeline for FIR narratives, SOPs, and legal references
- Add Playwright E2E coverage for login, dashboard filters, reports, and chat
- Add PDF report rendering service and signed export URLs
- Add WebSocket/SSE streaming for chat token delivery and alert notifications
- Integrate Catalyst Functions for scheduled report dispatch

## License

Copyright 2026. Internal government and authorized evaluation use unless a separate license is issued.
