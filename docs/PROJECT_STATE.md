<!-- __START_FILE_PS000__ -->

# Capisco — Project State  
Status: **Authoritative (Operational Truth)**  
Last updated: 2026-01-06

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
- Renderer-only improvements to support multiplicity already present in card data
- Demo behavior may be adjusted strictly as a renderer test harness

Explicit constraints:
- ❌ No schema changes
- ❌ No media pipeline changes
- ❌ No data contract evolution

What “renderer-only” includes:
- `ui/seasons-card/render.js` (rendering logic, DOM wiring, visibility rules)
- `ui/seasons-card/demo.html` (which cards load, layout, cache-busting)

What it explicitly excludes:
- Any changes to `.card.json` structure or semantics
- Image/media generation strategy or asset pipeline changes

<!-- __END_PS_CURRENT_PHASE_PS020__ -->

---

<!-- __START_PS_PHASE15_LOCKED_PS030__ -->

## PHASE 15 — LOCKED (COMPLETE)

**Phase 15 — Card Content Expansion & Multiplicity**

Status: **Complete**

Summary:
- Dense card data added using existing contract fields only
- Multiple examples, relations, variants, senses, and quiz seeds validated
- No renderer, schema, or media pipeline changes performed

Authoritative reference:
- `docs/card-content-multiplicity-spec.md`

Phase 15 is closed and must not be modified.

<!-- __END_PS_PHASE15_LOCKED_PS030__ -->

---

<!-- __START_PS_PHASE16A_ACTIVE_PS040__ -->

## PHASE 16A — ACTIVE

**Phase 16A — Renderer Capability Expansion**

Purpose:
- Upgrade renderer behavior to correctly surface multiplicity already present in card data
- Improve demo clarity without altering data contracts

Completed in this phase:
- Examples tab renders **all examples** (not first-only)
- Related tab renders **relations grouped by category**
- Renderer prefers `images.canonical[0]` with graceful fallback
- Legacy icon rendering (blue circle / 🌀) disabled
- Grammar tab:
  - Prefers structured `grammar` data over placeholders
  - Renders notes, patterns, exceptions with hierarchy
  - Hides tab when truly empty
- Quiz tab:
  - Renders quiz seed summary from `quizSeeds`
  - Hides tab when truly empty
- Demo updated to render **two different cards side-by-side**
  (`stagione` + `primavera`) for comparison

Still allowed:
- Additional renderer-only capability improvements
- Visual/layout polish inside the renderer
- Demo adjustments that do not introduce new concepts

Still forbidden:
- Any schema, card JSON, or media pipeline changes

<!-- __END_PS_PHASE16A_ACTIVE_PS040__ -->

---

<!-- __START_PS_ACTIVE_FILES_PS050__ -->

## ACTIVE FILES (MANDATORY MAP)

These files are required knowledge for the active flow.

### Renderer
- `ui/seasons-card/render.js`  
  Canonical Seasons Card renderer (vanilla JS)

### Card Data (read-only in Phase 16A)
- `ui/seasons-card/cards/primavera.card.json`
- `ui/seasons-card/cards/stagione.card.json`

### Demo / Entry Points
- `ui/seasons-card/demo.html`
  - Loads **two canonical cards** for renderer comparison
  - Acts as a renderer test harness, not a product surface

### Specs & Governance
- `docs/card-content-multiplicity-spec.md`
- `docs/WORKING_METHOD.md`
- `docs/DECISIONS.md`

Files not listed here are **not** part of the active reasoning surface.

<!-- __END_PS_ACTIVE_FILES_PS050__ -->

---

<!-- __START_PS_KNOWN_LIMITATIONS_PS060__ -->

## KNOWN INTENTIONAL LIMITATIONS

- Demo is a **renderer test harness**, not a learning flow
- Cards are rendered independently; no cross-card navigation exists yet
- Empty tabs are hidden per-card, not globally
- Demo does not represent final UX decisions

These behaviors are **intentional**, not bugs.

<!-- __END_PS_KNOWN_LIMITATIONS_PS060__ -->

---

<!-- __START_PS_PAUSE_IN_ACTION_LOG_PS070__ -->

## PAUSE IN ACTION LOG

### 2026-01-06 — Phase 16A Renderer Polish

- Renderer now correctly surfaces data multiplicity:
  examples, relations, grammar, quiz seeds
- Placeholder text no longer overrides real data
- Empty Grammar / Quiz tabs are hidden per-card
- Canonical images render correctly
- Demo updated to show two different cards simultaneously
- Phase 16A now stable and non-fragile

Repo is in a clean handoff state.

<!-- __END_PS_PAUSE_IN_ACTION_LOG_PS070__ -->

<!-- __END_FILE_PS000__ -->
