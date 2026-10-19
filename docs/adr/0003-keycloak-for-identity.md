# Use self-hosted Keycloak for identity

Sign-in runs on Keycloak, deployed as a container on Azure Container Apps with its own PostgreSQL database. Users sign in with email and password, Google or Facebook. The web app uses OIDC with PKCE, and the gateway validates the Keycloak JWT.

## Considered Options

- **Microsoft Entra External ID.** Rejected: it is managed, but it bills per active user and ties identity to one vendor.
- **Auth0.** Rejected: same reasons as Entra External ID, with higher per-user cost as the user base grows.

## Consequences

- There are no per-user fees and no vendor lock-in, and the realm configuration lives in code.
- We own upgrades, backups and uptime. Mitigation: pin the Keycloak version, keep the realm as code, back up its database, and run a restore drill (SIE-80).
- The Facebook identity provider needs a Meta app, a privacy policy URL and app review. This has a lead time, so it starts early (SIE-34).
- Revisit trigger: a failed restore drill, or an outage caused by Keycloak operations. Then compare a managed option again.
