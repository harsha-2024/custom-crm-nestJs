# Custom CRM – Large‑Scale, Cloud‑Ready Starter (TypeScript, NestJS, PostgreSQL, Kafka, OpenSearch, Redis, Docker)

This is a production‑grade **custom CRM starter** built with a modern tech stack. It includes:

- **Services** (NestJS/TypeScript):
  - `auth-service`: Users, tenants, JWT auth.
  - `crm-service`: Contacts/Companies/Deals/Activities with domain events.
  - `api-gateway`: BFF that proxies to internal services and performs JWT verification.
  - `search-service`: Full‑text search via OpenSearch; consumes events.
  - `notification-service`: Event consumer (email stub) – extend as needed.
  - `worker-service`: Background jobs with Redis/BullMQ.
- **Data & Infra**:
  - PostgreSQL (separate DBs per service for clear boundaries)
  - Redis (cache/queues)
  - Kafka API via **Redpanda** (dev‑friendly Kafka broker)
  - OpenSearch + Dashboards
  - Docker Compose for local dev; Kubernetes manifests skeleton in `infra/k8s/`.

> **Highlights**: TypeScript end‑to‑end, Prisma ORM, JWT auth & RBAC scaffold, outbox/event‑driven architecture hooks, OpenSearch indexing, modular code structure ready for scale.

---

## Quick Start (Local, Docker Compose)

**Prereqs**: Docker Desktop (or Docker Engine) 24+, Docker Compose, ports 3000/3001/3002/9200/9092 free.

```bash
# 1) Copy env templates
cp .env.example .env
cp services/auth-service/.env.example services/auth-service/.env
cp services/crm-service/.env.example services/crm-service/.env
cp services/search-service/.env.example services/search-service/.env
cp services/api-gateway/.env.example services/api-gateway/.env
cp services/notification-service/.env.example services/notification-service/.env
cp services/worker-service/.env.example services/worker-service/.env

# 2) Build & launch
docker compose up -d --build

# 3) Watch logs (first run will run Prisma + seed)
docker compose logs -f auth-service crm-service search-service api-gateway

# 4) Test endpoints
curl http://localhost:3001/api/health            # api-gateway health
curl http://localhost:3000/api/health            # auth-service health
curl http://localhost:3002/api/health            # crm-service health

# 5) Login to get JWT (default admin user seeded)
curl -X POST http://localhost:3000/api/auth/login   -H 'Content-Type: application/json'   -d '{"email":"admin@acme.com","password":"StrongPass!23"}'

# 6) Create a contact (via gateway -> crm-service)
TOKEN=... # paste JWT from login
curl -X POST http://localhost:3001/api/crm/contacts   -H "Authorization: Bearer $TOKEN"   -H 'Content-Type: application/json'   -d '{"firstName":"Ada","lastName":"Lovelace","email":"ada@example.com"}'

# 7) Search (search-service consumes events from Redpanda and indexes into OpenSearch)
curl 'http://localhost:3001/api/search/contacts?q=ada' -H "Authorization: Bearer $TOKEN"
```

> OpenSearch Dashboards: http://localhost:5601  
> Redpanda Console (Kafka UI): http://localhost:8081

---

## Default Seeded Admin
- **Email**: `admin@acme.com`
- **Password**: `StrongPass!23`

The `auth-service` seeds an admin user and a default tenant on first start (idempotent).

---

## Tech Stack Choices
- **Node.js 20 LTS**, **TypeScript**
- **NestJS 10** for structured, testable services
- **Prisma 5** + **PostgreSQL** for reliable persistence
- **Redpanda** (Kafka‑compatible) for dev‑friendly event streaming
- **OpenSearch** for search & analytics
- **Redis** + **BullMQ** for caching & background jobs
- **Docker** for reproducible local/dev environments

> Production infra: see `infra/k8s/` for manifests to adapt to your cluster; add Helm or Terraform per your cloud.

---

## Project Layout
```
custom-crm-starter/
  docker-compose.yml
  .env.example
  services/
    auth-service/
    crm-service/
    api-gateway/
    search-service/
    notification-service/
    worker-service/
  infra/
    k8s/
      namespace.yaml
      *.yaml
```

---

## Notes
- Migrations: for simplicity we use `prisma db push` on container start to sync schema. In team setups, switch to migrations (`prisma migrate`) and CI/CD gating.
- Security: JWT secret is in env; rotate in production (store in a secrets manager). Add rate‑limits, CORS, TLS termination, and WAF/IdP integration in production.
- Observability: Add OpenTelemetry/OTLP exporters + Prometheus/Grafana in production.

---

## License
MIT — do whatever you like; attribution appreciated.
