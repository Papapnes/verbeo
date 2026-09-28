"""Generate compact noun/rare-verb indexes from Princeton WordNet.

Requires NLTK's ``wordnet`` corpus. Only single lowercase words are emitted,
matching the input accepted by the browser application.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

from nltk.corpus import wordnet as wn


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "wordnet-pos.js"
WORD = re.compile(r"^[a-z]+$")


def tag_count(word: str, part_of_speech: str) -> int:
    return sum(lemma.count() for lemma in wn.lemmas(word, pos=part_of_speech))


def main() -> None:
    noun_only: list[str] = []
    noun_verbs: list[str] = []
    untagged_verbs: list[str] = []

    for word in sorted(set(wn.all_lemma_names(pos=wn.NOUN))):
        if not WORD.fullmatch(word):
            continue

        verb_senses = wn.synsets(word, pos=wn.VERB)
        if not verb_senses:
            noun_only.append(word)
            continue

        noun_verbs.append(word)

        # WordNet tag counts come from semantically annotated corpora. A word
        # seen as a noun but never tagged as a verb is not presented as an
        # ordinary learning verb, even if WordNet records a specialized sense.
        noun_frequency = tag_count(word, wn.NOUN)
        verb_frequency = tag_count(word, wn.VERB)
        if noun_frequency > 0 and verb_frequency == 0:
            untagged_verbs.append(word)

    content = (
        "// Generated from Princeton WordNet 3.0 categories and tagged-sense counts.\n"
        "// Source: https://wordnet.princeton.edu/documentation/cntlist5wn\n"
        f"const WORDNET_NOUN_ONLY=new Set({json.dumps(noun_only, ensure_ascii=False, separators=(',', ':'))});\n"
        f"const WORDNET_NOUN_VERBS=new Set({json.dumps(noun_verbs, ensure_ascii=False, separators=(',', ':'))});\n"
        f"const WORDNET_UNTAGGED_VERBS=new Set({json.dumps(untagged_verbs, ensure_ascii=False, separators=(',', ':'))});\n"
    )
    OUTPUT.write_text(content, encoding="utf-8")
    print(f"{len(noun_only)} noun-only words; {len(noun_verbs)} noun+verb words; "
          f"{len(untagged_verbs)} verb senses absent from the tagged corpus")


if __name__ == "__main__":
    main()
