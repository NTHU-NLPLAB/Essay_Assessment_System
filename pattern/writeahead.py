import os

from starlette.responses import UJSONResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ujson as json
import spacy


APP_DIR = os.path.dirname(os.path.abspath(__file__))
EN_PATTERNS = json.load(open(os.path.join(APP_DIR, 'en_patterns.json')))
MOVE_PATTERNS = json.load(open(os.path.join(APP_DIR, 'move_patterns.json')))


app = FastAPI()
nlp = spacy.load(os.environ.get('SPACY_MODEL', 'en_core_web_sm'), disable=['parser', 'ner'])


# Define CORS whitelist
CORS_ALLOW_ORIGINS = os.getenv('CORS_ALLOW_ORIGINS').split(',')

if CORS_ALLOW_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ALLOW_ORIGINS,
        allow_methods=["*"],
        allow_headers=["*"]
    )


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
    return MOVE_PATTERNS.get(res.text) or tuple(MOVE_PATTERNS.keys())


def get_head(text):
    for token in reversed(nlp(text)):
        if token.pos_ in ('VERB', 'NOUN', 'ADJ'):
            return (token.text if token.lemma_.startswith('-') else token.lemma_, token.pos_)
    return '', 'NOUN'
