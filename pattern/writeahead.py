import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel
import orjson as json
import spacy


APP_DIR = os.path.dirname(os.path.abspath(__file__))
EN_PATTERNS = json.loads(open(os.path.join(APP_DIR, 'en_patterns.json'), 'rb').read())
MOVE_PATTERNS = json.loads(open(os.path.join(APP_DIR, 'move_patterns.json'), 'rb').read())

MOVES = {
    'Result': 'res',
    'Background': 'bkg',
    'Method': 'mth',
    'Discussion': 'dis',
    'Gap': 'gp',
    'The basis of the work': 'bas',
    'Cause and effect': 'c/e',
    'Definition': 'def',
    'Purpose': 'pp',
    'Literature review': 'lit',
    'Statements of textual organization': 'txt',
    'Contrastive or comparative statements': 'c/c'
}

app = FastAPI()
nlp = spacy.load(os.environ.get('SPACY_MODEL', 'en_core_web_sm'), disable=['parser', 'ner'])


# Define CORS whitelist
CORS_ALLOW_ORIGINS = os.getenv('CORS_ALLOW_ORIGINS', '').split(',')

if CORS_ALLOW_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ALLOW_ORIGINS,
        allow_methods=["*"],
        allow_headers=["*"]
    )


class WriteQuery(BaseModel):
    text: str
    caret: int = 0
    headword: str = None
    pos: str = None
    patterns: str = None


@app.post("/api/suggest/gp/", response_class=ORJSONResponse)
def suggest_gp(res: WriteQuery):
    res.headword, res.pos = get_head(res.text)
    res.patterns = EN_PATTERNS[res.pos].get(res.headword, [])
    return res


@app.post("/api/suggest/move/", response_class=ORJSONResponse)
def suggest_move(res: WriteQuery):
    return MOVE_PATTERNS.get(MOVES.get(res.text)) or tuple(MOVES.keys())


def get_head(text):
    for token in reversed(nlp(text)):
        if token.pos_ in ('VERB', 'NOUN', 'ADJ'):
            return (token.text if token.lemma_.startswith('-') else token.lemma_, token.pos_)
    return '', 'NOUN'
