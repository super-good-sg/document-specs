# Use self-hosted Keycloak for identity

Status: proposed. Parts not yet reverified by the owner are listed in [reverify.md](../reverify.md).

Sign-in runs on Keycloak, deployed as a container on Azure Container Apps with its own PostgreSQL database. Users sign in with email and password or Google. Facebook login is not in v1. The web app uses OIDC with PKCE, and the gateway validates the Keycloak JWT.

## Considered Options

- **Microsoft Entra External ID.** Rejected: it is managed, but it is priced per active user and ties identity to one vendor (pricing to verify).
- **Auth0.** Rejected: same reasons as Entra External ID.

## Consequences

- There are no per-user fees and no vendor lock-in, and the realm configuration lives in code.
- We own upgrades, backups and uptime. Mitigation: pin the Keycloak version, keep the realm as code, back up its database, and run a restore drill (SIE-80).
- Facebook login is out of v1, so there is no Meta app review lead time. It can be added later as another identity provider.
- Revisit trigger: a failed restore drill, or an outage caused by Keycloak operations. Then compare a managed option again.
