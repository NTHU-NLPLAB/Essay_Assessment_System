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
        return linggle(query, ngram_api_uri=self.ngram_api)

    def get_example(self, ngram_str):
        req = requests.post(self.example_api, json={'ngram': ngram_str})
        if req.status_code == 200:
            result = req.json()
            return result["examples"]
        else:
            # TODO: handle when status code is not 200
            pass


def linggle(query, ver='www', ngram_api_uri=None):
    uri = ngram_api_uri if ngram_api_uri else NGRAM_API_URI.format(ver)
    r = requests.get(uri + urllib.parse.quote(query, safe=''))
    if r.status_code == 200:
        return r.json()['ngrams']
    else:
        # TODO: handle when status code is not 200
        pass


if __name__ == "__main__":
    linggle_api = LinggleAPI()
    for ngram, count in linggle_api["adj. beach"][:3]:
        print(ngram, count)
    for sent in linggle_api.get_example("sandy beach")[:3]:
        print(sent)

    linggle_api = LinggleAPI('zh')
    for ngram, count in linggle_api.query("提出 n.")[:3]:
        print(ngram, count)
    for sent in linggle_api.get_example("提出 報告")[:3]:
        print(sent)
