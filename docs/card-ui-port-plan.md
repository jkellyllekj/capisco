# Capisco — Seasons Card UI Port Plan

## Goal
Port the seasons-test Card UI (tabs + hover/tap audio + images)
into capisco slowly, deliberately, and with minimal surface area.
No refactors. One change per commit.

## Source of truth
- Canonical: capisco
- Reference: capisco-seasons-test (Node prototype)
- Secondary: Capisco-New (layout experiments)

---

## Phase 0 — Inventory (no runtime changes)

### 0.1 Component entrypoint in seasons-test
In seasons-test, the “card UI” is not a React component yet.
It is a Node HTTP server that serves a single HTML page from a template string:

- index.js (Node http.createServer)
  - HTML template string containing:
    - `<style>` — all CSS
    - `<main>` — all card markup
    - `<script>` — tabs + hover/tap TTS logic

### 0.2 Logical sub-components (to become React components)
Proposed breakdown (names are for the port only):

- CardPage (page wrapper + list of word groups)
- WordGroup (title + emoji + card)
- CardShell
  - CardHeader
    - TitleLine (it/en + gender, speakable spans)
    - TagRow (level/id/category pills)
    - IconCircle (emoji)
  - CardTabs
  - CardBody
    - TabSection (Overview / Examples / Grammar / Related / Quiz)

### 0.3 Interaction modules (to become hooks/utils)

- useSpeakOnHoverTap
  - Attaches hover + tap handlers to speakable elements
  - Uses Web Speech API (`speechSynthesis`)
  - Supports voice preference lists (EN-GB, IT-IT)
  - Applies `.is-speaking` visual state

- useCardTabs
  - Manages per-card active tab
  - Shows/hides tab sections within a card only

### 0.4 Data contract (current prototype)
Current prototype hardcodes cards with:

- itText, enText, gender
- level, id, category
- icon (emoji)
- overview:
  - singular
  - plural
  - pronunciation (+ optional IPA)
  - etymology (optional)
- examples:
  - Italian sentence
  - English sentence
- related:
  - list of (itText + emoji)
- grammar, quiz:
  - placeholder content

### 0.5 Rendering assumptions
- Browser supports Web Speech API
- Hover for desktop, click for mobile
- No external CSS framework
- All layout controlled via class-based CSS
