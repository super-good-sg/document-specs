# To reverify before building

Items Claude added or researched while writing the business doc, ADRs 0002 to 0008 and the architecture diagrams. They are proposals, not decisions, until the owner reverifies each one against their own knowledge. Do that at the ticket named in the last column, before design or code depends on the item. When an item is reverified, change its Status to `verified YYYY-MM-DD` or edit the doc, and only then treat it as decided.

Status: `unverified` is the default. `unverified, owner researching` means the owner chose to research it first. `unverified, ask accountant` means it needs the beta user's accountant. `deferred YYYY-MM-DD` means the owner chose to skip it for now. `verified YYYY-MM-DD` means the owner confirmed it from their own knowledge.

Source: **proposed** is Claude's suggestion that the owner accepted without researching it. **research** is Claude's web search, from secondary sources.

| Item | Doc | Source | Status | Reverify at |
|---|---|---|---|---|
| Move to AKS only if Container Apps cannot meet a requirement | ADR 0002 | proposed | unverified, owner researching | SIE-19 |
| Keycloak reasons: no per-user fees, realm as code, no lock-in | ADR 0003 | proposed | verified 2026-10-20 | SIE-19, SIE-32 |
| Entra External ID and Auth0 as rejected options, and their pricing | ADR 0003 | proposed, research | unverified, owner researching | SIE-19 |
| Revisit Keycloak after a failed restore drill or an outage | ADR 0003 | proposed | unverified, owner researching | SIE-19 |
| 10,000 requests per second is a direction, not v1 traffic | ADR 0004 | proposed | verified 2026-10-20 | SIE-19 |
| Merge services if calls between them dominate | ADR 0004 | proposed | unverified, owner researching | SIE-19 |
| One database user per service, rights only on its own schema | ADR 0005 | proposed | verified 2026-10-21 | SIE-26, SIE-39 |
| Schema names `orders`, `catalog`, `jobs`; the gateway holds no data | ADR 0005 | proposed | verified 2026-10-21 | SIE-26 |
| Schemas and grants created by a migration role held by the deploy pipeline | ADR 0005 | proposed | verified 2026-10-21 | SIE-26, SIE-39 |
| Gemini is the first adapter, not permanent; the 80% bar decides | ADR 0006 | proposed | verified 2026-10-21 | SIE-48, SIE-50 |
| No model version in the ADR | ADR 0006 | proposed | verified 2026-10-21 | SIE-50 |
| Paid tier not used to improve products; abuse logs about 55 days; zero data retention on request | ADR 0007 | research | verified 2026-10-21 | SIE-57 |
| Original media deleted 30 days after extraction, or after upload if never extracted | ADR 0007 | proposed | verified 2026-10-21 | SIE-31, SIE-57 |
| Eval set only from consenting beta users, exempt from the 30-day deletion | ADR 0007 | proposed | verified 2026-10-21 | SIE-49 |
| Vietnam Personal Data Protection Law (No. 91/2025/QH15) needs an impact assessment for Gemini calls | ADR 0007 | research | verified 2026-10-21 | SIE-57 |
| Licensed e-invoice provider behind a swappable port | business doc | proposed | unverified, owner researching | SIE-96 |
| VAT e-invoice legal rules for Hộ kinh doanh (thresholds, rates, dates) | business doc | research | unverified, ask accountant | SIE-96 |
| Zalo and Messenger hand-off first, direct send later | business doc | proposed | verified 2026-10-21 | SIE-97 |
| Zalo Official Account fees and Messenger 24-hour rule | business doc | research | verified 2026-10-21 | SIE-97 |
| Launch bar: 80% of orders confirmed with one edit or fewer | business doc | proposed | verified 2026-10-21 | SIE-49 |
| Out of scope: payments and debt, push notifications, offline capture, other languages | business doc | proposed | verified 2026-10-20 | SIE-19 |
| Orders calls catalog over its API; the gateway only routes | architecture diagram | proposed | verified 2026-10-21 | SIE-42, SIE-43 |
| The AI worker calls the orders API to create the pending order, with the job ID as idempotency key; use events only when a second service needs the same fact | architecture diagram | proposed | verified 2026-10-21 | SIE-43, SIE-45 |
| Media upload goes through the gateway to an upload endpoint that stores it in Blob Storage and creates the job | architecture diagram | proposed | verified 2026-10-21 | SIE-44 |
| API for questions and commands that need an answer now, events for announcing a fact, a queue for slow work for one worker | architecture diagram | proposed | verified 2026-10-21 | SIE-43, SIE-45, SIE-96 |
| Order confirmed event consumed by the VAT e-invoice service (the stock listener in Catalog is already decided) | architecture diagram | proposed | deferred 2026-10-21 | SIE-96 |
| Order created or confirmed events later feed reports and analytics | architecture diagram | proposed | verified 2026-10-21 | SIE-43 |
| A job completed or failed event replaces polling if push is wanted | architecture diagram | proposed | verified 2026-10-21 | SIE-45 |
| Catalog item or price changed events with a read copy in Orders, once load requires it; start with the API call | architecture diagram | proposed | verified 2026-10-21 | SIE-42, SIE-43 |
| Kafka (or Event Hubs with the Kafka endpoint) for analytics; Service Bus for event-driven flows that need duplicate handling | architecture diagram | proposed | verified 2026-10-21 | SIE-43, SIE-96 |
| Event publishing sits behind a small interface, so the transport can change without rewriting the services | architecture diagram | proposed | verified 2026-10-21 | SIE-43, SIE-96 |
| Event Hubs Kafka endpoint limits (version lag, Premium or Dedicated tier for full coverage, retention 7 days on Standard) and Confluent Cloud pricing | architecture diagram | research | verified 2026-10-21 | SIE-43, SIE-96 |
| Kafka not used for the job queue: slow jobs block a partition, parallel workers are limited by partitions, and retries and dead-lettering would have to be built | ADR 0008 | proposed | unverified | SIE-45 |
| Event Hubs has no dead-lettering or duplicate detection (Microsoft's messaging comparison page) | ADR 0008 | research | unverified | SIE-45 |
| A PostgreSQL jobs table as the queue was considered and not chosen: retries, locking and dead-lettering built by hand, more database load | ADR 0008 | proposed | unverified | SIE-45 |
| Revisit when jobs become very many and very fast, or Service Bus limits are reached under load | ADR 0008 | proposed | unverified | SIE-45 |
| Design file, screen list and its images live in `docs/design/` | docs repo layout | proposed | unverified | SIE-20 |
| Core spacing scale is the 2px-step grouping `0,2,4,6,8,10,12,14,16,18,20,24,28,32,36,40`; other observed padding/gap values (1,3,5,7,9,11,17,30,33,50,56,77,88,176) are ad hoc, not scale steps | design tokens (SIE-21) | proposed | unverified | SIE-62 |
| The 12 Roboto-styled onboarding headline text nodes are an inconsistency (should use `--font-primary`/`--font-secondary`), not an intentional third font family | design tokens (SIE-21) | proposed | unverified | SIE-62 |
