# AEGIS Architecture

AEGIS is split into three deployable concerns:

- `client`: React command center for dashboards, GIS maps, reports, administration, and conversational intelligence.
- `server`: Express API with security middleware, RBAC, Prisma repositories, analytics services, and AI orchestration.
- `shared`: Zod schemas and TypeScript contracts shared between client and server.

## Request Flow

1. The client authenticates with `/api/auth/login` and stores short-lived access tokens plus rotating refresh tokens.
2. Protected API calls pass through request ID, logging, Helmet, CORS, rate limiting, JSON limits, JWT verification, and route-level RBAC.
3. Routes validate payloads with Zod before invoking feature services.
4. Services query PostgreSQL through Prisma. Raw SQL is reserved for parameterized aggregate queries.
5. AI chat requests are resolved through intent detection, entity extraction, validated SQL-backed retrieval, optional OpenAI-compatible generation, citations, and persistence.

## Deployment

Docker images are provided for local and container deployment. Zoho Catalyst AppSail can run the server image, while the static client build can be served through Catalyst hosting or the included nginx image.
