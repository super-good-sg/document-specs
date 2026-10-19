# Start as a few microservices

The backend is split from the start into a gateway, an orders service, a catalog and contacts service, and an AI and jobs worker. Keycloak is the identity service. Each service owns its data (see ADR 0005). The split stays small and grows only when a boundary is needed.

Why: the owner's reason for choosing microservices over a modular monolith is not recorded yet. Add it before this ADR is accepted.

## Considered Options

- **Modular monolith first.** Not chosen in the 2026-10-12 plan. It would give one deploy and fewer moving parts for one developer, and services could be split out later.

## Consequences

- Most of the overhead lands on one person: CI, deploys, tracing and contracts. Mitigations: one monorepo, a shared service template, few services, a shared contracts project, and docker-compose for local development.
- Services talk through contracts written in this repo first, and the AI work is asynchronous through Service Bus.
- Revisit trigger: merge two services if calls between them dominate their traffic, or if the service template cannot keep the overhead small.
