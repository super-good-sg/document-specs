# Start as a few microservices

Status: proposed. Parts not yet reverified by the owner are listed in [reverify.md](../reverify.md).

The backend is split from the start into a gateway, an orders service, a catalog and contacts service, and an AI and jobs service. The AI and jobs service has two roles: a Jobs API that takes uploads and serves job status, and the AI worker. Keycloak is the identity service. Each service owns its data (see ADR 0005). The split stays small and grows only when a boundary is needed.

Why: the system is meant to grow into a large-scale one, with a target of about 10,000 requests per second, many queries, and heavy agent and AI work. Services that scale and fail on their own fit that target better than one application. The target is a direction, not v1 traffic.

## Considered Options

- **Modular monolith first.** Not chosen. It would give one deploy and fewer moving parts for one developer, and services could be split out later. It was set aside because the scale target above would force the split early.

## Consequences

- Most of the overhead lands on one person: CI, deploys, tracing and contracts. Mitigations: one monorepo, a shared service template, few services, a shared contracts project, and docker-compose for local development.
- Services talk through contracts written in this repo first, and the AI work is asynchronous through Service Bus.
- Revisit trigger: merge two services if calls between them dominate their traffic, or if the service template cannot keep the overhead small.
