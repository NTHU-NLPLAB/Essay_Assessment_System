import os

from spacy.parts_of_speech import NOUN, VERB, ADJ
from starlette.responses import UJSONResponse
from fastapi import FastAPI
from pydantic import BaseModel
import ujson as json
import spacy


APP_DIR = os.path.dirname(os.path.abspath(__file__))
EN_PATTERNS = json.load(open(os.path.join(APP_DIR, 'en_patterns.json')))
MOVE_PATTERNS = json.load(open(os.path.join(APP_DIR, 'move_patterns.json')))


app = FastAPI()
nlp = spacy.load(os.environ.get('SPACY_MODEL', 'en_core_web_sm'), disable=['parser', 'ner'])


class WriteQuery(BaseModel):
    text: str
    headword: str = None
    pos: str = None
    patterns: str = None


@app.post("/suggest_gp/", response_class=UJSONResponse)
def suggest_gp(res: WriteQuery):
    res.headword, res.pos = get_head(res.text)
    res.patterns = EN_PATTERNS[res.pos].get(res.headword, [])
    return res


@app.post("/suggest_move/", response_class=UJSONResponse)
def suggest_move(res: WriteQuery):
    if res.text in MOVE_PATTERNS:
        return MOVE_PATTERNS[res.text]
    else:
        return tuple(MOVE_PATTERNS.keys())


def get_head(text):
    for token in reversed(nlp(text)):
        if token.pos == NOUN:
            if token.lemma_.startswith('-'):
                return token.text, 'N'
            else:
                return token.lemma_, 'N'
        elif token.pos == VERB:
            if token.lemma_.startswith('-'):
                return token.text, 'V'
            else:
                return token.lemma_, 'V'
        elif token.pos == ADJ:
            if token.lemma_.startswith('-'):
                return token.text, 'ADJ'
            else:
                return token.lemma_, 'ADJ'
    return '', 'N'
