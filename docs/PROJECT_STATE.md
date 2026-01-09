# Capisco, Project State
Status: Authoritative, Operational Truth
Last updated: 2026-01-09

## PURPOSE

This document defines the current operational truth of the Capisco project.

It answers
What phase is active
What work is frozen vs allowed
Which files are authoritative right now
Why certain behaviours exist, to prevent rediscovery

If there is any conflict
PROJECT_STATE.md wins for navigation and intent
Specs win for semantics
Chat memory is never authoritative

## LONG TERM DIRECTION

Capisco is building a reusable, data driven card system that can scale to tens of thousands of cards.

Long run intent
Cards are rich, canonical knowledge objects, reusable across lessons and videos
A single renderer can render multiple card kinds from the same core approach
Images are first class assets that are local and owned, not external dependencies
Quizzes are generated from stored seeds and ingredients, not hand authored per card
Governance is strict, state, method, and decisions are the source of truth

This phase does not implement the long run system.
This phase validates renderer behaviour safely, without any contract change.

## CURRENT PHASE

Active phase
Phase 16A, Renderer Capability Expansion

Scope
Renderer only improvements to support existing card multiplicity
Support for both vocab cards and sentence cards using the same renderer
Demo behaviour may be adjusted strictly as a renderer test harness

Explicit constraints
No schema changes
No card contract changes
No new data fields introduced
No media pipeline automation

What renderer only includes
ui/seasons-card/render.js
ui/seasons-card/demo.html

What it explicitly excludes
Any changes to card json structure or semantics
Any evolution of the card contract
Any automated image generation or ingestion system

Clarifications
Sentence cards, for example come-stai, are first class cards
Images are supporting assets, not drivers of schema or phase scope
This phase validates rendering behaviour only

## PHASE 15, LOCKED, COMPLETE

Phase 15, Card Content Expansion and Multiplicity

Status
Complete

Summary
Dense card data added using existing contract fields only
Multiple examples, relations, variants, senses, and quiz seeds validated
No renderer, schema, or media pipeline changes performed

Authoritative reference
docs/card-content-multiplicity-spec.md

Phase 15 is closed and must not be modified.

## PHASE 16A, ACTIVE

Phase 16A, Renderer Capability Expansion

Purpose
Validate that the renderer can correctly surface rich card data
Confirm that vocab cards and sentence cards share a single rendering path
Validate image rendering using locally owned, canonical images

Completed in this phase
Examples tab renders all examples
Related tab renders relations grouped by category
Grammar tab prefers structured grammar data over placeholders
Quiz tab renders quiz seed summaries
Empty Grammar and Quiz tabs are hidden per card
Renderer prefers images canonical first with graceful fallback
Legacy icon rendering disabled
Demo supports mixed card types, vocab plus sentence
Local, owned images render correctly for sentence cards
Sentence card Overview adapted so sentence cards do not look empty compared to vocab cards

Explicit non goals
No image generation automation
No image sourcing workflow
No external dependency integration for images
No schema or contract evolution

Image policy in Phase 16A
One owned image per card is sufficient
Cards may support multiple images in later phases
Image cropping, sizing, and performance tuning are renderer concerns only

Phase 16A is stable but not final.

## ACTIVE FILES, MANDATORY MAP

These files are required knowledge for the active flow.

Renderer
ui/seasons-card/render.js

Demo and entry point
ui/seasons-card/demo.html

Card data, read only in Phase 16A
ui/seasons-card/cards/stagione.card.json
ui/seasons-card/cards/primavera.card.json
ui/seasons-card/cards/estate.card.json
ui/seasons-card/cards/autunno.card.json
ui/seasons-card/cards/inverno.card.json
ui/seasons-card/cards/come-stai.json

Assets, local only
ui/seasons-card/images

Styles, source of truth for card
style-seasons-card.css

Governance
docs/PROJECT_STATE.md
docs/WORKING_METHOD.md

Any file not listed here is out of scope for reasoning.

## KNOWN INTENTIONAL LIMITATIONS

Demo is a renderer test harness, not a learning flow
Cards render independently, no navigation between cards
Empty tabs are hidden per card
Image loading is not yet optimised for performance
Image cropping issues are known and acceptable in Phase 16A
Demo currently includes extra inline CSS for layout experiments
This is acceptable in Phase 16A
In later phases we may consolidate into style-seasons-card.css

These behaviours are intentional, not bugs.

## DECISIONS, LOCKED

These decisions are binding for Phase 16A.
They are not subject to aesthetic preference.

### Renderer precedence rules

Data vs placeholder
Structured data always wins over placeholder text
grammar overrides placeholders grammar
quizSeeds overrides placeholders quiz
Placeholders are fallback only when no structured data exists

Media selection
Preferred order
images canonical first item
media canonical
media fallback
Legacy icon rendering is disabled and must not reappear

Media presentation
Canonical images must be shown as full images, not cut offs
Default renderer behaviour must avoid cropping canonical images

Sentence card presentation rules
Sentence cards are first class and must not look empty compared to vocab cards
For sentence cards, Overview must be adapted
Phrase row shown
Plural row hidden
Examples are surfaced on Overview
Notes are surfaced on Overview when available
Tabs remain available, Overview is a summary not a replacement

Tag pill mapping rules
Vocab cards may use object style tags
Sentence cards often use
level as the Level pill
lemmaId as the Id pill
first item of tags array as the Category pill
The renderer must not crash if tags is null, missing, or an array

Visibility rules
Tabs with no meaningful content must be hidden per card
Grammar tab hidden if no grammar data and no placeholder
Quiz tab hidden if no quiz seeds and no placeholder
Empty state text must never mask real data

### Image creation prompt template

Purpose
Provide a stable, reusable prompt for generating canonical images for cards
Optimised for sentence cards, but usable for any card
Enforces full frame composition and avoids cut offs

Canonical two image set rule
Generate two images of the same moment
Primary is landscape 16 by 9
Secondary is portrait 4 by 5

Both images must
Match subject, clothing, person, theme, and setting
Be full frame with no cut offs
Avoid cropping style framing or extreme close ups that hide context
Include no text, no subtitles, no logos, and no watermarks

Prompt template to use in ChatGPT

Create two high quality, photorealistic images that clearly represent the meaning of the provided text.

Image A, primary
Landscape 16 by 9
Full frame, no cut offs

Image B, secondary
Portrait 4 by 5
Full frame, no cut offs

The two images must depict the same moment with the same subject, clothing, setting, and theme.
They should be two beautiful, unique versions of the scene.

Text to represent
TARGET_TEXT

English meaning
ENGLISH_MEANING

Style requirements
Photorealistic, cinematic documentary realism
Natural lighting, natural colours, high detail, sharp focus
Clear story moment that makes the meaning instantly understandable
Scene should be readable at a glance, not cluttered

Negative requirements
No text, no subtitles, no logos, no watermarks
No cropped heads, hands, or key objects
No distorted anatomy
No collage layouts
No surreal or cartoon style unless explicitly requested

Return only the images.

### Other decisions

If there are additional decisions in the repo, merge them into this section and then treat docs/PROJECT_STATE.md as the single source of truth.

## PAUSE IN ACTION LOG

2026-01-07, Phase 16A Stabilisation and Image Validation
Sentence cards validated as first class renderer inputs
Local, owned images validated as canonical assets
Image prompts tested and proven effective
Renderer remains schema agnostic
Demo supports mixed card types, vocab plus sentence
Context saturation detected and handled via Pause In Action
Repo prepared for clean handoff and new chat
Repo state is safe to commit and push

2026-01-08, Phase 16A Image Handling Notes, No Further Layout Changes
Confirmed the desired behaviour is full images, not cut offs
Confirmed that portrait dominance on smaller viewports is acceptable for now
Decision, do not add portrait specific layout hacks
Action, revert demo layout tweak and keep responsive behaviour as it was
Captured image creation guidance for later phases, landscape primary plus portrait secondary, same subject and setting

2026-01-08, Phase 16A Sentence Overview Pass
Sentence cards updated so they do not look bland compared to vocab cards
Overview for sentence cards now surfaces phrase, pronunciation when present, examples, and notes
Plural row hidden for sentence cards
Tag pills for sentence cards mapped from sentence fields, level, lemmaId, and first tag when available
Demo validated in two up mode with mixed card types

Next queued work
CSS only, refine pill styling and clearly differentiate English vs Italian text styling
