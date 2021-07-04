import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import UJSONResponse
from pydantic import BaseModel

from .model import predict_cerf

app = FastAPI()

# Define CORS whitelist
CORS_ALLOW_ORIGINS = os.getenv('CORS_ALLOW_ORIGINS', '').split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"]
)


class AesQuery(BaseModel):
    text: str
    score: str = None


@app.post("/api/aes/", response_class=UJSONResponse)
def suggest_gp(res: AesQuery):
    res.score = predict_cerf(res.text)
    return res
