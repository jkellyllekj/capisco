# Card Completeness Minimums

Purpose: define the minimum quality bar for a card to be considered “complete enough” to ship in a lesson slice.
These rules apply without any schema changes. We only fill values in fields that already exist.

## Scope
- Applies to Seasons card JSON files in `ui/seasons-card/cards/`
- Card types:
  - Vocab cards (`type: "vocab"`)
  - Sentence cards (`kind: "sentence"` and `type: "sentence"`)

## Global Rules (all cards)
- JSON must validate and render in `ui/seasons-card/lesson-slice.html`
- Do not add, remove, or rename keys
- Do not change key order or structure
- Values may be edited only inside existing keys
- Examples must be simple, natural Italian and correct English

## Vocab Card Minimums (vocab schema)
Required fields must be present and non-empty:

### Headword and Forms
- `headword.it` non-empty
- `headword.en` non-empty
- `headword.partOfSpeech` non-empty
- `headword.gender` set if applicable (noun)
- `forms.canonical` non-empty
- `forms.singular` non-empty
- `forms.plural` non-empty (or same as singular if invariant)
- `forms.variants` may be empty

### Meaning
- `meaning.primary` non-empty
- `meaning.extended` has at least 1 sense string in the form `S1: ...`
- `meaning.usageNotes` non-empty (1 short sentence)

### Examples
- `examples` count is 3 to 6
- Each example has:
  - `it` non-empty
  - `en` non-empty
  - `source` set to `demo` or `transcript`
  - `difficulty` set (easy, medium, hard)

### Grammar
- `grammar.notes` non-empty (1 to 2 short sentences)
- `grammar.patterns` has at least 1 item
- `grammar.exceptions` may be empty

### Quiz Seeds
- `quizSeeds.recognition` exists (boolean)
- `quizSeeds.recall` exists (boolean)
- `quizSeeds.production` exists (boolean)
- `quizSeeds.distractors` count is 2 to 4

### Media
- `images.fallback` must exist
- `images.canonical` must exist (may point to a placeholder local path for now)

## Sentence Card Minimums (sentence schema)
Required fields must be present and non-empty:

### Headword and Forms
- `headword.target` non-empty
- `headword.native` non-empty
- `forms.canonical` non-empty
- `forms.variants` may be empty or include 1 to 3 variants

### Meaning
- `meaning.primary` non-empty
- `meaning.extended` has at least 1 sense string in the form `S1 — ...`
- `meaning.usageNotes` non-empty (1 short sentence)

### Examples
- `examples` count is 3 to 6
- Each example has:
  - `it` non-empty
  - `en` non-empty

### Grammar
- `grammar.notes` non-empty (1 to 2 short sentences)
- `grammar.patterns` has at least 1 item
- `grammar.exceptions` may be empty

### Media
- `media.fallback` must exist
- `media.canonical` must exist (may point to a placeholder local path for now)

### Quiz Seeds
- `quizSeeds.recognition` exists (boolean)
- `quizSeeds.recall` exists (boolean)
- `quizSeeds.production` exists (boolean)
- `quizSeeds.distractors` count is 2 to 4

## Not in Scope Yet
These are future features and are explicitly not required to mark a card “complete enough”:
- Full quiz engine behaviour and scoring
- Audio generation and pronunciation feedback
- Video timestamps and transcript alignment
- Image pipeline standardisation and derivatives
- Global linking across videos and lessons
- Arbitrary custom fields / extensions

## Next Step After This Doc Exists
- Retrofit the current breakfast cards to meet these minimums without schema changes.
