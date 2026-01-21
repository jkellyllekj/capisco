# Capisco Project State
Status: Authoritative operational truth
Last updated: 2026-01-21

## PURPOSE

This document defines the current operational truth of the Capisco project.

It answers:
What phase is active
What work is allowed versus frozen
Which files are authoritative right now
Why certain behaviours exist, to prevent rediscovery

If there is any conflict:
The project's designated project state file wins for navigation and intent
Specs win for semantics
Chat memory is never authoritative

This file is the designated project state file for Capisco.

Filename: PROJECT_STATE_CAPISCO.md

## AUTHORITATIVE DOCS AND WORKFLOW

Document hierarchy:
- WORKING-METHOD-REPLIT.md defines generic workflow and agent rules
- PROJECT_STATE_CAPISCO.md defines Capisco-specific current state
- Project state must always comply with the working method

Reference links:
- Working method: `WORKING-METHOD-REPLIT.md` (repo root)
- Project state: `docs/PROJECT_STATE_CAPISCO.md`

## AGENT USAGE RULES

Execution protocol:
- Agent executes only START / FINISH instruction blocks
- One commit per instruction unless explicitly directed otherwise
- Agent must not infer, continue, or extrapolate beyond instruction scope

Required reporting after each task:
- Commit hash
- Files changed
- Confirmation of tests run or errors encountered

State update triggers:
- Project state must be updated when scope, invariants, or known issues change
- Updates must be explicit in the instruction block

## FILE EDITING PROTOCOL

Block-marker replacement rules:
- When a file uses block markers (e.g., `// --- START BLOCK ---` and `// --- END BLOCK ---`), all edits must target content between markers only
- Markers themselves must be preserved unless explicitly told to remove them
- No line edits inside marked blocks; replace the entire block content

When markers must be introduced:
- When a section is expected to be replaced frequently
- When precision is critical and context decay is a risk

## NAMING AND PRIVACY NOTE

Repository naming:
- Repo name may be neutral or cryptic for privacy
- Product name is Capisco

Privacy rules:
- Avoid personal identifiers in repo metadata and commits
- Use GitHub noreply emails when possible
- Do not embed personal names in code comments or documentation

## IDEA PARKING LOT PROCESS

Purpose:
- Future ideas are parked, not implemented
- Parking an idea does not change current phase or scope

Process:
1. Ideas are recorded in project state under a dedicated "Parked Ideas" section
2. Parked ideas have no implementation timeline
3. Parked ideas may be promoted to active work only by explicit phase change

## OPERATIONAL NOTES (PUBLIC REPO)

When repo visibility or name changes:
- Update all canonical links in project state and working method
- Verify no private URLs remain in documentation

Preferred link formats:
- GitHub blob links with `?plain=1` for ChatGPT reading
- raw.githubusercontent.com links for direct file access
- Commit-pinned permalinks for debugging stability

## LONG TERM DIRECTION

Capisco is building a reusable, data driven card system that can scale to tens of thousands of cards.

Long run intent:

Cards are rich, canonical knowledge objects that are reusable across lessons and videos
A single renderer can render multiple card kinds using one shared approach
Images are first class, locally owned assets, not external dependencies
Quizzes are generated from stored seeds and ingredients, not hand authored per card
Governance is strict. Project state, working method, and recorded decisions are the source of truth

This phase does not implement the long run system.

This phase validates renderer behaviour safely, without any schema or contract change.

## CURRENT PHASE

Active phase:
Phase 16B, Seasons Renderer Integration

Primary goal:
Port the Seasons card renderer from the seasons test harness into the main Capisco lesson rendering path.
Capisco must render lesson vocabulary and sentence cards using the Seasons card UI.

Core constraints:
No schema changes
No card contract changes
No new data fields introduced
No media pipeline automation
No rewrite of lesson generation logic
Renderer integration must adapt to existing lesson data as it is

What this phase includes:
Wiring the Seasons renderer into the main lesson display path
Minimal adapter code that maps existing lesson items to renderer inputs
Loading the Seasons renderer and CSS in the main app flow
Visual verification that at least one vocab card and one sentence card render correctly inside a lesson

What this phase excludes:
Any change to card JSON structure or semantics
Any evolution of the card contract
Any automated image generation or ingestion system
Any refactor of Capisco core engine beyond the minimum integration seam

## STATUS SNAPSHOT

Current main lesson rendering path:
capisco-engine.js
displayLesson(lesson) injects HTML into the page by calling generateStructuredLessonHTML(lesson)

Current Seasons renderer location:
ui/seasons-card/render.js
Public entry is window.CapiscoSeasonsCard.render(container, rawCardData)

Card CSS source of truth:
style-seasons-card.css

## FROZEN VS ALLOWED

Frozen:
Schema changes
Contract changes
New fields
Big refactors
New framework migrations
Replacing the app structure

Allowed:
Small renderer only integration edits
Small adapter functions to map existing lesson items into Seasons card data
Small CSS or HTML wiring edits needed to load the renderer
Small demo harness adjustments only if required for integration testing

## ACTIVE FILES, MANDATORY MAP

These files are required knowledge for the active flow.

Main lesson app and renderer seam:
capisco-engine.js
index.html
script.js
style.css

Seasons card renderer:
ui/seasons-card/render.js

Seasons card styling:
style-seasons-card.css

Seasons card demo harness, reference only:
ui/seasons-card/demo.html
ui/seasons-card/viewport-lab.html

Seasons card demo data, read only in this phase:
ui/seasons-card/cards

Seasons card images, local only:
ui/seasons-card/images

Governance:
docs/PROJECT_STATE_CAPISCO.md
WORKING-METHOD-REPLIT.md

Specs and references:
docs/card-contract.md
docs/card-content-multiplicity-spec.md
docs/card-ui-port-plan.md

## INVARIANTS

GitHub is the source of truth, not chat memory
One goal per micro change
Each micro change is committed separately
No mystery code. Any new function must be explained in plain English
No app runs or runtime changes unless explicitly instructed

## KNOWN INTENTIONAL LIMITATIONS

Integration is incremental. At first, only a subset of lesson items may render via Seasons UI.
The goal is to prove the wiring, not to finish all lesson formatting at once.
Performance optimisation is out of scope in this phase.

## DECISIONS, BINDING FOR THIS PHASE

Renderer integration precedence:
Existing lesson data is the source of truth
Adapter code may transform shape for rendering only
Adapter code must not invent new semantics

Media policy for integration:
Use local, owned images when available in the existing data
Do not introduce any new image sourcing process in this phase

Scope enforcement:
Any work that changes schemas, contracts, or card field meanings is out of scope and must be deferred

## NEXT SINGLE STEP

Find the smallest integration seam in capisco-engine.js where lesson vocabulary items are rendered.
Add a minimal placeholder container per item.
Call window.CapiscoSeasonsCard.render for exactly one item to prove wiring.
Visually verify the Seasons card appears inside the lesson output.

## PAUSE IN ACTION LOG

2026-01-15
Context reset for Seasons renderer integration.
Project state updated to reflect Phase 16B and the new designated filename convention.
Next work is renderer integration only, starting with one card proof of wiring.

## PAUSE IN ACTION — 2026-01-XX

Context pause invoked due to rising complexity and risk of context decay.

### Current truth

- Seasons card renderer is stable and considered canonical.
- Vocab and sentence cards are first class knowledge objects.
- Cards include tabs, media, grammar, related links, and quizzes.
- A new lesson composition page exists at:
  ui/seasons-card/lesson-slice.html

This page:
- Renders real Seasons cards
- Uses existing card JSON files
- Acts as a lesson-style composer
- Proves lessons can be built from cards rather than inventing new UI

### Architectural clarification

Capisco now has three clear layers:
1) Content extraction (video, transcript)
2) Canonical cards (vocab and sentence)
3) Lessons as orchestration of cards

Lessons must not invent parallel card formats.

### Intent going forward

Next phase will be a vertical slice using a single short Italian video.
The slice will:
- Create a limited set of new canonical vocab cards
- Create a limited set of new canonical sentence cards
- Add them incrementally to the lesson slice page
- Use real cards to shape the future lesson UX

No schema or contract changes are allowed in this phase.

### Work frozen

- No new card creation until slice scope is explicitly defined
- No further lesson wiring until card templates are validated

### Breakfast Vertical Slice — 2026-01-16

- Breakfast vertical slice completed with real canonical cards.
- Added vocab cards: colazione, caffe, cornetto, biscotti.
- Added sentence cards: che-cosa-mangi-a-colazione, cosa-bevi-a-colazione, fai-colazione-a-casa, ti-piace-fare-colazione.
- lesson-slice manifest updated to include these cards and all render successfully.
- No schema changes. No contract changes. No new pipeline work for images yet.

## COPY SAFETY INVARIANT

Instruction formatting integrity is critical.

If formatting is broken, the instruction is invalid and must not be executed.

The human is responsible for copying the code block verbatim.
The agent is responsible for executing only what is inside the code block.

## NOISE ARTIFACT POLICY

No pasted instruction files or scratch artifacts may exist in the repository.

Forbidden files include:
- `Pasted-START-MESSAGE-TO-AGENT*.txt`
- Scratch notes containing prompts
- Temporary instruction artifacts

Any such file must be removed immediately before committing.
