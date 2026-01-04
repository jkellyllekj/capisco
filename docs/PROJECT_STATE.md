<!-- __START__ -->

# Capisco — Project State

Last updated: 2026-01-01

# Project State (Handoff Packet)


**Current focus:** Locking layout invariants and preventing regression before moving to next phase.



## If this is a new ChatGPT page, read this first
**Current phase:** Phase 6C / 6D (Seasons Card Demo + Viewport Lab)
**Current focus:** Fix image/media clipping on right edge at ~1366px+ (Seasons card wide layout)

### What’s working
- Viewport Lab page is now functional and useful for multi-width inspection (keep it).
- Seasons card layout is broadly stable at most widths.

### What was broken (now resolved)
- **RESOLVED:** At ~1366px+ the image/media appeared clipped on the right within the card.
  - Root cause: CSS Grid minimum width (`minmax(460px, 1fr)`) on `.card` exceeded available card width in 2-up layouts.
  - Effect: grid overflow masqueraded as media clipping.
  - Fix: replaced fixed minimum with `minmax(0, 1fr)` in `__START_IMAGE_LAYOUT_S600__`.



### Next action (single step)
- Use DevTools at **1366**: identify which element has `overflow: hidden` and which child exceeds width.
- Record the exact selector + rule source (file + line) in the debug log / this file.

## Canonical docs
- Working rules: `working-method.md`
- Decisions: `decisions.md`
- Card contract: `card-contract.md` (reference)
- UI port plan: `ui-port-plan.md` (reference)
- Retrospective candidates: `retrospective-candidates.md` (reference)
- README / Replit notes: `README.md`, `replit.md`

## Repo entrypoints
- Demo: `ui/seasons-card/demo.html`
- Viewport Lab: `ui/seasons-card/viewport-lab.html`
- Card renderer: [put the key file path here]
- Styles: `style-seasons-card.css` (and any other key css)


---

## Current Phase
**Phase 9 — Media Containment Invariant (Implementation Pass)**


---

## Locked / True Right Now

- Phase 6C demo layout is “good enough” and frozen.
- Demo-level layout tuning is paused.
- The **Card is the canonical product object**, not a demo artifact.
- Card internals may be modified deliberately under contract rules.
- JSON files are **data only** (no comments, no marker blocks).
- Marker blocks are used only in HTML / CSS / JS / MD files.
- One change per step.
- Full block replacements only (no line edits).
- Treat code as liability: minimize surface area.

---

## Authoritative Documents

- `docs/card-contract.md`  
  → Defines required fields, supported states, rendering invariants, and extensibility.

- `docs/PROJECT_STATE.md`  
  → This file. Snapshot of what is true right now.

- `docs/DECISIONS.md`  
  → Decision log (to be backfilled gradually).

---

## Phase 7 Goals

- Lock the Card Contract (DONE).
- Guarantee media never overflows or escapes its bounds (NEXT).
- Preserve stability across:
  - empty / partial states
  - quiz / chat / read-only / print modes
  - future apps beyond Capisco

---

## Next Single Step

**Phase 7 — Step 3:**  
Implement media containment invariant:
> Media must never overflow or escape its bounds in any tab state, including empty tabs.

This will be done via **one CSS/JS marker block replacement** after identifying the winning media slot styles.

<!-- __END__ -->
