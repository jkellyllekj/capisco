<!-- __START_FILE_PS000__ -->

# Capisco — Project State  
Status: **Authoritative (Operational Truth)**  
Last updated: 2026-01-07

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
- Renderer-only improvements to support **existing card multiplicity**
- Support for **both vocab cards and sentence cards** using the same renderer
- Demo behavior may be adjusted strictly as a renderer test harness

Explicit constraints:
- ❌ No schema changes
- ❌ No card contract changes
- ❌ No new data fields introduced
- ❌ No media pipeline automation

What “renderer-only” includes:
- `ui/seasons-card/render.js`
- `ui/seasons-card/demo.html`

What it explicitly excludes:
- Any changes to `.card.json` structure or semantics
- Any evolution of the card contract
- Any automated image generation or ingestion system

Clarifications:
- Sentence cards (e.g. `come-stai`) are **first-class cards**
- Images are **supporting assets**, not drivers of schema or phase scope
- This phase validates rendering behavior only

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
- Validate that the renderer can correctly surface **rich card data**
- Confirm that **vocab cards and sentence cards** share a single rendering path
- Validate image rendering using **locally owned, canonical images**

Completed in this phase:
- Examples tab renders **all examples**
- Related tab renders **relations grouped by category**
- Grammar tab prefers structured grammar data over placeholders
- Quiz tab renders quiz seed summaries
- Empty Grammar / Quiz tabs are hidden per-card
- Renderer prefers `images.canonical[0]` with graceful fallback
- Legacy icon rendering disabled
- Demo supports **mixed card types** (vocab + sentence)
- Local, owned images render correctly for sentence cards

Explicit non-goals:
- No image generation automation
- No image sourcing workflow
- No Unsplash or external dependency integration
- No schema or contract evolution

Image policy (Phase 16A):
- One owned image per card is sufficient
- Cards may support multiple images in future phases
- Image cropping, sizing, and performance tuning are renderer concerns only

Phase 16A is **stable but not final**.

<!-- __END_PS_PHASE16A_ACTIVE_PS040__ -->

---

<!-- __START_PS_ACTIVE_FILES_PS050__ -->

## ACTIVE FILES (MANDATORY MAP)

These files are required knowledge for the active flow.

### Renderer
- `ui/seasons-card/render.js`

### Demo / Entry Point
- `ui/seasons-card/demo.html`

### Card Data (read-only in Phase 16A)
- `ui/seasons-card/cards/stagione.card.json`
- `ui/seasons-card/cards/primavera.card.json`
- `ui/seasons-card/cards/estate.card.json`
- `ui/seasons-card/cards/autunno.card.json`
- `ui/seasons-card/cards/inverno.card.json`
- `ui/seasons-card/cards/come-stai.json`

### Assets
- `ui/seasons-card/images/**` (locally owned images only)

### Governance
- `docs/WORKING_METHOD.md`
- `docs/DECISIONS.md`

Any file not listed here is **out of scope for reasoning**.

<!-- __END_PS_ACTIVE_FILES_PS050__ -->

---

<!-- __START_PS_KNOWN_LIMITATIONS_PS060__ -->

## KNOWN INTENTIONAL LIMITATIONS

- Demo is a **renderer test harness**, not a learning flow
- Cards render independently; no navigation between cards
- Empty tabs are hidden per-card
- Image loading is not yet optimised for performance
- Image cropping issues are known and acceptable in Phase 16A

These behaviors are **intentional**, not bugs.

<!-- __END_PS_KNOWN_LIMITATIONS_PS060__ -->

---

<!-- __START_PS_PAUSE_IN_ACTION_LOG_PS070__ -->

## PAUSE IN ACTION LOG

### 2026-01-07 — Phase 16A Stabilisation & Image Validation

- Sentence cards validated as first-class renderer inputs
- Local, owned images validated as canonical assets
- Image prompts tested and proven effective
- Renderer remains schema-agnostic
- Context saturation detected and handled via Pause In Action
- Repo prepared for clean handoff and new chat

Repo state is **safe to commit and push**.

<!-- __END_PS_PAUSE_IN_ACTION_LOG_PS070__ -->

<!-- __END_FILE_PS000__ -->
