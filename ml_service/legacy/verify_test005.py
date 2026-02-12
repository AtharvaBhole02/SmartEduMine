import tensorflow as tf
from tensorflow.keras.models import load_model
import pickle
import numpy as np

# Load Artifacts
DMSW_MODEL_PATH = 'dmsw_model.h5'
DMSW_TOKENIZER_PATH = 'dmsw_tokenizer.pkl'
DMSW_SCALER_PATH = 'dmsw_scaler.pkl'

def verify():
    print("Loading model...")
    model = load_model(DMSW_MODEL_PATH)
    with open(DMSW_TOKENIZER_PATH, 'rb') as f:
        tokenizer = pickle.load(f)
    with open(DMSW_SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
        
    # TEST005 Data from CSV
    # 90.3,82.3,5,23,Male,Yes,No,Yes,6,6
    case = {
        "attendance": 90.3,
        "grade": 82.3,
        "text": "Regular attendance", # Default assumption
        "age": 23,
        "gender": 1, # Male
        "scholarship": 1, # Yes
        "debt": 0, # No
        "tuition": 1, # Yes
        "enrolled": 6,
        "passed": 6
    }
    
    # Preprocess
    history_num = [[case['attendance'], case['grade']]] * 15
    history_num = np.array(history_num)
    history_num = scaler.transform(history_num)
    X_num = np.expand_dims(history_num, axis=0)
    
    seq = tokenizer.texts_to_sequences([case['text']])[0]
    token = seq[0] if seq else 0
    X_text = np.array([[token] * 15])
    
    X_static = np.array([[
        case['age'], case['gender'], case['scholarship'], 
        case['debt'], case['tuition'], 
        case['enrolled'], case['passed']
    ]])
    
    # Predict
    pred = model.predict([X_num, X_text, X_static], verbose=0)[0][0]
    status = "Safe" if pred < 0.4 else "Warning" if pred < 0.7 else "CRITICAL"
    
    print(f"TEST005 Prediction: {pred:.4f} ({pred*100:.1f}%) -> {status}")

if __name__ == "__main__":
    verify()
