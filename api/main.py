import os
from functools import lru_cache
import nltk
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from lemminflect import getInflection
from nltk.corpus import wordnet as wn

NLTK_DATA = os.path.join(os.path.dirname(__file__), "nltk_data")
if NLTK_DATA not in nltk.data.path:
    nltk.data.path.insert(0, NLTK_DATA)

app = FastAPI(title="Verbéo Lexical API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["https://papapnes.github.io","http://localhost:8000","http://127.0.0.1:8000","null"], allow_methods=["GET"], allow_headers=["*"])
POS_NAMES = {wn.NOUN:"noun", wn.VERB:"verb", wn.ADJ:"adjective", wn.ADJ_SAT:"adjective", wn.ADV:"adverb"}

def first_value(values, fallback=None):
    return values[0] if values else fallback

@lru_cache(maxsize=4096)
def analyse_word(raw_word: str):
    word = raw_word.lower().strip()
    synsets = wn.synsets(word)
    if not synsets:
        raise HTTPException(status_code=404, detail="Word not found in WordNet")
    parts, definitions, examples, french = [], {}, {}, []
    for synset in synsets:
        part = POS_NAMES.get(synset.pos())
        if not part:
            continue
        if part not in parts:
            parts.append(part)
            definitions[part] = synset.definition()
            examples[part] = first_value(synset.examples())
        for lemma in synset.lemma_names("fra"):
            translated = lemma.replace("_", " ")
            if translated not in french:
                french.append(translated)
    is_verb = "verb" in parts
    past = first_value(getInflection(word, tag="VBD"), f"{word}ed") if is_verb else None
    participle = first_value(getInflection(word, tag="VBN"), past) if is_verb else None
    third_person = first_value(getInflection(word, tag="VBZ"), f"{word}s") if is_verb else None
    present_participle = first_value(getInflection(word, tag="VBG"), f"{word}ing") if is_verb else None
    return {"word":word,"classifications":parts,"primary_classification":"verb" if is_verb else parts[0],"definitions":definitions,"examples":examples,"translations_fr":french[:8],"verb":{"base":word,"past":past,"past_participle":participle,"third_person":third_person,"present_participle":present_participle} if is_verb else None}

@app.get("/")
def root():
    return {"service":"Verbéo Lexical API","status":"ready"}

@app.get("/health")
def health():
    return {"status":"ok"}

@app.get("/word/{word}")
def word_lookup(word: str):
    if not word.isascii() or not word.isalpha():
        raise HTTPException(status_code=400, detail="Use English letters only")
    return analyse_word(word)
