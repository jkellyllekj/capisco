<!-- __START_FILE_WM000__ -->

Capisco — Working Method (Structured Vibe Coding System)

Last updated: 2026-01-01  
Status: Authoritative


PURPOSE

This document defines how we work, not what we build.

It exists to:
- preserve creative, intuitive (“vibe”) exploration
- eliminate the failure modes of *undisciplined* vibe coding
- ensure continuity across Capisco and future apps
- make progress repeatable, calm, and deliberate

This is **vibe coding done correctly**, with structure, memory, and guardrails.

If there is a conflict between chat instructions and this file, this file wins.


PHASE DISCIPLINE

- Work is divided into explicit phases
- Each phase has:
  - a name
  - a purpose
  - allowed actions
  - non-goals
- Phase changes must be explicitly declared

Current phase: Phase 8 — Memory, Method, and Continuity


ONE-STEP RULE (CRITICAL)

Rule:  
We do one step at a time.

- One file OR one block OR one decision per step
- No multi-step instructions
- No “while you’re at it”
- No future steps bundled together

This constraint preserves flow while preventing loss of control.

If a response contains multiple steps, it is invalid.


BLOCK-TAG EDITING SYSTEM

All editable files must use block tags so changes are:
- searchable
- replaceable
- safe
- reviewable

Rules:
- Edits are full block replacements only
- Reference inner block names only
- No line edits

Tag format descriptions:
- HTML / Markdown: START and END comments
- CSS: START and END comments
- Python: START and END comments
- JSON:
  - no block tags
  - no comments
  - must remain valid JSON


CONTRACTS BEFORE FEATURES

- Core objects (for example, the Card) require a written contract
- Rendering invariants come before layout polish
- Feature ideas are parked unless they update a contract first

This keeps creative exploration grounded in durable structure.


DECISION CAPTURE

- Durable decisions are logged in docs/DECISIONS.md
- Decisions are:
  - dated
  - concise
  - constraint-oriented
- Chat transcripts are not copied
- Only decisions that still matter are recorded


NEW PHASE START CHECKLIST (MANDATORY)

At the start of any new chat or phase:

1. Identify the current phase
2. Re-read:
   - PROJECT_STATE.md
   - WORKING_METHOD.md
   - DECISIONS.md
3. State:
   - what is frozen
   - what is allowed
   - what the next single step is

If this checklist is skipped, stop and reset.


LONG-TERM GOAL

Capisco is the first proving ground.

The real objective is to build a:
- reusable development method
- transferable across apps
- compatible with creative, exploratory “vibe coding”
- without losing coherence, memory, or direction

This document is as important as any code.

<!-- __END_FILE_WM000__ -->
