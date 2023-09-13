import pickle as pk
import os

from keras.preprocessing import sequence
from keras.models import load_model
import numpy as np


APP_DIR = os.path.dirname(os.path.abspath(__file__))
AES_MODEL_PATH = os.getenv('AES_MODEL_PATH') or os.path.join(APP_DIR, 'model/best_model.h5')
VOCAB_FILE_PATH = os.getenv('VOCAB_FILE_PATH') or os.path.join(APP_DIR, 'model/efvocab.pkl')
CEFR_LEVELS = ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')

aes_model = load_model(AES_MODEL_PATH)
# test
aes_model.predict(np.zeros((1, 350)))


with open(VOCAB_FILE_PATH, 'rb') as vocab_file:
    vocab = pk.load(vocab_file)


def predict(text):
    # replace OOV tokens to '<unk>' tokens
    tokens = [vocab[word] if word in vocab else vocab['<unk>'] for word in text.strip().lower().split()]
    test_sentence = sequence.pad_sequences([tokens], maxlen=350)
    score = aes_model.predict(test_sentence).squeeze()
    return score


def score_to_cerf(raw_score):
    return CEFR_LEVELS[int(round(raw_score * 5))]
