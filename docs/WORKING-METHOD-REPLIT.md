# Working Method: Gemini & Replit Agent Edition
Last updated: 2026-02-12
Status: **Authoritative - Code Integrity & Structured Vibe Edition**

============================================================================
PERMANENT CODE INTEGRITY PROTOCOL
This protocol is the primary guardrail for all project development:

1. Holistic Awareness: Gemini (The Architect) must maintain constant awareness of all project code and logic across all master files.
2. Unabridged Updates: When updating Master Documents (e.g., project-state.md, WORKING-METHOD-REPLIT.md, index.js, styles.css), Gemini must provide the entire, unabridged file. Pruning, truncating, or using placeholders (e.g., "// ... rest of code") is strictly prohibited.
3. Preservation of Progress: Neither Gemini nor the Agent may erase, truncate, or lose any existing progress, long-term roadmap items, or established logic.
4. Logical Authority: Gemini provides the logic; the Agent is the execution arm. Do not delegate logical thinking or architectural decisions to the Agent.
============================================================================

## PURPOSE (WM010)
This document defines **how we work**, not what we build. It exists to preserve creative ("vibe") exploration while eliminating the failure modes of undisciplined coding. If there is any conflict between chat instructions and this file, **this file wins**.

## CORE ENTITIES (WM020)
### Project
A long-lived codebase (Capisco). Canonical truth lives in GitHub.
### Phase
A bounded unit of intent. Progress recorded in PROJECT_STATE_CAPISCO.md.
### Chat Page
A single conversation. Disposable by design. Never treated as a source of truth.

## PHASE DISCIPLINE (WM030)
Work is divided into explicit phases. Phase changes must be explicitly declared. Work outside the active phase is invalid.

## PROGRESSIVE STEP RULE (WM040)
Default mode: **Bounded Batch Execution**. Max 3–4 concrete, sequential steps per response. If confusion arises, revert to single-step mode or invoke Pause In Action.

## DOCUMENTATION PARITY RULE (WM050)
**Documentation is treated as code.** All edits are **full block replacements only**. Partial, line-level edits are forbidden.

## BLOCK-TAG EDITING SYSTEM (WM060)
All editable files must be divided into explicit blocks using `` and ``. Only entire blocks may be replaced. 
### Block size split rule:
If a block grows too large to reason about safely, it must be split into sub-blocks before any further changes are made.

## NUMERIC BLOCK ID RULE (WM070)
All block tags must include a stable numeric identifier (e.g., WM010). Numbers never change once assigned.

## CONTRACTS BEFORE FEATURES (WM080)
Core objects require written contracts. Invariants come before polish. Feature ideas are parked until a contract changes.

## DECISION CAPTURE (WM090)
Durable constraints go in `DECISIONS.md`. Decisions are concise and dated.

## RE-ANCHORING (WM100)
When context becomes unreliable, do not reread chat. Re-anchor from PROJECT_STATE.md and WORKING_METHOD.md.

## NEW PHASE / NEW CHAT CHECKLIST (WM110)
At the start of any new phase or chat:
1. Identify current phase.
2. Re-read State, Method, and Decisions.
3. State what is frozen, what is allowed, and the next actionable work.

## ACTIVE FILES DISCIPLINE (WM115)
Every active phase must maintain a small "Active Files" list inside PROJECT_STATE.md to eliminate "which file is doing what?" searches.

## PAUSE IN ACTION PROTOCOL (WM120)
Invoked by saying “Pause In Action”. 
1. Stop problem solving.
2. Lock repo truth.
3. Prepare clean Handover Message and Next Agent Prompt.

## LONG-TERM GOAL (WM130)
Capisco is the proving ground. The real product is a repeatable creative development method that does not collapse under scale.

## ENVIRONMENT REALITY CHECK (WM140)
Tool availability must never be assumed. Switch methods and document constraints if tooling is missing.

## DISCOVERY AND SEARCH RULES (WM150)
Do not guess file locations. Use editor-native search. **Block-name certainty requirement:** Assistant may only instruct a block replacement if it can name the exact block tag with confidence.

## SPEC VS STATE RULE (WM160)
Specs win for semantics; PROJECT_STATE wins for navigation and active intent.

## CHAT HANDOVER ARTIFACT (WM170)
Every Pause In Action must produce a canonical Next Chat Handover Message.

## CONTEXT SATURATION AWARENESS (WM180)
Assistant must explicitly warn when saturation (UI lag, loss of precision) is likely. Proactive resets are normalized.

## ASSISTANT SELF-ENFORCEMENT (WM190)
The assistant is **obligated** to actively enforce this Working Method on itself. Momentum or convenience are not valid reasons to bypass any rule.

============================================================================
AGENT COST CONTROL AND SCOPE LOCK
============================================================================
- **Execution Only:** The Agent does not own planning or refactoring.
- **Hard Scope:** Agent may only edit files and blocks explicitly listed.
- **Budget:** Default budget is 2 minutes. If exceeded, stop and report.
- **Testing:** Agent must not claim success without running the app or tests.
- **Instruction Format:** Must use START/FINISH MESSAGE TO AGENT blocks.
- **Session Start:** Agent must wait for instructions, execute only what is requested, and add no commentary.
- **Change Size:** Agent works in bounded micro-changes. One commit per instruction unless directed otherwise.
- **Safety Rails:** Agent never deletes large folders or framework structures without explicit permission.

## Lexicon Specific Rules (Capisco Phase 16C)
- **Concept ID Priority:** Map assets to Universal Concept IDs, not words.
- **The 4-Image Standard:** All cards require Portrait, Landscape, Square, and Drawn prompt DNA.
- **Universal Human Invariant:** All image prompts must specify non-descript, representative people to ensure demographic neutrality and global applicability.