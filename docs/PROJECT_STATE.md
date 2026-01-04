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
- Which files are “in play” for the current phase (Active Files)

If anything here conflicts with chat, **this file wins**.

### Active Files (Phase 12 — Card Data & Rendering Kickoff)

Rendering flow (authoritative seam):
1) ui/seasons-card/demo.html
   - loads ./render.js
   - fetches ./cards/*.card.json
   - calls CapiscoSeasonsCard.renderMany(...)

2) ui/seasons-card/render.js
   - renderer entry point (CapiscoSeasonsCard.render / renderMany)

3) ui/seasons-card/cards/stagione.card.json
   - current demo card payload (baseline)

4) ui/seasons-card/cards/primavera.card.json
   - new Phase 12 card payload (to be created)

5) style-seasons-card.css
   - stylesheet used by the demo page
s
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

Phase 13 — Media Contract Wiring & Automation

Status:
- Phase 12 proved end-to-end rendering from a pure JSON card payload.
- Current renderer still contains legacy assumptions and temporary bridges (e.g. top-level `src`).

Purpose:
- Make the renderer consume the **locked media contract** (`card.media.canonical[]` + `card.media.fallback`)
  instead of legacy/bridge fields.
- Ensure media always renders as a bounded slot (canonical → fallback → placeholder) with no layout overflow.
- Establish the scalable path for 10k+ cards: “fallback-first, curate canonicals over time”.

Allowed in this phase:
- Updating renderer media wiring to read from `card.media.*` (contract-compliant).
- Removing temporary media bridges (e.g. root `src`) once contract wiring works.
- Adding minimal helper logic to select a canonical media item deterministically.
- Non-breaking refactors limited to media-only surfaces.
- Full-block replacements only.

Not allowed in this phase:
- UI redesign / layout changes.
- Changing the card contract fields (no schema drift).
- Building the full batch pipeline yet (only define + stub decisions if needed).
- Expanding quiz/game logic.

Exit condition:
- A card renders media using only `card.media.canonical[]` (when present),
  otherwise uses `card.media.fallback`, otherwise shows a stable placeholder,
  with no reliance on root `src` and no overflow regressions.

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
