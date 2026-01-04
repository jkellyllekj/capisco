<!-- __START_FILE_WM000__ -->

# Capisco — Working Method  
## Structured Vibe Coding System

Last updated: 2026-01-04  
Status: **Authoritative**

---

<!-- __START_WM_PURPOSE__ -->

## PURPOSE

This document defines **how we work**, not what we build.

It exists to:
- preserve creative, intuitive (“vibe”) exploration
- eliminate the failure modes of *undisciplined* vibe coding
- ensure continuity across long-running projects
- make progress repeatable, calm, and deliberate

This is **vibe coding done correctly** — with structure, memory, and guardrails.

If there is any conflict between chat instructions and this file, **this file wins**.

<!-- __END_WM_PURPOSE__ -->

---

<!-- __START_WM_CORE_ENTITIES__ -->

## CORE ENTITIES (IMPORTANT DEFINITIONS)

To avoid confusion, the following terms are used precisely:

### Project
A **long-lived codebase and repository** (e.g. *Capisco*).

- Canonical truth lives in **GitHub**
- Governed by:
  - `PROJECT_STATE.md`
  - `DECISIONS.md`
  - `WORKING_METHOD.md`

### Phase
A **bounded unit of intent** (e.g. “Card Contract Lock”, “Media Invariants”).

- Has a name and purpose
- May span **multiple chat pages**
- Explicitly entered and exited
- Progress is recorded in `PROJECT_STATE.md`
- Durable constraints may be logged in `DECISIONS.md`

### Chat Page
A **single ChatGPT conversation**.

- Has limited working memory
- May degrade as it grows long or complex
- Is **disposable by design**
- Never treated as a source of truth

**Rule:**  
When a chat page becomes slow, overloaded, or confused, it must be ended deliberately — not pushed through.

<!-- __END_WM_CORE_ENTITIES__ -->

---

<!-- __START_WM_PHASE_DISCIPLINE__ -->

## PHASE DISCIPLINE

Work is divided into explicit phases.

Each phase has:
- a name
- a purpose
- allowed actions
- non-goals

Rules:
- Phase changes must be **explicitly declared**
- Work outside the declared phase is invalid
- A phase may span multiple chat pages

<!-- __END_WM_PHASE_DISCIPLINE__ -->

---

<!-- __START_WM_ONE_STEP_RULE__ -->

## ONE-STEP RULE (CRITICAL)

Rule:  
**We do one step at a time.**

- One file **OR**
- One block **OR**
- One decision

Never more than one.

Disallowed:
- multi-step instructions
- “while you’re at it”
- bundled future work

If a response contains multiple steps, it is **invalid**.

This rule preserves flow and prevents loss of control.

<!-- __END_WM_ONE_STEP_RULE__ -->

---

<!-- __START_WM_BLOCK_TAG_SYSTEM__ -->

## BLOCK-TAG EDITING SYSTEM

All editable files must use **block tags** so changes are:
- searchable
- replaceable
- safe
- reviewable

### Rules
- Edits are **full block replacements only**
- Reference **inner block names only**
- No line edits

### Tag formats
- HTML / Markdown: `<!-- __START__ -->`
- CSS: `/* __START__ */`
- JavaScript: `/* __START__ */`
- JSON:
  - no block tags
  - no comments
  - must remain valid JSON

This document intentionally follows its own rules.

<!-- __END_WM_BLOCK_TAG_SYSTEM__ -->

---

<!-- __START_WM_CONTRACTS__ -->

## CONTRACTS BEFORE FEATURES

- Core objects (e.g. the Card) require a **written contract**
- Rendering invariants come before layout polish
- Feature ideas are parked unless they update a contract first

This keeps creative exploration grounded in durable structure.

<!-- __END_WM_CONTRACTS__ -->

---

<!-- __START_WM_DECISION_CAPTURE__ -->

## DECISION CAPTURE

- Durable decisions are logged in `DECISIONS.md`
- Decisions are:
  - dated
  - concise
  - constraint-oriented
- Chat transcripts are **never** copied
- Only decisions that still matter are recorded

<!-- __END_WM_DECISION_CAPTURE__ -->

---

<!-- __START_WM_REANCHORING__ -->

## RE-ANCHORING WHEN CONTEXT DEGRADES

Rule:  
When conversational context becomes unreliable, **do not attempt recovery by rereading chat history**.

Instead, deliberately re-anchor using repo truth:
- `PROJECT_STATE.md`
- `WORKING_METHOD.md`
- `DECISIONS.md`
- relevant contracts (e.g. `card-contract.md`)

Implications:
- Truth lives in the repo, not in chat
- Long chats may be abandoned
- Re-anchoring is intentional, not a failure

<!-- __END_WM_REANCHORING__ -->

---

<!-- __START_WM_PHASE_START_CHECKLIST__ -->

## NEW PHASE / NEW CHAT START CHECKLIST (MANDATORY)

At the start of any **new phase or new chat page**:

1. Identify the current phase
2. Re-read:
   - `PROJECT_STATE.md`
   - `WORKING_METHOD.md`
   - `DECISIONS.md`
3. State explicitly:
   - what is frozen
   - what is allowed
   - what the next single step is

If this checklist is skipped, **stop and reset**.

<!-- __END_WM_PHASE_START_CHECKLIST__ -->

---

<!-- __START_WM_PAUSE_IN_ACTION__ -->

## PAUSE IN ACTION PROTOCOL (CHAT / PHASE HANDOFF)

**Pause In Action** is a deliberate checkpoint used to:
- prevent context degradation
- preserve correct project memory
- prepare for a clean new chat page
- ensure GitHub is the canonical backup

It is invoked by saying:

> **“Pause In Action”**

When invoked, the assistant must stop problem-solving and switch to handoff mode.

### Triggered actions (mandatory)

1. **MD File Review**
   - Identify which files may need updates:
     - `PROJECT_STATE.md`
     - `DECISIONS.md`
     - `WORKING_METHOD.md`
     - `RETROSPECTIVE-CANDIDATES.md`
   - Ask which files need to be re-uploaded
   - Remove or correct anything no longer true

2. **State Lock-In**
   - Confirm:
     - current phase
     - what is resolved
     - what is frozen
     - what remains open
   - Ensure `PROJECT_STATE.md` reflects reality

3. **Decision Capture**
   - Promote durable constraints to `DECISIONS.md`
   - No chat transcripts

4. **GitHub Backup Check**
   - Explicitly ask whether all changes are committed and pushed
   - GitHub is canonical; chat is disposable

5. **Next-Chat Preparation**
   - Propose:
     - next chat title
     - whether it continues the phase or starts a new one
   - Generate a **handoff prompt** for the next chat

6. **Re-Upload Guidance**
   - State clearly which MD files must be uploaded in the next chat
   - Default: all three (`PROJECT_STATE`, `WORKING_METHOD`, `DECISIONS`)

### Intentional reset rule
After Pause In Action:
- The current chat page may be abandoned
- No attempt is made to preserve chat memory
- Truth is recovered only from repo files

This is controlled continuity, not failure.

<!-- __END_WM_PAUSE_IN_ACTION__ -->

---

<!-- __START_WM_LONG_TERM_GOAL__ -->

## LONG-TERM GOAL

Capisco is the proving ground.

The real objective is to build a:
- reusable development method
- transferable across projects
- compatible with creative exploration
- without losing coherence, memory, or control

This document is as important as any code.

<!-- __END_WM_LONG_TERM_GOAL__ -->

<!-- __END_FILE_WM000__ -->
