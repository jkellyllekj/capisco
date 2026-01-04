# Card Content Multiplicity Spec (Authoritative)
Phase: 15 — Card Content Expansion & Multiplicity  
Status: Draft (data / contract only)  
Last updated: 2026-01-04

<!--
============================================================================
BLOCK INDEX
S010 — SPEC_META
S020 — PURPOSE
S030 — CARDINALITY_TABLE
S040 — GLOBAL_RULES
S050 — SENSE_MODEL
S060 — EXAMPLES_MODEL
S070 — FORMS_MODEL
S080 — RELATIONS_MODEL
S090 — CANONICAL_VS_OPTIONAL
S100 — STABILITY_FORWARD_COMPAT
S110 — NON_GOALS
============================================================================
-->

__START_SPEC_META_S010__
## Spec status
This spec is authoritative for **card content multiplicity** (data/contract only).
Implementation details are explicitly out of scope.
__END_SPEC_META_S010__

---

__START_PURPOSE_S020__
## Purpose

This document defines the **authoritative content model** for Capisco cards,
with explicit support for **multiplicity** (multiple senses, examples, forms,
relations, media, etc.).

It answers:
- What fields exist
- Which fields are singular vs repeatable
- How repeated items are ordered and identified
- What is required for a card to be considered valid

This spec is **data-first** and **implementation-agnostic**.
__END_PURPOSE_S020__

---

__START_CARDINALITY_TABLE_S030__
## Cardinality Table (Single Source of Truth)

| Field | Cardinality | Notes |
|------|------------|------|
| `card_id` | 1 | Stable identifier |
| `language` | 1 | ISO language code (e.g. `it`) |
| `lemma` | 1 | Canonical surface form |
| `part_of_speech` | 1 | Enum |
| `gender` | 0..1 | Language-dependent |
| `senses[]` | **1..N** | Ordered, stable |
| `examples[]` | 0..N | Global examples |
| `forms[]` | 0..N | Inflections / variants |
| `relations[]` | 0..N | Synonyms, antonyms, etc |
| `media[]` | 0..N | Governed by Media Model |
| `etymology` | 0..1 | Structured text |
| `registers[]` | 0..N | Formal / informal / slang |
| `domains[]` | 0..N | Topic / semantic tags |
| `quiz_seeds[]` | 0..N | Governed by Quiz contract |
__END_CARDINALITY_TABLE_S030__

---

__START_GLOBAL_RULES_S040__
## Global Rules

- A card **MUST** have at least one sense.
- Order is meaningful wherever arrays are used unless explicitly stated.
- All repeated items **MUST** support stable IDs.
- Cards are treated as immutable semantic objects at the product level. How updates/versioning are represented is out of scope for Phase 15 and must not be assumed by this spec.
__END_GLOBAL_RULES_S040__

---

__START_SENSE_MODEL_S050__
## Sense Model (Core Unit)

Each card contains **one or more senses**.

A sense represents a **distinct meaning**, not merely a usage variation.

### Sense fields

Each sense MAY contain:
- `sense_id` (required)
- `definition` (required)
- `gloss` (optional, short)
- `usage_notes` (optional)
- `examples[]` (0..N, sense-local)
- `registers[]` (0..N, overrides global)
- `domains[]` (0..N, overrides global)
- `relations[]` (0..N, sense-local)

### Sense rules
- `sense_id` MUST be stable and never reused.
- Senses are ordered by pedagogical priority.
- Removing a sense invalidates dependent references.
__END_SENSE_MODEL_S050__

---

__START_EXAMPLES_MODEL_S060__
## Examples Model

Examples may exist in two scopes:
1. **Global examples** (`examples[]`)
2. **Sense-local examples** (`sense.examples[]`)

### Rules
- Examples MAY reference a `sense_id`.
- Examples without a `sense_id` are considered global.
- Each example MUST have a stable `example_id`.
__END_EXAMPLES_MODEL_S060__

---

__START_FORMS_MODEL_S070__
## Forms Model

Forms represent morphological or orthographic variants.

Examples:
- plural forms
- conjugations
- alternative spellings

Rules:
- Forms are optional.
- Forms MUST NOT redefine meaning.
- Forms MAY reference a `sense_id` if meaning differs by form.
__END_FORMS_MODEL_S070__

---

__START_RELATIONS_MODEL_S080__
## Relations Model

Relations link this card to other cards or concepts.

Examples:
- synonym
- antonym
- hypernym
- derived-from

Rules:
- Relations MAY be global or sense-specific.
- Relations MUST declare their type.
- Relations MUST reference stable external IDs.
__END_RELATIONS_MODEL_S080__

---

__START_CANONICAL_VS_OPTIONAL_S090__
## Canonical vs Optional Content

### Required for a valid card
- `card_id`
- `language`
- `lemma`
- `part_of_speech`
- at least one `sense` with a definition

### Optional enrichment
- examples
- forms
- relations
- media
- etymology
- registers / domains

Cards must render correctly from **minimal** to **fully populated** states.
__END_CANONICAL_VS_OPTIONAL_S090__

---

__START_STABILITY_FORWARD_COMPAT_S100__
## Stability & Forward Compatibility

- New optional fields MAY be added in future phases.
- Required fields MUST NOT change semantics.
- Existing cards MUST remain valid under future extensions.
__END_STABILITY_FORWARD_COMPAT_S100__

---

__START_NON_GOALS_S110__
## Non-goals

This spec does NOT:
- Define rendering or UI behavior
- Define storage or database schema
- Define quiz generation logic
- Permit breaking existing contracts
- Replace the Media or Quiz specs

Those concerns are governed elsewhere.
__END_NON_GOALS_S110__

---

End of spec.
