# To reverify before building

Items Claude added or researched while writing the business doc and ADRs 0002 to 0007. They are proposals, not decisions, until the owner reverifies each one against their own knowledge. Do that at the ticket named in the last column, before design or code depends on the item. When an item is reverified, change its Status to `verified YYYY-MM-DD` or edit the doc, and only then treat it as decided.

Source: **proposed** is Claude's suggestion that the owner accepted without researching it. **research** is Claude's web search, from secondary sources.

| Item | Doc | Source | Status | Reverify at |
|---|---|---|---|---|
| Terraform rejected: no state file, new Azure features sooner | ADR 0002 | research | unverified | SIE-29 |
| Move to AKS only if Container Apps cannot meet a requirement | ADR 0002 | proposed | unverified | SIE-19 |
| Keycloak reasons: no per-user fees, realm as code, no lock-in | ADR 0003 | proposed | unverified | SIE-19, SIE-32 |
| Entra External ID and Auth0 as rejected options, and their pricing | ADR 0003 | proposed, research | unverified | SIE-19 |
| Facebook login needs a Meta app, privacy policy URL and app review | ADR 0003 | research | unverified | SIE-34 |
| Revisit Keycloak after a failed restore drill or an outage | ADR 0003 | proposed | unverified | SIE-19 |
| 10,000 requests per second is a direction, not v1 traffic | ADR 0004 | proposed | unverified | SIE-19 |
| Merge services if calls between them dominate | ADR 0004 | proposed | unverified | SIE-19 |
| One database user per service, rights only on its own schema | ADR 0005 | proposed | unverified | SIE-26, SIE-39 |
| Schema names `orders`, `catalog`, `jobs`; the gateway holds no data | ADR 0005 | proposed | unverified | SIE-26 |
| Schemas and grants created by a migration role held by the deploy pipeline | ADR 0005 | proposed | unverified | SIE-26, SIE-39 |
| Gemini is the first adapter, not permanent; the 80% bar decides | ADR 0006 | proposed | unverified | SIE-48, SIE-50 |
| No model version in the ADR | ADR 0006 | proposed | unverified | SIE-50 |
| Paid tier not used to improve products; abuse logs about 55 days; zero data retention on request | ADR 0007 | research | unverified | SIE-57 |
| Original media deleted 30 days after extraction, or after upload if never extracted | ADR 0007 | proposed | unverified | SIE-31, SIE-57 |
| Eval set only from consenting beta users, exempt from the 30-day deletion | ADR 0007 | proposed | unverified | SIE-49 |
| Vietnam Personal Data Protection Law (No. 91/2025/QH15) needs an impact assessment for Gemini calls | ADR 0007 | research | unverified | SIE-57 |
| No stock tracking in v1 | business doc | proposed | unverified | SIE-24 |
| Licensed e-invoice provider behind a swappable port | business doc | proposed | unverified | SIE-96 |
| VAT e-invoice legal rules for Hộ kinh doanh (thresholds, rates, dates) | business doc | research | unverified | SIE-96 |
| Zalo and Messenger hand-off first, direct send later | business doc | proposed | unverified | SIE-97 |
| Zalo Official Account fees and Messenger 24-hour rule | business doc, ADR 0007 | research | unverified | SIE-97 |
| Launch bar: 80% of orders confirmed with one edit or fewer | business doc | proposed | unverified | SIE-49 |
| Out of scope: payments and debt, push notifications, offline capture, other languages | business doc | proposed | unverified | SIE-19 |
