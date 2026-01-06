<!-- __START_FILE_D000__ -->

# Capisco — Decisions  
Status: **Authoritative (Durable Constraints & Precedence Rules)**  
Last updated: 2026-01-06

---

<!--
============================================================================
BLOCK INDEX
D010 — PURPOSE
D020 — RENDERER_PRECEDENCE_RULES
D030 — DEMO_ROLE
D040 — ENVIRONMENT_CONSTRAINTS
============================================================================
-->

<!-- __START_D_PURPOSE_D010__ -->

## PURPOSE

This document records **durable decisions** that must persist across phases.

It answers:
- What rules are *intentional* and must not be re-debated
- What precedence logic the renderer must follow
- What constraints are environmental, not design mistakes

If there is any conflict:
- `PROJECT_STATE.md` defines **what is active**
- `DECISIONS.md` defines **what must remain true**
- Chat output is never authoritative

<!-- __END_D_PURPOSE_D010__ -->

---

<!-- __START_D_RENDERER_PRECEDENCE_D020__ -->

## RENDERER PRECEDENCE RULES (LOCKED)

The renderer must apply the following precedence rules consistently.

### Data vs Placeholder
- **Structured data always wins** over placeholder text
  - `grammar` overrides `placeholders.grammar`
  - `quizSeeds` overrides `placeholders.quiz`
- Placeholders are fallback only when no structured data exists

### Media Selection
- Preferred order:
  1. `images.canonical[0]`
  2. `media.canonical`
  3. `media.fallback`
- Legacy icon rendering is disabled and must not reappear

### Visibility Rules
- Tabs with no meaningful content **must be hidden per card**
  - Grammar tab hidden if no grammar data and no placeholder
  - Quiz tab hidden if no quiz seeds and no placeholder
- Empty-state text must never mask real data

These rules are intentional and not subject to aesthetic preference.

<!-- __END_D_RENDERER_PRECEDENCE_D020__ -->

---

<!-- __START_D_DEMO_ROLE_D030__ -->

## DEMO ROLE (LOCKED)

- `ui/seasons-card/demo.html` is a **renderer test harness**
- It may:
  - Load multiple cards
  - Duplicate cards
  - Change layout to expose renderer behavior
- It does **not** represent final UX or learning flow

Demo behavior must prioritise:
- Observability
- Debuggability
- Renderer validation

<!-- __END_D_DEMO_ROLE_D030__ -->

---

<!-- __START_D_ENVIRONMENT_CONSTRAINTS_D040__ -->

## ENVIRONMENT CONSTRAINTS (LOCKED)

- Replit shell is not a reliable source of truth for:
  - `git`
  - `git grep`
  - `tree`
- File discovery must rely on:
  - Editor search
  - Explicit file lists in `PROJECT_STATE.md`

This is an environmental limitation, not a tooling mistake.

<!-- __END_D_ENVIRONMENT_CONSTRAINTS_D040__ -->

<!-- __END_FILE_D000__ -->
