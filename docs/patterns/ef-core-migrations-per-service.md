---
name: ef-core-migrations-per-service
description: Backend - migrations use EF Core, owned by each service, applied via a migration role separate from the service's runtime role
approved_date: 2026-10-21
source_repo: backend
---

## When to use
Adding or changing a database migration for any backend service (orders,
catalog, jobs).

## Pattern
- Migrations use EF Core and are owned by each service — a service's own
  EF Core project/`DbContext` holds its own migrations, never another
  service's.
- One PostgreSQL Flexible Server is shared across services; each service
  gets its own schema (`orders`, `catalog`, `jobs`) and its own database
  user with rights only on that schema. No cross-service joins — enforced
  by permissions, not convention.
- Schemas and grants are created by a migration role that only the deploy
  pipeline holds. The service's runtime database user never has schema- or
  grant-level rights, only row-level access within its own schema.

## Notes
From ADR 0005 (One PostgreSQL server, one schema and one database user per
service), reverified by the owner 2026-10-21. See
[`docs/adr/0005-postgresql-schema-per-service.md`](../adr/0005-postgresql-schema-per-service.md)
for the full rationale and rejected alternatives.
