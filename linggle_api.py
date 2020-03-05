#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import urllib

NGRAM_API_URI = "https://{0}.linggle.com/ngram/"
EXP_API_URI = "https://{0}.linggle.com/example/"


class LinggleAPI(dict):
    # ver: Version can be `www`, `coca`, `cna`, `udn`, `zh`
    def __init__(self, ver='www'):
        self.ngram_api = NGRAM_API_URI.format(ver)
        self.example_api = EXP_API_URI.format(ver)

    def __getitem__(self, query):
        return self.query(query)

    def query(self, query):
        req = requests.get(self.ngram_api + urllib.parse.quote(query, safe=''))
        if req.status_code == 200:
            r = req.json()
            return r['ngrams']
        else:
            # TODO: handle when status code is not 200
            pass

    def get_example(self, ngram_str):
        req = requests.post(self.example_api, json={'ngram': ngram_str})
        if req.status_code == 200:
            result = req.json()
            return result["examples"]
        else:
            # TODO: handle when status code is not 200
            pass


if __name__ == "__main__":
    linggle = LinggleAPI()
    for ngram, count in linggle["adj. beach"][:3]:
        print(ngram, count)
    for sent in linggle.get_example("sandy beach")[:3]:
        print(sent)

    linggle = LinggleAPI('zh')
    for ngram, count in linggle.query("提出 n.")[:3]:
        print(ngram, count)
    for sent in linggle.get_example("提出 報告")[:3]:
        print(sent)
