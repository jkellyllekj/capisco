<!-- __START__ -->

# Capisco — Project State

Last updated: 2026-01-01

---

## Current Phase
**Phase 7 — Card as Product (Foundation Pass)**

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
