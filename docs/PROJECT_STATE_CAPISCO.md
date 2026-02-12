# Capisco Project State
Status: Authoritative operational truth
Last updated: 2026-02-12

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

## QUICK ORIENTATION (READ THIS FIRST)

- **Capisco is in Phase 16C: Universal Lexicon & Breakfast Slice**
- The project has pivoted to a **Knowledge Architecture** strategy.
- **The "Ultimate Card"** is the atomic unit, designed to scale to 20,000+ entries.
- **100k Image Strategy:** Every card requires 4 aspect/style variants (Portrait, Landscape, Square, Drawn).
- **Universal Human Rule:** Human imagery in cards must be non-descript and representative of society at large.
- The Seasons card renderer is canonical and stable.
- Cards (vocab and sentence) are first-class knowledge objects.
- Lessons compose cards and must not invent parallel formats.
- No schema or contract changes are allowed in this phase.
- Governance is strict: working method and project state override chat memory.
- Changes must be small, explicit, and one-commit-at-a-time.
- If context risk rises, a Pause in Action must be invoked.

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
- **Zero-Pruning Rule:** Assistant must never truncate or abridge file contents during major edits.

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

- Cards are rich, canonical knowledge objects that are reusable across lessons and videos.
- A single renderer can render multiple card kinds using one shared approach.
- **Lexicon as Moat:** 80,000+ high-fidelity images linked to Universal Concept IDs.
- **80% Reuse:** Cards are language-agnostic at the core; only metadata changes per language.
- **Generative DNA:** Each card stores "Prompt Recipes" allowing for on-the-fly generation for premium users.
- Images are first class, locally owned assets, not external dependencies.
- Quizzes are generated from stored seeds and ingredients, not hand authored per card.
- Governance is strict. Project state, working method, and recorded decisions are the source of truth.

This phase does not implement the long run system.
This phase validates renderer behaviour safely, without any schema or contract change.

## PROJECT ANCHOR: WHAT CAPISCO IS BUILDING

Capisco is built bottom-up from real language usage, not from abstract curricula.

The core product is the **Card**: a canonical, reusable knowledge object representing a single vocabulary item, expression, or grammar unit. Cards are designed to scale to **10,000+ vocabulary cards and 10,000+ expression/sentence cards**, and to survive reuse across lessons, quizzes, chat, print, and future applications.

Lessons are not authored content.  
Lessons are compositions of cards derived from real transcripts. The lesson layer exists to organise, sequence, and present cards, not to redefine them.

Development proceeds using small, real transcript slices as reference test cases. These slices are used to validate card richness, renderer stability, layout constraints, and long-term scalability before any automation or large-scale ingestion is attempted.

## CURRENT PHASE

Active phase:
Phase 16C, Universal Lexicon & Breakfast Slice

Primary goal:
Card-up the full "Breakfast in Italy" transcript to validate the Universal Concept ID system and the 4-image Prompt DNA.

Core constraints:
- No schema changes to the existing SQLite structure.
- No contract changes that break the Seasons renderer.
- **Universal Human Invariant:** All image prompts must specify non-descript, representative people to ensure demographic neutrality.
- No rewrite of lesson generation logic.
- Renderer integration must adapt to existing lesson data as it is.

What this phase includes:
- Drafting the `breakfast-slice.json` manifest with ~35 canonical cards.
- Defining 4 image prompt variants (Portrait, Landscape, Square, Drawn) for every card.
- Wiring the Seasons renderer into the main lesson display path.
- Visual verification that at least one vocab card and one sentence card render correctly inside a lesson.

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
Drafting the Semantic Lexicon manifest for the test slice

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
**The 4-Image Standard:** All cards must eventually support 4 aspect/style variants.

## CARD LAYOUT LOCK (PHASE 16B/C)

Purpose  
Lock the Seasons card visual and structural layout so lessons can safely compose cards without creating parallel UI formats.

Rules  
- The Seasons renderer is the single canonical way to render cards.  
- Lessons compose cards. Lessons must not invent new card formats, layouts, or semantics.  
- Cards remain first class knowledge objects. Lessons are containers only.  
- Adapter code may exist only to map existing card data into the renderer. It must not invent meaning.

Layout expectations  
- Card layout must be stable enough that lessons can place cards in sequence without special casing per card.  
- Vocabulary cards and sentence or expression cards must render with a consistent visual hierarchy.  
- Sections and tabs may hide when empty, but the overall card structure must remain consistent.  
- Media placement is fixed by the Seasons renderer. Image pipeline automation is explicitly out of scope for this phase.

Definition of done for layout lock  
- Breakfast vertical slice cards render consistently using the Seasons renderer.  
- At least one vocabulary card and one sentence or expression card render correctly inside the lesson slice.  
- No schema changes.  
- No card contract changes.

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

Universal Human Rule:
Human imagery in prompts must be non-descript and representative of a global population to ensure semantic reuse across cultures.

## NEXT SINGLE STEP

Extract the first 10 cards from the Breakfast transcript and draft the JSON manifest including the 4-variant Prompt DNA for each.

## PAUSE IN ACTION LOG

2026-01-15
Context reset for Seasons renderer integration.
Project state updated to reflect Phase 16B and the new designated filename convention.
Next work is renderer integration only, starting with one card proof of wiring.

2026-02-12
**Phase 16C Activated.** Transition to "Logical Architect" protocol. Pivot to Universal Lexicon and Semantic Concept mapping. Locked 4-image prompt logic and Universal Human standard.

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

### Phase 16B - Renderer Solidity and First Slice Test - 2026-01-21

- Completed partial-data layout stability pass on Seasons card renderer.
- Empty tag pills now hidden using CSS :empty.
- Card title never renders blank. Fallback label is used when headword is missing.
- Empty examples state standardised to "No examples yet."
- Pronunciation row visibility no longer depends on string length.
- Grammar and Quiz tabs remain visible with placeholders instead of being removed.
- Global .hidden { display: none; } utility is treated as layout invariant.
- Started first concrete lesson slice using a real transcript.
- Test lesson based on "What Italians usually have for breakfast".
- Implemented in ui/seasons-card/lesson-slice.html.
- Uses an in-page manifest with 10 starter cards.
- Cards include vocab and expression types.
- Each card includes images.fallback with type: "auto" and a prompt.
- Purpose is to validate card completeness and renderer behaviour before scaling.
- Pause In Action recorded.
- Next step is manual visual testing of lesson slice in preview.
- Confirm media fallback, tabs, audio hover, and mixed card types.
- No further wiring or schema work until testing is confirmed.

### CANONICAL SAMPLE SLICE (REFERENCE CASE)

The current reference slice for Capisco development is based on a short real-world Italian video transcript.

**Source video**
- Title: What Italians usually have for breakfast | Super Easy Italian 1
- Source: Super Easy Italian (YouTube)
- URL: https://www.youtube.com/watch?v=8Pmz1TZ6OLc
- Length: approximately 2 minutes

**Purpose of this slice**
This slice exists as a concrete, end-to-end reference for how Capisco works.

From this single transcript:
- Individual vocabulary cards are created for each meaningful word.
- Expression / sentence cards are created for common multi-word units.
- Cards are treated as canonical objects, independent of the lesson.
- A minimal lesson slice may compose these cards only to validate rendering and composition.

This slice is intentionally small and manual. It is not an automation test.

Its role is to validate:
- card completeness and richness
- Seasons card renderer stability
- layout behaviour under partial and full data
- assumptions required to scale toward 10,000+ cards

This breakfast transcript remains the canonical reference case until explicitly superseded.

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