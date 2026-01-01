<!-- __START__ -->

<!-- CONTRACT_META_M010 -->
# Capisco Card Contract (Phase 7)

Contract Version: 0.2  
Last updated: 2026-01-01

This contract defines the **minimum stable surface** for a Capisco Card as a portable knowledge object.

**Hard rule:** renderers must ignore what they don’t understand.
<!-- CONTRACT_META_M010 -->

---

<!-- CONTRACT_DEFINITION_D020 -->
## 1) Definition

A **Card** is a canonical, portable knowledge object that must survive:
- multiple layouts (web/mobile/print)
- empty and partial data
- quiz mode, chat mode, read-only mode
- future apps beyond Capisco

The card is **not** “a demo artifact”. The card is the product object.
<!-- CONTRACT_DEFINITION_D020 -->

---

<!-- CONTRACT_LAYERS_L030 -->
## 2) Data Layers (do not mix)

### 2.1 Canonical Card (curated, versioned)
Global source of truth. Changes are reviewed and create new canonical versions.

### 2.2 User Overlay (personal, per-user)
Notes, mnemonics (incl. memory palace/peg systems), preferred images, personal links.
Never mutates canonical data.

### 2.3 Extensions (namespaced “private tags”)
Future-proof metadata (video IDs, external dictionary IDs, corpora refs, accents, etc.).
Namespaced + optional.
<!-- CONTRACT_LAYERS_L030 -->

---

<!-- CONTRACT_CORE_FIELDS_C100 -->
## 3) Core Fields (Required)

These must exist for every card.

### 3.1 Identity
- `id` (string, globally unique, stable)
- `kind` (string: `vocab` | `expression` | `grammar` | …)
- `version` (number/string; monotonic per `id`)

### 3.2 Languages
- `lang.target` (BCP-47, e.g. `it-IT`)
- `lang.native` (BCP-47, e.g. `en-GB`)

### 3.3 Display Core
- `headword.target` (string)
- `headword.native` (string)

### 3.4 Minimum Metadata (may be empty)
- `level` (string, may be `""`)
- `tags` (array of strings, may be `[]`)
<!-- CONTRACT_CORE_FIELDS_C100 -->

---

<!-- CONTRACT_SENSE_MODEL_S160 -->
## 4) Meaning Model (Locked)

### 4.1 Card = Sense (recommended + supported)
To support multiple meanings, images, and precise cross-language links:

- `lemmaId` (string; groups sibling senses)
- `sense` (object)
  - `sense.id` or `sense.number` (stable within lemma)
  - `sense.gloss` (short label for the meaning)

**Rule:** new meanings are new sense cards (or new sense entries) — do not overload one sense.
<!-- CONTRACT_SENSE_MODEL_S160 -->

---

<!-- CONTRACT_OPTIONAL_FIELDS_O200 -->
## 5) Optional Fields (Renderer must tolerate missing)

- `grammar` (object)
- `forms` (array)
- `etymology` (string)
- `synonyms` / `antonyms` (arrays)
- `examples` (array of `{ target, native? }`)
- `audio` (array; language-tagged)
- `quizSeed` (object; ingredients only, not per-user instances)
<!-- CONTRACT_OPTIONAL_FIELDS_O200 -->

---

<!-- CONTRACT_MEDIA_M240 -->
## 6) Media Contract (Locked)

- `media.fallback` (descriptor; allowed always)
- `media.canonical` (array, may be `[]`)

Each canonical item:
- `mediaId` (stable id)
- `kind` (`local` | `url` | `generated` | …)
- `src` (pointer)

**Invariant:** a renderer must always show a bounded media slot
(using canonical media OR fallback OR placeholder).
<!-- CONTRACT_MEDIA_M240 -->

---

<!-- CONTRACT_LINKS_K280 -->
## 7) Links (Graph)

- `links` (array, may be `[]`)
  - each link: `{ type, targetCardId, note? }`

New link `type`s are allowed over time.
Renderers must ignore unknown link types.
<!-- CONTRACT_LINKS_K280 -->

---

<!-- CONTRACT_EXTENSIONS_X320 -->
## 8) Extensions (Namespaced)

- `ext` (object, optional)
  - keys are namespaces (e.g. `wikidata`, `video`, `corpus`, `accent`, `futureApp`)
  - values are objects (typed by namespace owner)

Unknown namespaces must be ignored by renderers.
<!-- CONTRACT_EXTENSIONS_X320 -->

---

<!-- CONTRACT_OVERLAY_Y360 -->
## 9) User Overlay (Per-user, not canonical)

Stored separately from canonical cards (recommended).
If present with a card payload, it must be optional and ignorable by renderers.

Examples:
- `overlay.notes`
- `overlay.mnemonics.*` (memory palace, peg system, etc.)
- `overlay.customMedia`
- `overlay.privateLinks`

Overlay must never mutate canonical data.
<!-- CONTRACT_OVERLAY_Y360 -->

---

<!-- CONTRACT_SUGGESTIONS_R380 -->
## 10) Suggestions & Review (Locked)

Canonical edits are not direct mutations. They are proposed as **Suggestions**:
- `suggestion.id`
- `targetCardId`
- `diff` (proposed changes)
- `reason`
- `status` (pending/accepted/rejected)
- `reviewLog[]`

Accepted suggestions produce a **new canonical card version**.
<!-- CONTRACT_SUGGESTIONS_R380 -->

---

<!-- CONTRACT_STATES_T400 -->
## 11) Supported Renderer States (Must not break)

### Content states
- full data
- partial data (any optional section missing)
- empty tab content (tab exists but no data)
- no media (fallback only)
- no audio

### Modes
- read-only
- quiz mode
- chat mode
- print/export mode
<!-- CONTRACT_STATES_T400 -->

---

<!-- CONTRACT_INVARIANTS_I500 -->
## 12) Rendering Invariants (Must never break)

1. Rendering must never throw for any supported state.
2. Missing optional fields must not collapse layout unexpectedly.
3. Tabs must not break when empty; show placeholder or stable empty state.

### Media (Phase 7 technical task)
4. Media must never overflow or escape its bounds.
5. Rounded corners + clipping apply to the **media slot**, not the raw image.
6. Empty/partial states must keep identical containment rules.
<!-- CONTRACT_INVARIANTS_I500 -->

---

<!-- CONTRACT_CHECKLIST_C900 -->
## 13) Checklist (Gate changes)

- [ ] `id`, `kind`, `version` present
- [ ] `lang.target`, `lang.native` present
- [ ] `headword.target`, `headword.native` present
- [ ] bounded media slot always exists
- [ ] media never overflows in any tab/mode
- [ ] renderer ignores unknown `ext.*` and unknown link types
- [ ] read-only/quiz/chat/print modes do not break rendering
<!-- CONTRACT_CHECKLIST_C900 -->

<!-- __END__ -->
