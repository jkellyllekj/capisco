<!-- __START__ -->

# Capisco — Decision Log

Purpose: capture decisions that constrain future work.
Rule: short, dated, and only decisions that still matter.

---

## 2026-01-01 — Phase 7 “Line in the sand”
**Decision:** Treat Phase 7 as the start of contract-first product development.  
**Why:** Avoid relying on long chat history; keep truth in-repo; reduce drift.  
**Implications:** PROJECT_STATE + CONTRACT + DECISIONS become canonical references.

---

## 2026-01-01 — Card is the product object
**Decision:** The Capisco Card is the canonical product object, not a demo artifact.  
**Why:** Must survive multiple layouts, empty/partial states, quizzes/chat/print/mobile, and future apps.  
**Implications:** UI changes must not redefine the card; contracts govern internals.

---

## 2026-01-01 — Marker blocks workflow (code editing)
**Decision:** Use marker blocks for edits: **full block replacements only**; reference **inner block names only**.  
**Why:** Reliable targeting; prevents fragile line edits; faster collaboration without “mystery code”.  
**Implications:** If a file lacks markers, first action is one-time full-file replacement to add them; afterwards edit blocks only.

---

## 2026-01-01 — JSON files are data only
**Decision:** JSON files must contain valid JSON only (no HTML/MD comments, no marker blocks).  
**Why:** JSON is parsed by code; comments/markers break parsing (observed in demo error).  
**Implications:** Use JSON-safe structure (keys) if needed; keep markers to HTML/CSS/JS/MD only.

---

## 2026-01-01 — Card Contract locked
**Decision:** Card Contract is defined in `docs/card-contract.md` and is authoritative.  
**Why:** Stabilises required fields, supported states, rendering invariants, and extensibility model.  
**Implications:** Feature work must update contract first or be treated as out-of-scope.

---

## 2026-01-01 — Phase 7 first technical invariant
**Decision:** First technical task is to guarantee **media never overflows** in any tab state, including empty tabs.  
**Why:** Rendering invariants come before new features/polish.  
**Implications:** Implement via a single winning CSS/JS marker-block change after locating the source-of-truth styles.

---

## 2026-01-01 — One step at a time (workflow constraint)
**Decision:** We work in **single-step increments**: one change per step, one file/block at a time.  
**Why:** Prevent overload, reduce errors, and avoid “losing the thread”.  
**Implications:** No multi-step instructions. Each message delivers exactly one actionable change.

---

## 2026-01-01 — Block-tag convention (edit targeting)
**Decision:** Use block tags in code/docs so edits are **full block replacements only** and referenced by **inner block name**.  
**Why:** Makes edits fast, searchable, and safe; avoids fragile line edits.  
**Implications:**
- HTML/MD: `<!-- __START_NAME__ --> ... <!-- __END_NAME__ -->`
- CSS: `/* __START_NAME__ */ ... /* __END_NAME__ */`
- Python: `# __START_NAME__` ... `# __END_NAME__`
- JSON: **no markers** (valid JSON only)


<!-- __END__ -->
