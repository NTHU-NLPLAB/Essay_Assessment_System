import pickle as pk
import os

from keras.preprocessing import sequence
from keras.models import load_model
import numpy as np


APP_DIR = os.path.dirname(os.path.abspath(__file__))
AES_MODEL_PATH = os.getenv('AES_MODEL_PATH') or os.path.join(APP_DIR, 'model/best_model.h5')
VOCAB_FILE_PATH = os.getenv('VOCAB_FILE_PATH') or os.path.join(APP_DIR, 'model/efvocab.pkl')

aes_model = load_model(AES_MODEL_PATH)
# test
aes_model.predict(np.zeros((1, 350)))


with open(VOCAB_FILE_PATH, 'rb') as vocab_file:
    vocab = pk.load(vocab_file)


def read_sentence(line, vocab):
    data_x = []
    for word in line.lower().split(' '):
        if word in vocab:
            data_x.append(vocab[word])
        else:
            data_x.append(vocab['<unk>'])
    return data_x


def convert_to_dataset_friendly_scores(scores_array, ranges=(0, 5)):
    low, high = ranges[0], ranges[1]
    scores_array = scores_array * (high - low) + low
    return scores_array


def predict_cerf(text):
    text = text.strip()
    test_sentence = read_sentence(text, vocab)
    test_sentence = sequence.pad_sequences([test_sentence], maxlen=350)
    cerf_level = round(convert_to_dataset_friendly_scores(model.predict(test_sentence).squeeze()))

    if cerf_level == 0.0:
        cerf_level = 'A1'
    elif cerf_level == 1.0:
        cerf_level = 'A2'
    elif cerf_level == 2.0:
        cerf_level = 'B1'
    elif cerf_level == 3.0:
        cerf_level = 'B2'
    elif cerf_level == 4.0:
        cerf_level = 'C1'
    elif cerf_level == 5.0:
        cerf_level = 'C2'
    return cerf_level, ''
