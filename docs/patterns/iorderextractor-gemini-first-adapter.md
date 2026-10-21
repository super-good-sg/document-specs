---
name: iorderextractor-gemini-first-adapter
description: Backend - extraction goes through the IOrderExtractor port (ExtractFromAudio/ExtractFromImage), Gemini first, provider chosen by DI config
approved_date: 2026-10-21
source_repo: backend
---

## When to use
Adding or changing order/product extraction from voice or image, or adding
a second AI provider adapter.

## Pattern
- Extraction goes through one port at task level, `IOrderExtractor`, with
  `ExtractFromAudio` and `ExtractFromImage`. Both return one canonical
  `ExtractionResult`: the order schema (SIE-24), a confidence, usage and the
  provider.
- Gemini, called over the Google API, is the first adapter — a starting
  point, not a permanent choice, decided by the eval set (SIE-49, SIE-52)
  against the business doc's launch bar. No model version is pinned in the
  ADR, so the model can change without rewriting the port.
- Provider choice is config-driven per task through dependency injection,
  not a vendor-level abstraction or a generic AI gateway (both considered
  and rejected — see the ADR).
- A fallback decorator handles timeouts and errors around whichever
  adapter is active.

## Notes
From ADR 0006 (Gemini is the first adapter behind IOrderExtractor),
reverified by the owner 2026-10-21. See
[`docs/adr/0006-gemini-first-adapter-behind-order-extractor.md`](../adr/0006-gemini-first-adapter-behind-order-extractor.md).
A second adapter (Azure OpenAI, SIE-58) is planned early specifically to
prove this port handles more than one provider.
