# Super Good: business doc v1

Status: draft for review (SIE-17). Anything not yet verified is marked "to verify" or listed under [Open questions](#open-questions). Items Claude added that the owner has not reverified are listed in [reverify.md](reverify.md).

Source: the 2026-10-12 big-picture and Linear plan notes, and the `super-good.pen` design (outside this repo until SIE-20 copies it in).

## What it is

A mobile-first web app (installable as a PWA) for taking orders. A user creates an order by speaking it, by photographing a document or receipt, or by typing it. The app extracts the order, the user reviews and corrects it, then saves it. The app also produces receipts and VAT invoices and keeps the user's contacts and product catalog.

## Users

The first user is a **supplier or wholesaler who takes orders from restaurants**, and also buys from their own suppliers. They work from a phone, often while busy, in Vietnamese or English, with prices in VND. They are a Hộ kinh doanh (household business).

- Launch is a private beta with one to three named users. Their real voice notes and receipts feed the eval set (SIE-49), with their written consent.
- Onboarding also offers other business types (Restaurant, Retail & wholesale). They stay selectable but are not tested or designed for in v1.
- Each user has their own account, contacts, catalog and orders. Nothing is shared between users.
- Sign-in is by email and password or Google. Facebook login is not in v1.

## Orders

There are two directions, on one order model:

- **Sales order:** a customer orders from the user.
- **Purchase order:** the user orders from a supplier.

A contact is a customer or a supplier, and the contact decides the direction. Both directions use the same capture and review flow.

## Order flow

1. **Capture.** The user records a voice note, takes or picks a photo of a document or receipt, or types the order in.
2. **Extract.** For voice and scan, the app uploads the media and starts a job. Extraction runs in the background, so the user can leave the screen. The app shows the job status and any failure.
3. **Review.** The user sees the extracted contact, items, quantities, units, prices and VAT, with low-confidence fields flagged. They edit anything wrong. A scan can hold several documents, so review works for one or many.
4. **Confirm.** The order moves from pending to confirmed. Nothing is confirmed without the user's confirmation, and extracted results are always pending first. Confirming also updates stock, through an event that Catalog listens to.
5. **Receipt and invoice.** The user views the receipt, prints it, and shares it. If the customer needs a VAT invoice, the user issues it from the order.

Manual entry is also the fallback when extraction fails.

## MVP scope

| Capability | What the user can do |
|---|---|
| Product management | Create, edit and list catalog items with units and price history |
| Stock | See an on-hand count per catalog item. A confirmed purchase order adds to it and a confirmed sales order subtracts from it. Catalog updates the count from an order-confirmed event |
| Order management | Sales and purchase orders: list, filter by status, open, edit, confirm, act on a row |
| Manual entry | Type an order in without voice or scan |
| Voice to order | Speak an order and get a pending order |
| Voice to product | Speak a product and create or update a catalog item |
| Image to order | Scan a document or receipt and get a pending order |
| Image to product | Photograph a product or list and create or update catalog items |
| Receipt | View, print as PDF, and share by hand-off to Zalo or Messenger |
| VAT invoice | Record VAT on an order and issue a legal e-invoice through a licensed provider |

Supporting scope: contacts (customer or supplier), sign-in, and a Vietnamese and English UI.

## VAT invoices

VAT is in v1 and follows Vietnamese law for Hộ kinh doanh.

- A **licensed e-invoice provider** issues the legal invoice. The app does not issue invoices itself.
- The provider sits behind a swappable port, in the same way as the AI extractor (unverified, see [reverify.md](reverify.md)). The provider is chosen in SIE-96.
- Invoice issuing gets its own spec (SIE-96). The order schema (SIE-24) carries the direction and the VAT fields.
- The tax rules (which businesses must issue e-invoices, from what revenue, VAT rates, exemptions) are **to verify with the beta user's accountant**. This doc lists no rates, thresholds or dates, because they are not yet verified against official sources.

## Receipts and sharing

- A receipt is a PDF. Print uses the browser's print dialog.
- Share is a **hand-off**: the user sends the PDF from their own Zalo or Messenger app through the browser share sheet. This is expected to need no account setup, cost or approval; the spike below confirms it.
- Before building, a small spike confirms that the mobile browser share sheet can send a PDF to Zalo.
- Direct send (the app messages the customer on its own) is a later ticket. It needs a verified Zalo Official Account with per-message fees, and for Messenger a Facebook Page, App Review and the 24-hour messaging rule. These requirements were reverified by the owner on 2026-10-21, and the share spike (SIE-97) confirms them in practice.

## Languages

- Voice input: Vietnamese and English, including mixed-language speech.
- App UI: Vietnamese and English, with a language switch and local number and currency formats (VND).

## Out of scope for v1

- Stock tracking beyond an on-hand count: warehouses, batches and low-stock alerts.
- Desktop or tablet layout. The web app is mobile-width only.
- Native iOS and Android apps.
- Payments and debt tracking.
- Direct sending of receipts or invoices through Zalo or Messenger.
- Issuing invoices without a licensed provider.
- Multi-user teams, roles and sharing between accounts.
- Other languages beyond Vietnamese and English.
- Additional AI providers beyond the first, except a second adapter built to test the port (ADR 0006), and per-user provider routing.
- Self-hosted speech models.
- Push notifications. Job results arrive by polling or in-app updates.
- Offline order capture. Only the app shell works offline.
- Tested support for business types other than supplier and wholesaler.

## Quality bar

Extraction accuracy decides whether the product is usable. The bar to launch: at least **80% of orders** can be confirmed with **one edit or fewer**, in both Vietnamese and English, measured on the eval set (SIE-49). Treat 80% as a starting number and adjust it after the first run.

## Open questions

- What are the beta users' yearly revenue, tax method and current e-invoice provider? These decide which VAT duties apply and which provider comes first.
- Is VAT recorded per line item or per order? Verify against the legal rules before the order schema (SIE-24).
- Which e-invoice provider, and does it need a cash-register integration for some users?
- What are the order status names? The design uses Pending and Confirmed, and the plan draft says draft and confirmed. Settle in SIE-24 and make the doc match.
- Does VAT apply to purchase orders (the user buying from a supplier), or only to sales orders? Settle in SIE-96.
