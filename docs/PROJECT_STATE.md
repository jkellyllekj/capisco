# Capisco — Project State (Authoritative)
Last updated: 2026-01-04

<!-- __START_PROJECT_STATE_REANCHOR_S100__ -->

## If this is a new ChatGPT page, read this first (MANDATORY)

### Canonical re-anchor links (use these every new chat)
- PROJECT_STATE (this file): https://github.com/jkellyllekj/capisco/blob/main/docs/PROJECT_STATE.md?plain=1
- WORKING_METHOD (authoritative process): https://github.com/jkellyllekj/capisco/blob/main/docs/WORKING_METHOD.md?plain=1
- DECISIONS (durable constraints): https://github.com/jkellyllekj/capisco/blob/main/docs/DECISIONS.md?plain=1

### Repo entrypoints (human navigation)
- Demo: `ui/seasons-card/demo.html`
- Viewport Lab: `ui/seasons-card/viewport-lab.html`
- Styles: `style-seasons-card.css`
- Card UI / renderer: (keep updated) `ui/seasons-card/render.js` (or replace with true path)

### Current phase (single source of truth)
**Current Phase:** Phase 15 — Card Content Expansion & Multiplicity (DATA / CONTRACT ONLY)

<!-- __END_PROJECT_STATE_REANCHOR_S100__ -->


<!-- __START_PROJECT_STATE_PHASE15_S200__ -->

## Phase 15 — Card Content Expansion & Multiplicity

### Purpose
Expand the **Card content model** to support richer content and **multiplicity** (multiple examples, senses, registers, images, forms, etc.) while preserving the existing contract + scalable rendering approach.

### Allowed (Phase 15)
- Data-first/spec-first work only:
  - Define the **multiplicity rules** (what can repeat, ordering, IDs, precedence).
  - Define the **expanded content fields** (required vs optional).
  - Define **authoring / canonicalization** rules (how we store “one true” canonical content).
  - Update **contracts/docs first** (PROJECT_STATE / DECISIONS / card-contract).
- No implementation changes unless/until the spec is locked and Phase explicitly permits.

### Non-goals (Phase 15)
- No renderer refactors.
- No layout polish.
- No new UI features.
- No “quick hacks” to squeeze data into old shapes.

### Frozen / true right now (carry-forward)
- Phases 12–14 are complete and committed (media pipeline contract-aligned and scalable). (If repo contradicts, repo wins.)
- Phase 6C demo layout is “good enough” and frozen.
- Demo-level layout tuning is paused.
- The **Card is the canonical product object**, not a demo artifact.
- JSON files are **data only** (no comments, no marker blocks).
- Marker blocks are used only in HTML / CSS / JS / MD files.
- One change per step.
- Full block replacements only (no line edits).
- Treat code as liability: minimize surface area.

### Next single step (Phase 15.1)
Define the **Card Content Multiplicity Spec** (data-only): a precise list of fields + which ones are singular vs arrays, including ID rules and ordering rules.
(No code. No rendering changes.)

<!-- __END_PROJECT_STATE_PHASE15_S200__ -->


<!-- __START_PROJECT_STATE_CANONICAL_DOCS_S300__ -->

## Canonical docs (authoritative)
- Working rules: `docs/WORKING_METHOD.md`
- Decisions: `docs/DECISIONS.md`
- Card contract: `docs/card-contract.md` (reference; must be updated if Phase 15 changes the model)
- UI port plan: `docs/ui-port-plan.md` (reference)
- Retrospective candidates: `docs/retrospective-candidates.md` (reference)
- README / Replit notes: `README.md`, `replit.md`

<!-- __END_PROJECT_STATE_CANONICAL_DOCS_S300__ -->


<!-- __START_PROJECT_STATE_ARCHIVE_S900__ -->

## Completed / Archived context (keep for history; not “current truth”)

### Previously observed drift (resolved by this rewrite)
This file previously contained multiple conflicting “Current phase” declarations (Phase 6C/6D, Phase 7, Phase 9). This rewrite establishes **one** current phase.

### Historical notes (do not treat as current)
- Phase 6C / 6D: Seasons Card Demo + Viewport Lab (layout stability work; “good enough”)
- Phase 7–9: Contract/invariant work (media containment, marker workflow, etc.)
- Phases 12–14: Completed + committed (per current team truth; repo is canonical if conflict)

<!-- __END_PROJECT_STATE_ARCHIVE_S900__ -->
