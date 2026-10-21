# Design: screen flow map v1

Maps the 57 mobile screens (plus the one desktop `Dashboard`) in [super-good.pen](super-good.pen) into the flows SIE-22 asks for, grounded in each screen's actual content and icons (button labels, headings) extracted from the file — see [screens.md](screens.md) for the plain screen/component lists this builds on.

**Method and limits:** `super-good.pen` has no prototype/link data (no "this button goes to that frame" wiring) — Pencil stores frames and components, not navigation. Every arrow below is inferred from screen names, their text content, and the business doc's [Order flow](business-doc.md#order-flow) narrative, not read off an explicit link in the file. Two real gaps surfaced while mapping this, confirmed with the owner before writing the flow below:
- **Receipt** has no dedicated top-level screen — only reusable components (`Receipt Sheet`, `Receipt Header`, `Receipt Row`, `Receipt Line`, `Receipt Total`, see [components.md](components.md)). Mapped as a bottom sheet opened from Order Detail's share action, not a screen of its own.
- **Product from voice/image** has no screens of its own in this file version — mapped as reusing the same voice-recording and scan-capture screens built for orders, targeting a catalog item instead of an order.

## Hub

`Dashboard` (desktop, `XG8h6`) / `Dashboard Mobile` (`tArsM`) / `Dashboard Mobile - Menu` (`iOPAC`) is the post-onboarding home screen every flow below returns to. It links out to: Order list (via "New order" / search), Contacts, Catalog, and starts a new order capture. `First Dashboard - Empty` (`Ve7uC`) is the same screen's empty/first-run state, reached once from onboarding before any order exists.

## 1. Onboarding / auth

```
Splash screen (Hd7KW)
  -> On boarding 1 (IbDax) -> On boarding 2 (GY1rW) -> On boarding 3 (jgM9D)
       -> Sign-in (f8gNwW)  [tab: "Sign up" switches to Sign-up]
       -> Sign-up (toU1O)   [tab: "Sign in" switches to Sign-in]
            -> Setup 1 - Business (wmaw4)
                 -> Setup 2 - Add orders (YPWYj)
                      -> Setup 3 - Permissions (X7755Z)
                           -> First Dashboard - Empty (Ve7uC) -> Dashboard
```

"Skip" on Setup 1/2/3 drops straight to `First Dashboard - Empty`. Setup 2 ("How will you add orders? Scan documents / Record by voice / Enter manually") previews the three capture methods used in flow 3.

## 2. Order list

```
Dashboard -> iPhone 16 - Order list (DDFAw)
  -> iPhone 16 - Order list (swipe to remove) (yR4Yn) -> (remove confirm) (ZtLzU) -> back to list
  -> iPhone 16 - Order list (select many) (sAuc0)  [multi-select mode, from a long-press/"Select"]
  -> iPhone 16 - Order list (no results) (Xuc9h)   [empty state for a filter with 0 matches; "New order" button]
  -> tap a row -> iPhone 16 - order detail (jOVeX)
       -> iPhone 16 - order details button detail (O9vMcT)  [same screen, action menu/share open]
            -> Receipt Sheet (component, bottom sheet; see "Receipt" below)
```

Order list filters by status (`All`, `Pending`, `Confirmed`, `Done`) — the canonical order schema (SIE-24, `docs/contracts/order-schema.v1.json`) settled on `pending`/`confirmed` as the two order statuses, matching the design. The design's third filter, `Done`, isn't a schema status; it's unclear whether it means a post-confirm milestone (e.g. receipt/invoice issued) or is a leftover from an earlier draft/confirmed naming — flagged in `docs/reverify.md`.

## 3. New order (voice / scan / manual)

Three capture methods feed the same review-and-create path, per the business doc ("both directions use the same capture and review flow").

**Manual / ticket building, with voice add-in:**
```
Dashboard "New order" -> iPhone 16 - ticket products list (Nq2jb)
  [browsing/adding catalog items into the ticket by hand]
  -> tap mic -> iPhone 16 - start recording (WkQkS)
       -> iPhone 16 - recording (JMNbA)
            -> iPhone 16 - record processing (tTqKG)
                 -> iPhone 16 - record result (px30H)  ["Transcribed Items", "N items found"]
                      -> (hold to select) (MdCD0) / (no selection) (PAebm)  [selection-mode variants]
                      -> (edit item) (t9Y2eL)   [tap an item to correct name/price]
                      -> (swipe to remove) (Vfnum) -> (remove confirm) (Ybmor) [swipe, then confirm removing a transcribed item]
                      -> (scroll) (H8u8m)         [long-list state, not a separate step]
  -> iPhone 16 - 4 (aOlRg) / (remove confirm) (jHeeK)   [reviewing the manually-built ticket itself]
  -> iPhone 16 - Product list (jgti3 / mkPdU) / (single sheet)(edit item) (L8Owf)  [product-picker variants feeding the ticket]
  -> iPhone 16 - Order pre creation (SVuBo)  [order summary: items, sub total, discount, total, contact, date, note, "Need tax invoice"]
       -> iPhone 16 - 25 (vJJXI)  ["Order Created!" confirmation]
            -> iPhone 16 - order detail (jOVeX)   [flow 2]
```

**Scan:**
```
Dashboard "New order" (scan) -> iPhone 16 - 7 (ujIUo)  [camera frame, no document yet]
  -> iPhone 16 - 8 (RlTOp)  [one document captured]
       -> iPhone 16 - 6 (sWZaX) / Iphone 16: review document: 1 document (gaBva)  [review captured page(s) before processing; "you can scan more documents"]
            -> iPhone 16 - review document many (euJh5)  [multi-document variant]
                 -> iPhone 16 - image processing (sBmDL)  ["Extracting data from image"]
                      -> iPhone 16 - process done (ubv2a)  ["All done!" -> "Scan more" or "See orders"]
                      -> iPhone 16 - process fail (oc8Pg)  ["Sorry we failed" -> "Try again" (back to capture) or "Cancel"]
                 -> on success, into the review step (flow 4, see its note on single vs. many documents) -> Order pre creation (SVuBo) -> order created (vJJXI)
```

**Product from voice/image** (confirmed with the owner: no dedicated screens exist yet) reuses this same voice-recording (`start recording` -> `recording` -> `record processing` -> `record result`) and scan-capture (`iPhone 16 - 7` -> `8` -> review -> `image processing` -> `process done`/`process fail`) sequence, but the end target is a catalog item (feeding into Catalog, flow 7) instead of an order. No screens distinguish "for a product" from "for an order" visually in this file version — flagged in `docs/reverify.md` for SIE-76 to confirm or design separately.

## 4. Review

The extracted-items review step (business doc step 3: "user sees the extracted contact, items, quantities... with low-confidence fields flagged. They edit anything wrong.") is `iPhone 16 - record result` and its variants for voice (listed under flow 3), and `iPhone 16 - Order pre creation` as the shared final review/edit-before-create screen for both voice and scan. There's no screen distinctly showing a multi-document scan's merged item review separate from `Order pre creation` — to verify at SIE-70 ("Review screens: single and many documents"), the ticket that implements this.

## 5. Receipt

No dedicated screen (confirmed with the owner). Reached from Order Detail:

```
iPhone 16 - order details button detail (O9vMcT)  [share/bookmark action visible]
  -> Receipt Sheet (component: Receipt Header, Receipt Row, Receipt Line, Receipt Total)
       [bottom sheet; "print as PDF" and "share by hand-off to Zalo/Messenger" per the business doc]
```

## 6. Contacts

```
Dashboard -> Contact list (oJjk0)
  -> tap a contact -> Contact detail (i8sBV)  ["Call", "Message", "Video", recent orders]
  -> tap edit -> Contact list (edit contact) (p1Tar)
  -> swipe to remove -> Contact list (remove confirm) (QpQEi)
  -> long-press/Select -> Contact list (select many) (Ghiw0)
```

## 7. Catalog

```
Dashboard -> iPhone 16 - Product catalog list (fSs9y)  [filters: All / In stock / Out of stock / Oversold]
  -> tap a product -> iPhone 16 - Product detail (in stock) (t6ZHn)
       -> (zero amount) (jXs1x) / (negative amount) (TyyKH)   [stock-level state variants of the same screen]
       -> (unit pcs) (yU4gh)                                   [unit variant]
       -> tap "Stock history" / "Price history" -> (price history) (xZ9wb)
       -> tap "Unit" dropdown -> (select unit) (n2ksq)
```

## 8. Product from voice / image

See flow 3's note: reuses the order-capture voice/scan screens; the result updates or creates a Catalog entry (flow 7) instead of an order. No separate screens exist to map.

## To verify

Logged in [reverify.md](reverify.md): the exact review-screen split for single vs. many scanned documents (SIE-70), whether product-from-voice/image gets its own screens or stays reused (SIE-76, confirmed for now as reused), and whether the Order list's `Done` filter is a real third order status or a leftover (SIE-66).
