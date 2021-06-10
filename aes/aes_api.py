from starlette.responses import UJSONResponse
from fastapi import FastAPI
from pydantic import BaseModel

from .model import predict_cerf

app = FastAPI()


class AesQuery(BaseModel):
    text: str
    score: str = None


@app.post("/aes/", response_class=UJSONResponse)
def suggest_gp(res: AesQuery):
    res.score = predict_cerf(res.text)
    return res
