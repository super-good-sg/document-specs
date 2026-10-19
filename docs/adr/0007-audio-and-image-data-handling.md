# Data handling for audio and images sent to Gemini

Voice notes and photos go to Gemini only on the paid tier, whose terms say prompts and files are not used to improve Google's products. We request zero data retention for the Gemini project and fall back to the paid-tier terms if it is refused. The API key lives in Key Vault (SIE-57).

## Decision

- **Original media:** voice notes and photos are stored in Blob Storage and deleted 30 days after extraction by a lifecycle rule. This leaves time for the user to review again.
- **Extracted orders:** kept as long as the account exists.
- **Eval set:** built only from recordings of beta users who gave written consent.
- **Size caps:** media length and file size are capped at upload.
- **Launch blocker:** Vietnam's Personal Data Protection Law (No. 91/2025/QH15, in force since 1 January 2026) requires an impact assessment for sending personal data abroad. Gemini calls are such a transfer, so the assessment is finished before launch, with a Vietnamese lawyer.

## Considered Options

- **Free tier.** Rejected: free-tier data may be used to improve Google's products.
- **Keep media indefinitely.** Rejected: it keeps customer voices and documents longer than the product needs.

## Consequences

- To verify before building: the abuse-monitoring retention (reported as 55 days), whether zero data retention is granted, whether voice recordings count as sensitive data under the Vietnamese law, and the timing of the report duties.
- If retention or cross-border rules change, only this ADR and the Blob lifecycle rule change.

## Sources

- Google AI for Developers: Gemini API zero data retention, and Data logging and sharing.
- Allen & Gledhill, "Upcoming changes to Vietnam's personal data protection regime" (21 August 2025), and the EY legal alert of July 2025. Both are secondary sources, so check the official text.
