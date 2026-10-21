# One PostgreSQL server, one schema and one database user per service

Status: accepted. Reverified by the owner on 2026-10-21 (see [reverify.md](../reverify.md)).

All services share one PostgreSQL Flexible Server. Each service has its own schema and its own database user, and that user has rights only on that schema. A service cannot read another service's tables, so "no cross-service joins" is enforced by permission and not by convention. The schemas are `orders` (orders service), `catalog` (catalog and contacts service, including the stock count) and `jobs` (AI and jobs service). The gateway holds no data. Keycloak keeps its own database on the same server. Migrations use EF Core and are owned by each service.

## Considered Options

- **A schema per service on one login.** Rejected: the rule is then only a convention, and one query can quietly join across services.
- **A separate server per service.** Rejected: it multiplies cost and operations for one person with no v1 benefit.

## Consequences

- Schemas and grants are created by a migration role that only the deploy pipeline holds. The service users get runtime rights on their own schema only. This adds a small setup step to the service template.
- Data from another service is read through that service's API, never by a query.
- One server is one failure domain. Back it up as one unit and revisit if a service needs its own scaling.
