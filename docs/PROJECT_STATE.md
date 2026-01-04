# PROJECT_STATE.md
# Capisco — Project State (Authoritative)

Last updated: 2026-01-04  
Current phase: Phase 11 — Media Invariants Lock & Demo Cleanup

---

<!--
============================================================================
BLOCK INDEX
S010 — PROJECT_STATE_META
S020 — PROJECT_GOAL
S030 — CURRENT_PHASE
S040 — DONE_LOCKED
S050 — INVARIANTS
S060 — FROZEN
S070 — ALLOWED
S080 — NOT_ALLOWED
S090 — WORKING_DISCIPLINE
S100 — EXIT_CONDITION
S110 — MEDIA_MODEL_V1
S120 — CARD_CONTENT_MODEL_V1
S130 — GAMES_AND_SRS_MODEL_V1
S150 — QUIZ_ENGINE_CONTRACT_V1
============================================================================
-->

__START_PROJECT_STATE_META_S010__
## Purpose of this file

This file defines the **current truth of the project**:
- What phase we are in
- What is frozen
- What is allowed
- What contracts are in force

If anything here conflicts with chat, **this file wins**.
__END_PROJECT_STATE_META_S010__

---

__START_PROJECT_GOAL_S020__
## High-level project goal (unchanged)

Capisco builds **ultimate vocabulary and expression cards** as immutable knowledge objects.
These cards power:
- instant lessons from transcripts
- adaptive games and spaced repetition
- future printable and exportable formats

Cards must scale to **10k+ vocab + 10k+ expressions** without redesign.
__END_PROJECT_GOAL_S020__

---

__START_CURRENT_PHASE_S030__
## CURRENT_PHASE_S030

Phase 12 — Card Data & Rendering Kickoff

Status:
- Phase 11 is complete and locked.
- All core contracts are frozen (card schema, media contract, quiz/game contracts).
- No card data or renderer implementation has begun yet.

Purpose:
- Establish the first concrete, repo-backed card data example.
- Define the minimum rendering pipeline that can take a card object and render it using the locked UI contracts.

Allowed in this phase:
- Creating canonical example card data files (single-card scope).
- Wiring card data → renderer entry point.
- Non-visual scaffolding needed to render a card deterministically.
- Full-block replacements only.

Not allowed in this phase:
- UI redesign or layout changes.
- New card fields or contract drift.
- Multiple card types at once.
- Game/quiz logic expansion.

Exit condition:
- One real card renders end-to-end from data → renderer with no contract violations.

__END_CURRENT_PHASE_S030__

---

__START_DONE_LOCKED_S040__
## What is DONE (locked)

- Image clipping and grid overflow resolved
- Root cause identified (CSS grid min-width overflow)
- Fix validated (`minmax(0, 1fr)`)
- Demo layout considered stable and frozen
__END_DONE_LOCKED_S040__

---

__START_INVARIANTS_S050__
## Invariants

- Media must never expand layout
- Cards must tolerate partial data
- UI degrades gracefully
- Contracts > aesthetics
__END_INVARIANTS_S050__

---

__START_FROZEN_S060__
## What is frozen

- Card layout structure
- Demo layout
- Grid fix pattern
__END_FROZEN_S060__

---

__START_ALLOWED_S070__
## What is allowed

- Contract definition
- Structural cleanup
- Non-breaking refactors
__END_ALLOWED_S070__

---

__START_NOT_ALLOWED_S080__
## What is not allowed

- New UI features
- Demo redesign
- Partial edits
__END_NOT_ALLOWED_S080__

---

__START_WORKING_DISCIPLINE_S090__
## Working discipline

- One step at a time
- Full block replacement only
- No guessing
__END_WORKING_DISCIPLINE_S090__

---

__START_EXIT_CONDITION_S100__
## Exit condition

Phase 11 ends when media, content, and quiz contracts are locked.
__END_EXIT_CONDITION_S100__

---

__START_MEDIA_MODEL_V1_S110__
## Media Model v1 (contract)

Cards support **0..N media items** with canonical + responsive derivatives.
Media includes source, license, and attribution.
Media must never cause layout overflow.
__END_MEDIA_MODEL_V1_S110__

---

__START_CARD_CONTENT_MODEL_V1_S120__
## Card Content Model v1 (contract)

Cards are immutable semantic objects supporting:
- multiple senses
- examples
- etymology
- related terms
- quiz seeds

Cards must render from minimal to fully populated states.
__END_CARD_CONTENT_MODEL_V1_S120__

---

__START_GAMES_AND_SRS_MODEL_V1_S130__
## Games + SRS Model v1 (contract)

Learning uses **games**, not static quizzes.
Each user has per-card mastery state with SRS scheduling.
Difficulty adapts to mastery and vocabulary breadth.
__END_GAMES_AND_SRS_MODEL_V1_S130__

---

__START_QUIZ_ENGINE_CONTRACT_V1_S150__
## Quiz Engine + Endless Quiz Contract v1

Questions are generated from **templates** with declared requirements.
Only legal templates may be used.
Each answer yields feedback and explanation.
Sessions run as an “endless quiz” loop.
User preferences bias question selection.
__END_QUIZ_ENGINE_CONTRACT_V1_S150__

---

End of file.
