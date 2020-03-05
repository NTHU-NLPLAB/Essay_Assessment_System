from starlette.responses import UJSONResponse
from fastapi import FastAPI

from linggle_api import LinggleAPI
import enchant

app = FastAPI()
linggle = LinggleAPI()
spell = enchant.Dict('en')


def gen_replace_query(word):
    if spell.check(word):
        # check forms
        return '_'
    else:
        # TODO: this is a temporary workaround
        # shoud search for multi-word as well
        return '/'.join(spell.suggest(word)).replace(' ', '_')


@app.get("/suggest/{ngramstr}", response_class=UJSONResponse)
async def check_ngram(ngramstr: str, err_type: str = None):
    ngram = ngramstr.split()
    if err_type == 'replace':
        ngram[1] = gen_replace_query(ngram[1])
    elif err_type == 'delete':
        ngram[1] = '?' + ngram[1]
    elif err_type == 'insert':
        ngram.insert(1, '?_')
    else:
        pass
    query = ' '.join(ngram)
    return {'query': query, 'ngrams': linggle.query(query)}
