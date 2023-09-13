from typing import Union
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import UJSONResponse
from pydantic import BaseModel

from .model import predict, score_to_cerf

app = FastAPI()

# Define CORS whitelist
CORS_ALLOW_ORIGINS = os.getenv('CORS_ALLOW_ORIGINS', '').split(',')

if CORS_ALLOW_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ALLOW_ORIGINS,
        allow_methods=["*"],
        allow_headers=["*"]
    )


class AesQuery(BaseModel):
    text: str
    score: str = None
    raw_score: Union[float, None] = None


@app.post("/api/aes/", response_class=UJSONResponse)
def assess_text(res: AesQuery):
    raw_score = predict(res.text)
    if raw_score:
        res.raw_score = raw_score
    res.score = score_to_cerf(raw_score)
    return res
