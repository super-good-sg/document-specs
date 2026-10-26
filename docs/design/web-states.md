# Design: web-specific states (SIE-23)

`super-good.pen` was drawn as a mobile-app mockup (see [screens.md](screens.md),
[flows.md](flows.md)) and has no frames for the five states below — all of
them are things a browser renders itself, or situations that only exist on
the web (no app store, no OS permission system, an actual "offline" network
state instead of always-connected). This is a written spec, not new Pencil
frames: frontend-web implements against it directly, referencing existing
[tokens](tokens.md) and [components](components.md) rather than new ones.

Everything below is a proposal (source: proposed) until reverified by the
owner — see [reverify.md](../reverify.md).

## 1. Mic permission prompt and denial

The permission *prompt* itself is the browser's own native dialog
(`navigator.mediaDevices.getUserMedia`) — nothing for this app to design.
What needs a design decision is **what the app shows if the user denies
it**, since the existing voice-order flow (`iPhone 16 - start recording`,
`WkQkS`, see flows.md §3) assumes the mic is granted.

Proposed: on denial, replace the recording screen's content with a message
("Microphone access is blocked — allow it in your browser's site settings
to record") plus a button back to the ticket/manual-entry flow, styled with
`Dialog Button Secondary` (`D3txqY`) and the `--color-warning` /
`--color-warning-foreground` token pair. No new component — reuses the
existing dialog button and status-color tokens.

## 2. Camera / file picker

Only partly browser-native. The live camera view itself already has a
custom-drawn frame — `iPhone 16 - 7` (`ujIUo`, "camera frame, no document
yet", flows.md §Scan) plus the `Camera Round Button`, `Camera Controls` and
`Camera Controls Review` components (screens.md) — so capturing via the
device's camera is already fully designed; `getUserMedia` just feeds the
live video into that existing frame. What's genuinely browser-native and
undesigned is the **alternative** input path: a plain `<input
type="file">` picker (e.g. "choose from gallery" instead of the live
camera), whose dialog is OS chrome this app never renders.

Proposed: a file-picker cancellation (user closes the OS dialog without
choosing a file) returns silently to the screen that triggered it — no
error state, since nothing failed. This matches how the existing camera
flow's own cancel path presumably behaves and needs no new screen.

## 3. Install prompt (PWA)

The actual install banner is rendered by the browser
(`beforeinstallprompt` on Chrome/Edge/Android; Safari/iOS has no
programmatic prompt at all — install is manual, via the browser's own
"Add to Home Screen" menu item). What's a real design decision is whether
the app also shows its **own** nudge UI before triggering the native
prompt (common pattern: a small in-app banner or button, "Install Super
Good" with the brand logo), or relies entirely on the browser's default.

Proposed: no custom in-app nudge for v1 — rely on the browser/OS's own
install affordance, revisit if adoption data says otherwise. Flagged to
verify: this is a product call, not just a visual one.

## 4. Offline state

No connectivity banner exists anywhere in the current screen set. The
business doc is explicit that **offline order capture is out of scope**
("Only the app shell works offline") — so the banner should not promise
anything syncs or saves while offline; it should say capture is
unavailable until the connection returns. Proposed: a thin banner pinned
to the top of the screen, below the status bar, reading "You're offline —
reconnect to record, scan, or create an order" (or similar), using
`--color-warning-foreground` text on `--color-warning` background,
dismissible only by connectivity returning (not by the user). No existing
component matches this shape (closest is `Confirm Dialog`, `krp83`, which
is a modal, not a banner) — this would be a **new** component if built,
which is new-pattern territory per
[agent-workflow.md](../agent-workflow.md#patterns): stop and ask before
the frontend-web ticket that builds it adds anything beyond this proposal.

Flagged to verify regardless: "only the app shell works offline" reads as
"block capture entirely," but whether read-only screens (order list,
contacts, catalog) stay browsable offline, or the whole app shows this
banner full-screen, isn't stated — that's an inference, not confirmed.

## 5. Vietnamese / English language switch

No screen or component for a language toggle exists in the current file.
The business doc's [launch scope](../business-doc.md) names Vietnamese and
English as the two supported UI languages but doesn't show where a user
switches between them. Proposed: a toggle in whatever settings/profile
screen gets designed (none exists yet in the current 58-screen set) — out
of scope for this ticket to invent a screen for, since none of the
existing screens is a natural home for it. Flagged to verify: where this
control actually lives is a design decision for whenever a settings screen
is designed, not something SIE-23 should force into an existing screen.

## Summary for frontend-web

| State | New component needed? | Where |
|---|---|---|
| Mic permission denied | No — reuses `Dialog Button Secondary` + warning tokens | Recording screen's own content, swapped on denial |
| Camera/file picker cancel | No | N/A — falls back silently |
| Install prompt | No (v1) | Browser/OS default only |
| Offline banner | **Yes** — no existing banner component | New, top-pinned; stop-and-ask before building |
| Language switch | Deferred — no settings screen exists yet | N/A until that screen is designed |
