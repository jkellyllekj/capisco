#!/usr/bin/env python3
"""
Capisco Card Generator — Batch extraction from transcripts.

Reads a transcript file, uses OpenAI to identify vocabulary and expressions,
then generates card JSON files following the Phase 16B schema.

Usage:
    python scripts/generate_cards.py                          # Generate cards
    python scripts/generate_cards.py --review                 # Review existing cards
    python scripts/generate_cards.py --transcript PATH        # Use a different transcript
    python scripts/generate_cards.py --output-dir DIR         # Use a different output dir

# the newest OpenAI model is "gpt-5" which was released August 7, 2025.
# do not change this unless explicitly requested by the user
"""

import json
import os
import sys
import re
import argparse

from openai import OpenAI

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

DEFAULT_TRANSCRIPT = "transcripts/it-super-easy-001-breakfast.txt"
DEFAULT_OUTPUT_DIR = "cards/it-super-easy-001"

VOCAB_SCHEMA_TEMPLATE = {
    "id": "",
    "type": "vocab",
    "language": "it",
    "conceptId": "",
    "legacyIcon": "",
    "headword": {
        "it": "",
        "en": "",
        "partOfSpeech": "",
        "gender": "",
        "register": "neutral"
    },
    "forms": {
        "canonical": "",
        "singular": "",
        "plural": "",
        "variants": []
    },
    "pronunciation": {
        "readable": "",
        "ipa": "",
        "audio": {"it": None, "en": None}
    },
    "meaning": {
        "primary": "",
        "extended": [],
        "usageNotes": ""
    },
    "examples": [],
    "grammar": {
        "notes": "",
        "patterns": [],
        "exceptions": []
    },
    "etymology": {
        "origin": "",
        "evolution": "",
        "mnemonic": ""
    },
    "relations": {
        "lemma": [],
        "forms": [],
        "synonyms": [],
        "antonyms": [],
        "collocations": [],
        "expressions": [],
        "grammar": [],
        "themes": [],
        "related": [],
        "phonetic": [],
        "contrasts": [],
        "semantic": []
    },
    "images": {
        "fallback": {
            "type": "auto",
            "prompt": "",
            "style": "photorealistic"
        },
        "canonical": []
    },
    "quizSeeds": {
        "recognition": True,
        "recall": True,
        "production": True,
        "distractors": []
    },
    "placeholders": {
        "grammar": "",
        "quiz": ""
    },
    "metadata": {
        "difficulty": "",
        "tags": ["Breakfast"],
        "rankId": "#0000"
    }
}

EXPRESSION_SCHEMA_TEMPLATE = {
    "id": "",
    "kind": "sentence",
    "version": 1,
    "lang": {"target": "it-IT", "native": "en-GB"},
    "headword": {
        "target": "",
        "native": ""
    },
    "level": "",
    "tags": [],
    "lemmaId": "",
    "sense": {
        "id": "1",
        "gloss": ""
    },
    "type": "sentence",
    "language": "it",
    "forms": {
        "canonical": "",
        "variants": []
    },
    "pronunciation": {
        "readable": "",
        "ipa": ""
    },
    "meaning": {
        "primary": "",
        "extended": [],
        "usageNotes": ""
    },
    "examples": [],
    "grammar": {
        "notes": "",
        "patterns": [],
        "exceptions": []
    },
    "etymology": {
        "origin": "",
        "evolution": "",
        "mnemonic": ""
    },
    "relations": {
        "related": [],
        "forms": [],
        "synonyms": [],
        "antonyms": [],
        "collocations": [],
        "expressions": [],
        "themes": [],
        "semantic": []
    },
    "media": {
        "fallback": {
            "type": "auto",
            "prompt": "",
            "style": "photorealistic"
        },
        "canonical": []
    },
    "quizSeeds": {
        "recognition": True,
        "recall": True,
        "production": True,
        "distractors": []
    }
}


def read_transcript(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def extract_items_from_transcript(transcript_text):
    prompt = f"""You are a professional Italian language teacher and linguist.

Analyze the following Italian transcript and extract ALL unique, pedagogically valuable items.

For each item, classify it as either "vocab" or "expression":
- vocab: individual nouns, verbs, adjectives, adverbs
- expression: multi-word phrases, idiomatic expressions, common collocations

For each vocab item provide:
- word: the Italian word (lowercase)
- en: English translation
- partOfSpeech: noun, verb, adjective, adverb
- gender: m, f, or "" (for non-gendered words)
- plural: the plural form (or "" if invariable)
- context: the exact sentence or phrase from the transcript where it appears
- difficulty: A1 or A2
- conceptId: a semantic concept label like "concept.milk" or "concept.morning"
- icon: a single emoji representing the concept
- pronunciation_readable: stress-marked syllable breakdown (e.g., "LAT-teh")
- pronunciation_ipa: IPA transcription in brackets (e.g., "[ˈlatːe]")
- usageNotes: brief cultural or usage note
- etymology_origin: Latin or other origin
- etymology_mnemonic: a memory aid
- distractors: 2-3 similar-sounding Italian words that could be confused

For each expression item provide:
- phrase: the Italian expression
- en: English meaning
- context: the exact sentence from the transcript
- difficulty: A1 or A2
- grammarNote: brief grammar explanation
- pronunciation_readable: stress-marked syllable breakdown
- pronunciation_ipa: IPA transcription
- usageNotes: when and how this expression is used
- lemmaId: a hyphenated identifier for the lemma group
- distractors: 2-3 similar Italian expressions

Skip items that are:
- Pure function words (di, a, il, la, etc.) unless part of an expression
- Music/applause markers
- Channel names or proper nouns

Respond with a JSON object:
{{
  "vocab": [ ... ],
  "expressions": [ ... ]
}}

TRANSCRIPT:
{transcript_text}"""

    # the newest OpenAI model is "gpt-5" which was released August 7, 2025.
    # do not change this unless explicitly requested by the user
    response = client.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role": "system", "content": "You are an expert Italian linguist. Respond only with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        max_completion_tokens=8192
    )

    result = json.loads(response.choices[0].message.content)
    return result


def build_vocab_card(item):
    card = json.loads(json.dumps(VOCAB_SCHEMA_TEMPLATE))
    word = item["word"].lower().strip()
    card_id = re.sub(r'[^a-z0-9]+', '-', word).strip('-')

    card["id"] = card_id
    card["conceptId"] = item.get("conceptId", f"concept.{card_id}")
    card["legacyIcon"] = item.get("icon", "📝")

    card["headword"]["it"] = word
    card["headword"]["en"] = item["en"]
    card["headword"]["partOfSpeech"] = item["partOfSpeech"]
    card["headword"]["gender"] = item.get("gender", "")
    card["headword"]["register"] = "neutral"

    card["forms"]["canonical"] = word
    card["forms"]["singular"] = word
    card["forms"]["plural"] = item.get("plural", "")

    card["pronunciation"]["readable"] = item.get("pronunciation_readable", "")
    card["pronunciation"]["ipa"] = item.get("pronunciation_ipa", "")

    card["meaning"]["primary"] = item["en"]
    card["meaning"]["extended"] = [f"S1: {item['en']}"]
    card["meaning"]["usageNotes"] = item.get("usageNotes", "")

    card["examples"] = [{
        "it": item["context"],
        "en": f"(from transcript)",
        "source": "transcript",
        "difficulty": "easy"
    }]

    card["etymology"]["origin"] = item.get("etymology_origin", "")
    card["etymology"]["mnemonic"] = item.get("etymology_mnemonic", "")

    card["images"]["fallback"]["prompt"] = f"{item['en']}, Italian context, photorealistic"

    card["quizSeeds"]["distractors"] = item.get("distractors", [])

    card["placeholders"]["grammar"] = f"Grammar breakdown for <strong>{word}</strong> coming soon."
    card["placeholders"]["quiz"] = f"Quiz for <strong>{word}</strong> coming soon."

    card["metadata"]["difficulty"] = item.get("difficulty", "A1")

    return card_id, card


def build_expression_card(item):
    card = json.loads(json.dumps(EXPRESSION_SCHEMA_TEMPLATE))
    phrase = item["phrase"].strip()
    card_id = re.sub(r'[^a-z0-9]+', '-', phrase.lower()).strip('-')

    card["id"] = card_id
    card["headword"]["target"] = phrase
    card["headword"]["native"] = item["en"]
    card["level"] = item.get("difficulty", "A2")
    card["tags"] = ["breakfast", "expressions"]
    card["lemmaId"] = item.get("lemmaId", card_id)
    card["sense"]["gloss"] = f"S1 — {item['en']}"

    card["forms"]["canonical"] = phrase

    card["pronunciation"]["readable"] = item.get("pronunciation_readable", "")
    card["pronunciation"]["ipa"] = item.get("pronunciation_ipa", "")

    card["meaning"]["primary"] = item["en"]
    card["meaning"]["extended"] = [f"S1 — {item['en']}"]
    card["meaning"]["usageNotes"] = item.get("usageNotes", "")

    card["examples"] = [{
        "it": item["context"],
        "en": f"(from transcript)"
    }]

    card["grammar"]["notes"] = item.get("grammarNote", "")

    card["media"]["fallback"]["prompt"] = f"{item['en']}, Italian context, photorealistic"

    card["quizSeeds"]["distractors"] = item.get("distractors", [])

    return card_id, card


def generate_cards(transcript_path, output_dir):
    print(f"Reading transcript: {transcript_path}")
    transcript = read_transcript(transcript_path)

    print("Sending transcript to LLM for analysis...")
    result = extract_items_from_transcript(transcript)

    vocab_items = result.get("vocab", [])
    expression_items = result.get("expressions", [])
    print(f"Found {len(vocab_items)} vocab items and {len(expression_items)} expressions.")

    os.makedirs(output_dir, exist_ok=True)

    created = []
    for item in vocab_items:
        card_id, card = build_vocab_card(item)
        filepath = os.path.join(output_dir, f"{card_id}.json")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(card, f, indent=2, ensure_ascii=False)
        created.append(filepath)
        print(f"  [vocab] {filepath}")

    for item in expression_items:
        card_id, card = build_expression_card(item)
        filepath = os.path.join(output_dir, f"{card_id}.json")
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(card, f, indent=2, ensure_ascii=False)
        created.append(filepath)
        print(f"  [expr]  {filepath}")

    print(f"\nDone. Created {len(created)} card files in {output_dir}/")
    return created


def review_cards(output_dir):
    print(f"\n=== REVIEW MODE: Checking cards in {output_dir}/ ===\n")
    issues = []
    card_count = 0

    if not os.path.exists(output_dir):
        print(f"ERROR: Directory {output_dir} does not exist.")
        return

    for filename in sorted(os.listdir(output_dir)):
        if not filename.endswith(".json"):
            continue
        filepath = os.path.join(output_dir, filename)
        card_count += 1

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                card = json.load(f)
        except json.JSONDecodeError as e:
            issues.append(f"  {filename}: INVALID JSON — {e}")
            continue

        card_type = card.get("type", card.get("kind", "unknown"))

        if card_type == "vocab":
            hw = card.get("headword", {})
            if not hw.get("it"):
                issues.append(f"  {filename}: Missing headword.it")
            if not hw.get("en"):
                issues.append(f"  {filename}: Missing headword.en")
            if hw.get("partOfSpeech") == "noun" and not hw.get("gender"):
                issues.append(f"  {filename}: Noun missing gender (headword.gender)")
            if not card.get("pronunciation", {}).get("ipa"):
                issues.append(f"  {filename}: Missing pronunciation.ipa")
            if not card.get("examples"):
                issues.append(f"  {filename}: No examples")
            if not card.get("meaning", {}).get("primary"):
                issues.append(f"  {filename}: Missing meaning.primary")
            if not card.get("images", {}).get("fallback", {}).get("prompt"):
                issues.append(f"  {filename}: Missing images.fallback.prompt")
            distractors = card.get("quizSeeds", {}).get("distractors", [])
            if len(distractors) < 2:
                issues.append(f"  {filename}: Fewer than 2 quiz distractors ({len(distractors)} found)")

            gender = hw.get("gender", "")
            word = hw.get("it", "")
            if gender == "f" and word.endswith("o"):
                issues.append(f"  {filename}: SUSPECT — feminine noun ending in -o: '{word}'")
            if gender == "m" and word.endswith("a") and word not in ["cinema", "problema", "sistema", "tema", "programma", "panorama", "clima", "diploma", "dramma", "pigiama"]:
                issues.append(f"  {filename}: SUSPECT — masculine noun ending in -a: '{word}' (verify)")

        elif card_type in ("sentence", "expression"):
            hw = card.get("headword", {})
            if not hw.get("target"):
                issues.append(f"  {filename}: Missing headword.target")
            if not hw.get("native"):
                issues.append(f"  {filename}: Missing headword.native")
            if not card.get("pronunciation", {}).get("ipa"):
                issues.append(f"  {filename}: Missing pronunciation.ipa")
            if not card.get("examples"):
                issues.append(f"  {filename}: No examples")
            if not card.get("lemmaId"):
                issues.append(f"  {filename}: Missing lemmaId")

        else:
            issues.append(f"  {filename}: Unknown card type '{card_type}'")

    print(f"Reviewed {card_count} cards.\n")

    if issues:
        print(f"Found {len(issues)} issue(s):\n")
        for issue in issues:
            print(issue)
    else:
        print("All cards passed review checks.")

    print()


def main():
    parser = argparse.ArgumentParser(description="Capisco Card Generator")
    parser.add_argument("--transcript", default=DEFAULT_TRANSCRIPT,
                        help=f"Path to transcript file (default: {DEFAULT_TRANSCRIPT})")
    parser.add_argument("--output-dir", default=DEFAULT_OUTPUT_DIR,
                        help=f"Output directory for cards (default: {DEFAULT_OUTPUT_DIR})")
    parser.add_argument("--review", action="store_true",
                        help="Review existing cards for common errors")
    args = parser.parse_args()

    if args.review:
        review_cards(args.output_dir)
    else:
        generate_cards(args.transcript, args.output_dir)
        print("\nRunning review on generated cards...\n")
        review_cards(args.output_dir)


if __name__ == "__main__":
    main()
