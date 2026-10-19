# One PostgreSQL server, one schema and one database user per service

All services share one PostgreSQL Flexible Server. Each service has its own schema and its own database user, and that user has rights only on that schema. A service cannot read another service's tables, so "no cross-service joins" is enforced by permission and not by convention. Keycloak keeps its own database. Migrations use EF Core and are owned by each service.

## Considered Options

- **A schema per service on one login.** Rejected: the rule is then only a convention, and one query can quietly join across services.
- **A separate server per service.** Rejected: it multiplies cost and operations for one person with no v1 benefit.

## Consequences

- Each service migration also creates its schema and grants, which adds a small setup step to the service template.
- Data from another service is read through that service's API, never by a query.
- One server is one failure domain. Back it up as one unit and revisit if a service needs its own scaling.
