# Breakfast Slice – Vertical Slice Notes

## Purpose
Prove that Capisco can create real canonical cards from a short video
and compose them into a lesson using the Seasons renderer.

## Card Types Used
- Vocab cards (cloned from stagione.card.json)
- Sentence cards (cloned from come-stai.json)

## What Was Proven
- New card JSON files render without renderer changes
- Lesson composition is a manifest of cards
- Mixed vocab and sentence cards work together
- Schema is sufficient for A1 breakfast content

## What Was Explicitly Not Done
- No schema changes
- No automation scripts
- No image pipeline finalisation
- No quiz logic expansion
- No transcript parser

## Current Breakfast Cards
Vocab:
- colazione
- caffe
- cornetto
- biscotti

Sentences:
- che-cosa-mangi-a-colazione
- cosa-bevi-a-colazione
- fai-colazione-a-casa
- ti-piace-fare-colazione

## Next Safe Steps
- Define card-minting automation inputs
- Standardise image folder conventions
- Add one more video slice
