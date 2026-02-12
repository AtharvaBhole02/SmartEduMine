import os
import pickle
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DMSW_MODEL_PATH = os.path.join(BASE_DIR, "dmsw_model.h5")
DMSW_TOKENIZER_PATH = os.path.join(BASE_DIR, "dmsw_tokenizer.pkl")
DMSW_SCALER_PATH = os.path.join(BASE_DIR, "dmsw_scaler.pkl")

MAX_LEN = 15

# Suppress TF noise
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
tf.get_logger().setLevel("ERROR")


def test_model():
    print("Loading model and artifacts...")
    model = load_model(DMSW_MODEL_PATH)
    with open(DMSW_TOKENIZER_PATH, "rb") as f:
        tokenizer = pickle.load(f)
    with open(DMSW_SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)

    # Test cases with all three input types (numerical, text, static)
    test_cases = [
        {
            "name": "Good Student",
            "attendance": 95, "grade": 90,
            "text": "Active participation",
            "age": 20, "gender": 1, "scholarship": 1, "debt": 0,
            "tuition": 1, "enrolled": 6, "passed": 6,
        },
        {
            "name": "Average Student",
            "attendance": 75, "grade": 70,
            "text": "Regular attendance",
            "age": 21, "gender": 0, "scholarship": 0, "debt": 0,
            "tuition": 1, "enrolled": 5, "passed": 4,
        },
        {
            "name": "At-Risk Student",
            "attendance": 50, "grade": 45,
            "text": "Struggling with concepts",
            "age": 22, "gender": 1, "scholarship": 0, "debt": 1,
            "tuition": 0, "enrolled": 5, "passed": 1,
        },
        {
            "name": "Financial Risk",
            "attendance": 80, "grade": 72,
            "text": "Regular attendance",
            "age": 23, "gender": 0, "scholarship": 0, "debt": 1,
            "tuition": 0, "enrolled": 5, "passed": 3,
        },
        {
            "name": "Failing Student",
            "attendance": 30, "grade": 25,
            "text": "Absent without leave",
            "age": 19, "gender": 1, "scholarship": 0, "debt": 1,
            "tuition": 0, "enrolled": 6, "passed": 0,
        },
    ]

    header = f"{'Profile':<18} | {'Att':>4} | {'Grd':>4} | {'Prob':>7} | {'Risk':<10} | {'Deterministic'}"
    print(f"\n{'='*80}")
    print("  DMSW Model Test Results")
    print(f"{'='*80}")
    print(header)
    print("-" * 80)

    for case in test_cases:
        # --- Numerical input: constant history (deterministic) ---
        history_num = np.array([[case["attendance"], case["grade"]]] * MAX_LEN)
        history_num_scaled = scaler.transform(history_num)
        X_num = np.expand_dims(history_num_scaled, axis=0)

        # --- Text input ---
        seq = tokenizer.texts_to_sequences([case["text"]])[0]
        token = seq[0] if seq else 0
        X_text = np.array([[token] * MAX_LEN])

        # --- Static input (was missing before!) ---
        X_static = np.array([[
            case["age"], case["gender"], case["scholarship"],
            case["debt"], case["tuition"], case["enrolled"], case["passed"],
        ]])

        # --- Predict ---
        pred1 = float(model.predict([X_num, X_text, X_static], verbose=0)[0][0])
        pred2 = float(model.predict([X_num, X_text, X_static], verbose=0)[0][0])

        is_deterministic = "✅ Yes" if abs(pred1 - pred2) < 1e-6 else "❌ No"

        # Risk level (4-tier)
        if pred1 >= 0.70:
            risk = "CRITICAL"
        elif pred1 >= 0.50:
            risk = "HIGH"
        elif pred1 >= 0.30:
            risk = "MEDIUM"
        else:
            risk = "LOW"

        print(f"{case['name']:<18} | {case['attendance']:>4} | {case['grade']:>4} | {pred1:.4f} | {risk:<10} | {is_deterministic}")

    print(f"{'='*80}")
    print("Done.\n")


if __name__ == "__main__":
    test_model()
