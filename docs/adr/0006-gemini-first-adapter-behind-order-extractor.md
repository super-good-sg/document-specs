# Gemini is the first adapter behind IOrderExtractor

Status: accepted. Reverified by the owner on 2026-10-21 (see [reverify.md](../reverify.md)).

Extraction goes through a port at task level, `IOrderExtractor`, with `ExtractFromAudio` and `ExtractFromImage`. Both return one canonical `ExtractionResult`: the order schema, a confidence, usage and the provider. Gemini, called over the Google API, is the first adapter. It is the starting point, not a permanent choice. The eval set (SIE-49, SIE-52) decides, against the launch bar in the business doc: at least 80% of orders confirmed with one edit or fewer, in Vietnamese and English. The 80% is a starting number, adjusted after the first run. The ADR names no model version, so the model can change without rewriting it.

## Considered Options

- **A vendor-level abstraction or a generic AI gateway.** Rejected: it adds a layer for providers we do not use. The port is at the level of the task.
- **A Python AI service.** Rejected for v1: the AI and jobs worker (ADR 0004) is a .NET service in the backend monorepo, since the hosted speech and vision APIs have .NET SDKs or plain REST (per the 2026-10-12 notes). The port stays the same if a Python service is split out later.
- **Committing to Gemini for good.** Rejected: Vietnamese accuracy differs between providers, so the choice waits for eval results.

## Consequences

- A second adapter (Azure OpenAI, SIE-58) is built early to prove the port.
- Provider choice is config-driven per task through dependency injection. A fallback decorator handles timeouts and errors.
- The prompts, the output schema and the canonical order schema are versioned files in this repo.
- Calls to Gemini leave Azure, which adds latency and moves data to another cloud. See ADR 0007.
