# -*- coding: utf-8 -*-
from itertools import groupby
from linggle_api import linggle


def to_ngrams(tokens, n):
    return zip(*(tokens[i:] for i in range(n)))


def gen_fuzzy_queries(query, index=None):
    tokens = query.split()
    if index:
        candidates = (tokens[i:j] for i in range(index) for j in range(index+1, len(query)+1))
        candidates = sorted(candidates, key=len, reverse=True)
    else:
        length = min(len(tokens), 5)
        candidates = (ngram for n in reversed(range(2, length)) for ngram in to_ngrams(tokens, n))
    return candidates


def fuzzy_query(query, index=None):
    candidates = gen_fuzzy_queries(query, index)

    for _, queries in groupby(candidates, key=len):
        queries = map(' '.join, queries)
        results = [(query, linggle(query)) for query in queries]
        # reserve results with at least one ngram
        results = [(q, res) for q, res in results if res]
        if results:
            return max(results, key=lambda x: x[1][0][1])
