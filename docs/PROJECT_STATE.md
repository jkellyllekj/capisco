<!-- __START_FILE_PS000__ -->

# Capisco — Project State  
Status: **Authoritative (Operational Truth)**  
Last updated: 2026-01-04

---

<!--
============================================================================
BLOCK INDEX
PS010 — PURPOSE
PS020 — CURRENT_PHASE
PS030 — PHASE15_LOCKED
PS040 — PHASE16A_ACTIVE
PS050 — ACTIVE_FILES
PS060 — KNOWN_INTENTIONAL_LIMITATIONS
PS070 — PAUSE_IN_ACTION_LOG
============================================================================
-->

<!-- __START_PS_PURPOSE_PS010__ -->

## PURPOSE

This document defines the **current operational truth** of the Capisco project.

It answers:
- What phase is active
- What work is frozen vs allowed
- Which files are authoritative *right now*
- Why certain behaviors exist (to prevent rediscovery)

If there is any conflict:
- `PROJECT_STATE.md` wins for **navigation and intent**
- Specs win for **semantics**
- Chat memory is never authoritative

<!-- __END_PS_PURPOSE_PS010__ -->

---

<!-- __START_PS_CURRENT_PHASE_PS020__ -->

## CURRENT PHASE

**Active phase:**  
### Phase 16A — Renderer Capability Expansion

Scope:
- Renderer-only improvements
- Surface multiplicity already present in data

Explicit constraints:
- ❌ No schema changes
- ❌ No media pipeline changes
- ❌ No data contract evolution

<!-- __END_PS_CURRENT_PHASE_PS020__ -->

---

<!-- __START_PS_PHASE15_LOCKED_PS030__ -->

## PHASE 15 — LOCKED (COMPLETE)

**Phase 15 — Card Content Expansion & Multiplicity**

Status: **Complete**

Summary:
- Dense card data added using existing contract fields only
- Multiple examples, senses (represented), relations, and variants validated
- No renderer, schema, or media changes performed

Authoritative reference:
- `docs/card-content-multiplicity-spec.md`

Phase 15 is closed and must not be modified.

<!-- __END_PS_PHASE15_LOCKED_PS030__ -->

---

<!-- __START_PS_PHASE16A_ACTIVE_PS040__ -->

## PHASE 16A — ACTIVE

**Phase 16A — Renderer Capability Expansion**

Purpose:
- Improve renderer behavior to support multiplicity already present in card data

Completed in this phase:
- Examples tab updated to render **multiple examples** instead of first-only

Still allowed:
- Additional renderer-only capability improvements (explicitly declared, one step at a time)

Still forbidden:
- Any schema or media pipeline changes

<!-- __END_PS_PHASE16A_ACTIVE_PS040__ -->

---

<!-- __START_PS_ACTIVE_FILES_PS050__ -->

## ACTIVE FILES (MANDATORY MAP)

These files are required knowledge for the active flow.

### Renderer
- `ui/seasons-card/render.js`  
  Canonical Seasons Card renderer (vanilla JS)

### Card Data
- `ui/seasons-card/cards/primavera.card.json`
- `ui/seasons-card/cards/stagione.card.json`

### Demo / Entry Points
- `ui/seasons-card/demo.html`
  - Loads **one canonical card JSON**
  - Duplicates the same card **intentionally** to test 2-up layout
  - Not a multi-vocab demo

### Specs & Governance
- `docs/card-content-multiplicity-spec.md` (data/contract only)
- `docs/WORKING_METHOD.md`
- `docs/DECISIONS.md`

Files not listed here are **not** part of the active reasoning surface.

<!-- __END_PS_ACTIVE_FILES_PS050__ -->

---

<!-- __START_PS_KNOWN_LIMITATIONS_PS060__ -->

## KNOWN INTENTIONAL LIMITATIONS

- The Seasons Card demo shows **one vocabulary item** by design
- Repetition in the demo is for **layout testing**, not content plurality
- Multi-card demos do not yet exist and must be explicitly created if needed

These are **intentional**, not bugs.

<!-- __END_PS_KNOWN_LIMITATIONS_PS060__ -->

---

<!-- __START_PS_PAUSE_IN_ACTION_LOG_PS070__ -->

## PAUSE IN ACTION LOG

### 2026-01-04 — Phase 16A Stabilisation

- Renderer updated to support multiple examples
- Working Method updated to reflect Replit environment constraints
- Project State created to:
  - separate specs from operational truth
  - declare active files
  - prevent rediscovery loops

Repo is now in a stable handoff state.

<!-- __END_PS_PAUSE_IN_ACTION_LOG_PS070__ -->

<!-- __END_FILE_PS000__ -->
