# Seasons Card UI (Vanilla Port)

Purpose: Port the Seasons card UI from capisco-seasons-test into capisco as a self-contained vanilla module.

Status: NOT wired into the app yet. Reference-only.

## Assets
- CSS: /style-seasons-card.css
- Reference markup (frozen contract): /docs/seasons-card-markup.html
- Module-local markup (for wiring): /ui/seasons-card/markup-stagione.html

## Next wiring steps (later commits)
1) Create a render function that clones markup into the page
2) Add tab switching logic scoped to a card element
3) Add hover/tap TTS logic for [data-say] elements
4) Only then import CSS into the live page
