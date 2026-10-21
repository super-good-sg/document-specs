# Data handling for audio and images sent to Gemini

Status: accepted. Reverified by the owner on 2026-10-21 (see [reverify.md](../reverify.md)).

Voice notes and photos go to Gemini only on the paid tier, whose terms say prompts and files are not used to improve Google's products. We request zero data retention for the Gemini project and fall back to the paid-tier terms if it is refused. The API key lives in Key Vault (SIE-57).

## Decision

- **Original media:** voice notes and photos are stored in Blob Storage and deleted 30 days after extraction by a lifecycle rule, or 30 days after upload if extraction never ran. This leaves time for the user to review again.
- **Extracted orders:** kept as long as the account exists.
- **Eval set:** built only from recordings of beta users who gave written consent. Those recordings are copied into the eval set and are exempt from the 30-day deletion.
- **Size caps:** media length and file size are capped at upload.
- **Launch blocker:** Vietnam's Personal Data Protection Law (No. 91/2025/QH15, reported in force since 1 January 2026) is reported to require an impact assessment for sending personal data abroad. Gemini calls are such a transfer, so a Vietnamese lawyer confirms the duty and the assessment is finished before launch.

## Considered Options

- **Free tier.** Rejected: free-tier data may be used to improve Google's products.
- **Keep media indefinitely.** Rejected: it keeps customer voices and documents longer than the product needs.

## Consequences

- Reverified by the owner on 2026-10-21: the abuse-monitoring retention (reported as 55 days), zero data retention on request, and the impact-assessment duty under the Vietnamese law. A Vietnamese lawyer still confirms the duty before launch, and the official text is the final source.
- If retention or cross-border rules change, only this ADR and the Blob lifecycle rule change.

## Sources

- Google AI for Developers: Gemini API zero data retention, and Data logging and sharing.
- Allen & Gledhill, "Upcoming changes to Vietnam's personal data protection regime" (21 August 2025), and the EY legal alert of July 2025. Both are secondary sources, so check the official text.
