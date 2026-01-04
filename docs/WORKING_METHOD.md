<!-- __START_FILE_WM000__ -->

# Capisco — Working Method  
## Structured Vibe Coding System

Last updated: 2026-01-04  
Status: **Authoritative**

---

<!--
============================================================================
BLOCK INDEX
WM010 — PURPOSE
WM020 — CORE_ENTITIES
WM030 — PHASE_DISCIPLINE
WM040 — ONE_STEP_RULE
WM050 — DOCUMENTATION_PARITY_RULE
WM060 — BLOCK_TAG_SYSTEM
WM070 — NUMERIC_BLOCK_ID_RULE
WM080 — CONTRACTS_BEFORE_FEATURES
WM090 — DECISION_CAPTURE
WM100 — REANCHORING
WM110 — PHASE_START_CHECKLIST
WM120 — PAUSE_IN_ACTION
WM130 — LONG_TERM_GOAL
============================================================================
-->

<!-- __START_WM_PURPOSE_WM010__ -->

## PURPOSE

This document defines **how we work**, not what we build.

It exists to:
- preserve creative, intuitive (“vibe”) exploration
- eliminate the failure modes of *undisciplined* vibe coding
- ensure continuity across long-running projects
- make progress repeatable, calm, and deliberate

This is **vibe coding done correctly** — with structure, memory, and guardrails.

If there is any conflict between chat instructions and this file,  
**this file wins**.

<!-- __END_WM_PURPOSE_WM010__ -->

---

<!-- __START_WM_CORE_ENTITIES_WM020__ -->

## CORE ENTITIES (IMPORTANT DEFINITIONS)

### Project
A **long-lived codebase and repository** (e.g. *Capisco*).

- Canonical truth lives in **GitHub**
- Governed by:
  - `PROJECT_STATE.md`
  - `DECISIONS.md`
  - `WORKING_METHOD.md`

### Phase
A **bounded unit of intent**.

- Has a name and purpose
- May span multiple chat pages
- Explicitly entered and exited
- Progress is recorded in `PROJECT_STATE.md`
- Durable constraints may be logged in `DECISIONS.md`

### Chat Page
A **single ChatGPT conversation**.

- Has limited working memory
- Degrades over time
- Is **disposable by design**
- Never treated as a source of truth

Rule:  
When a chat page becomes overloaded or confused, it must be ended deliberately.

<!-- __END_WM_CORE_ENTITIES_WM020__ -->

---

<!-- __START_WM_PHASE_DISCIPLINE_WM030__ -->

## PHASE DISCIPLINE

Work is divided into explicit phases.

Rules:
- Phase changes must be **explicitly declared**
- Work outside the active phase is invalid
- A phase may span multiple chat pages

<!-- __END_WM_PHASE_DISCIPLINE_WM030__ -->

---

<!-- __START_WM_ONE_STEP_RULE_WM040__ -->

## ONE-STEP RULE (CRITICAL)

**We do one step at a time.**

- One file **OR**
- One block **OR**
- One decision

Never more than one.

Disallowed:
- multi-step responses
- “while you’re at it”
- bundled future work

If a response contains more than one step, it is **invalid**.

<!-- __END_WM_ONE_STEP_RULE_WM040__ -->

---

<!-- __START_WM_DOCUMENTATION_PARITY_WM050__ -->

## DOCUMENTATION PARITY RULE (CRITICAL)

**Documentation is treated as code.**

This includes:
- `PROJECT_STATE.md`
- `DECISIONS.md`
- `WORKING_METHOD.md`
- Any protocol, contract, or process file

Rules:
- All documentation must use block tags
- All edits are **full block replacements only**
- Partial, line-level edits are forbidden

Violating this rule is a **process failure**, not a formatting issue.

<!-- __END_WM_DOCUMENTATION_PARITY_WM050__ -->

---

<!-- __START_WM_BLOCK_TAG_SYSTEM_WM060__ -->

## BLOCK-TAG EDITING SYSTEM

All editable files must be divided into explicit blocks.

Rules:
- Each block has `__START__` and `__END__`
- Blocks represent a single conceptual unit
- Only entire blocks may be replaced
- Reference block names directly in discussion

Tag formats:
- Markdown / HTML: `<!-- __START__ -->`
- CSS / JS: `/* __START__ */`
- JSON:
  - no block tags
  - no comments
  - must remain valid JSON

This document follows its own rules.

<!-- __END_WM_BLOCK_TAG_SYSTEM_WM060__ -->

---

<!-- __START_WM_NUMERIC_BLOCK_ID_WM070__ -->

## NUMERIC BLOCK ID RULE (STABILITY GUARANTEE)

All block tags must include a **stable numeric identifier**.

Example:
<!-- __START_WM_PURPOSE_WM010__ -->
php-template
Copy code

Rules:
- Numbers are monotonic (WM010, WM020, WM030…)
- Numbers never change once assigned
- Names may evolve; numbers must not

Numeric IDs exist to:
- eliminate ambiguity
- support long-running evolution
- allow precise references across chats

<!-- __END_WM_NUMERIC_BLOCK_ID_WM070__ -->

---

<!-- __START_WM_CONTRACTS_WM080__ -->

## CONTRACTS BEFORE FEATURES

- Core objects require written contracts
- Invariants come before polish
- Feature ideas are parked until a contract changes

<!-- __END_WM_CONTRACTS_WM080__ -->

---

<!-- __START_WM_DECISION_CAPTURE_WM090__ -->

## DECISION CAPTURE

- Durable constraints go in `DECISIONS.md`
- Decisions are concise and dated
- Chat transcripts are never copied

<!-- __END_WM_DECISION_CAPTURE_WM090__ -->

---

<!-- __START_WM_REANCHORING_WM100__ -->

## RE-ANCHORING WHEN CONTEXT DEGRADES

When context becomes unreliable:
- Do not reread chat
- Re-anchor from:
  - `PROJECT_STATE.md`
  - `WORKING_METHOD.md`
  - `DECISIONS.md`

Truth lives in the repo, not chat.

<!-- __END_WM_REANCHORING_WM100__ -->

---

<!-- __START_WM_PHASE_START_CHECKLIST_WM110__ -->

## NEW PHASE / NEW CHAT CHECKLIST (MANDATORY)

At the start of any new phase or chat:

1. Identify the current phase
2. Re-read:
   - `PROJECT_STATE.md`
   - `WORKING_METHOD.md`
   - `DECISIONS.md`
3. State:
   - what is frozen
   - what is allowed
   - the next single step

If skipped: **stop and reset**.

<!-- __END_WM_PHASE_START_CHECKLIST_WM110__ -->

---

<!-- __START_WM_PAUSE_IN_ACTION_WM120__ -->

## PAUSE IN ACTION PROTOCOL

Invoked by saying:

> **“Pause In Action”**

When invoked:
- Stop problem-solving
- Lock repo truth
- Prepare clean handoff to next chat
- Confirm GitHub is canonical

<!-- __END_WM_PAUSE_IN_ACTION_WM120__ -->

---

<!-- __START_WM_LONG_TERM_GOAL_WM130__ -->

## LONG-TERM GOAL

Capisco is the proving ground.

The true objective is a **reusable development method** that supports creativity without loss of control.

This document is as important as any code.

<!-- __END_WM_LONG_TERM_GOAL_WM130__ -->

<!-- __END_FILE_WM000__ -->