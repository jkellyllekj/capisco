<!-- __START_D_RENDERER_PRECEDENCE_D020__ -->

## RENDERER PRECEDENCE RULES (LOCKED)

The renderer must apply the following precedence rules consistently.

### Data vs Placeholder
- Structured data always wins over placeholder text
  - `grammar` overrides `placeholders.grammar`
  - `quizSeeds` overrides `placeholders.quiz`
- Placeholders are fallback only when no structured data exists

### Media Selection
- Preferred order:
  1. `images.canonical[0]`
  2. `media.canonical`
  3. `media.fallback`
- Legacy icon rendering is disabled and must not reappear

### Media Presentation
- Canonical images must be shown as full images, not cut offs
- Default renderer behavior must avoid cropping canonical images

Image creation guidance for later phases:
- Generate a landscape primary image and a portrait secondary image
- Both images must match subject, clothing, person, theme, and setting
- They should be two beautiful, unique versions of the same scene

### Sentence Card Presentation Rules
- Sentence cards are first class and must not look empty compared to vocab cards
- For sentence cards, Overview must be adapted:
  - Phrase row shown
  - Plural row hidden
  - Examples are surfaced on Overview
  - Notes are surfaced on Overview when available
- Tabs remain available, Overview is a summary not a replacement

### Tag Pill Mapping Rules
- Vocab cards may use object style `tags`
- Sentence cards often use:
  - `level` as the Level pill
  - `lemmaId` as the Id pill
  - first item of `tags[]` as the Category pill
- The renderer must not crash if `tags` is null, missing, or an array

### Visibility Rules
- Tabs with no meaningful content must be hidden per card
  - Grammar tab hidden if no grammar data and no placeholder
  - Quiz tab hidden if no quiz seeds and no placeholder
- Empty state text must never mask real data

These rules are intentional and not subject to aesthetic preference.

<!-- __END_D_RENDERER_PRECEDENCE_D020__ -->
