# Capisco Project State
Status: Authoritative operational truth
Last updated: 2026-01-15

## PURPOSE

This document defines the current operational truth of the Capisco project.

It answers:
What phase is active
What work is allowed versus frozen
Which files are authoritative right now
Why certain behaviours exist, to prevent rediscovery

If there is any conflict:
The project’s designated project state file wins for navigation and intent
Specs win for semantics
Chat memory is never authoritative

This file is the designated project state file for Capisco.

Filename: PROJECT_STATE_CAPISCO.md

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
docs/WORKING-METHOD-REPLIT.md

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
