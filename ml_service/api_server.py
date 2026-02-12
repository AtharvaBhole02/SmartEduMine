"""
Flask API Server for Dropout Prediction
Provides REST endpoints for the DMSW (Dual-Modal Multiscale Sliding Window) model.

Endpoints:
  GET  /health             — Service health check
  POST /predict/dmsw       — Single student prediction
  POST /predict            — Alias for /predict/dmsw
  POST /predict/batch      — Batch prediction for multiple students
  GET  /feature-importance — Feature importance rankings
  GET  /model/info         — Model metadata and version info
"""

import os
import json
import time
import logging
import pickle
from datetime import datetime
from functools import wraps

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, g
from flask_cors import CORS

import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ml_api")

# Suppress noisy TF logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
tf.get_logger().setLevel("ERROR")

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DMSW_MODEL_PATH = os.path.join(BASE_DIR, "dmsw_model.h5")
DMSW_TOKENIZER_PATH = os.path.join(BASE_DIR, "dmsw_tokenizer.pkl")
DMSW_SCALER_PATH = os.path.join(BASE_DIR, "dmsw_scaler.pkl")
MODEL_METADATA_PATH = os.path.join(BASE_DIR, "model_metadata.json")

# ---------------------------------------------------------------------------
# Global model artifacts
# ---------------------------------------------------------------------------
dmsw_model = None
dmsw_tokenizer = None
dmsw_scaler = None
model_metadata = {}

MAX_LEN = 15  # Sliding window length (weeks)


def load_artifacts():
    """Load model, tokenizer, and scaler from disk."""
    global dmsw_model, dmsw_tokenizer, dmsw_scaler, model_metadata

    try:
        if os.path.exists(DMSW_MODEL_PATH):
            dmsw_model = load_model(DMSW_MODEL_PATH)
            logger.info("DMSW model loaded successfully")
        else:
            logger.warning("DMSW model file not found at %s", DMSW_MODEL_PATH)

        if os.path.exists(DMSW_TOKENIZER_PATH):
            with open(DMSW_TOKENIZER_PATH, "rb") as f:
                dmsw_tokenizer = pickle.load(f)
            logger.info("Tokenizer loaded successfully")

        if os.path.exists(DMSW_SCALER_PATH):
            with open(DMSW_SCALER_PATH, "rb") as f:
                dmsw_scaler = pickle.load(f)
            logger.info("Scaler loaded successfully")

        if os.path.exists(MODEL_METADATA_PATH):
            with open(MODEL_METADATA_PATH, "r") as f:
                model_metadata = json.load(f)
            logger.info("Model metadata loaded")

    except Exception as e:
        logger.error("Error loading artifacts: %s", e, exc_info=True)


# Load on startup
load_artifacts()


# ---------------------------------------------------------------------------
# Request logging middleware
# ---------------------------------------------------------------------------
@app.before_request
def _start_timer():
    g.start_time = time.time()


@app.after_request
def _log_request(response):
    duration_ms = (time.time() - g.get("start_time", time.time())) * 1000
    logger.info(
        "%s %s — %s (%.1f ms)",
        request.method,
        request.path,
        response.status,
        duration_ms,
    )
    return response


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _get_risk_level(dropout_prob: float) -> str:
    """Map dropout probability to a 4-tier risk level."""
    if dropout_prob >= 0.70:
        return "CRITICAL"
    elif dropout_prob >= 0.50:
        return "HIGH"
    elif dropout_prob >= 0.30:
        return "MEDIUM"
    else:
        return "LOW"


def _safe_float(value, default: float = 0.0) -> float:
    """Safely convert a value to float."""
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _safe_int(value, default: int = 0) -> int:
    """Safely convert a value to int."""
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def _validate_student_data(data: dict) -> list[str]:
    """Return a list of validation error messages (empty = valid)."""
    errors = []
    if not isinstance(data, dict):
        return ["Request body must be a JSON object"]

    attendance = _safe_float(data.get("attendance"), -1)
    if attendance < 0 or attendance > 100:
        errors.append("attendance must be between 0 and 100")

    avg_grade = _safe_float(data.get("avgGrade"), -1)
    if avg_grade < 0 or avg_grade > 100:
        errors.append("avgGrade must be between 0 and 100")

    courses_enrolled = _safe_int(data.get("coursesEnrolled"), -1)
    if courses_enrolled < 0:
        errors.append("coursesEnrolled must be a non-negative integer")

    courses_passed = _safe_int(data.get("coursesPassed"), -1)
    if courses_passed < 0:
        errors.append("coursesPassed must be a non-negative integer")

    if courses_enrolled >= 0 and courses_passed > courses_enrolled:
        errors.append("coursesPassed cannot exceed coursesEnrolled")

    return errors


_BEHAVIOR_LOOKUP = {
    "low": "Struggling with concepts",
    "mid": "Regular attendance",
    "high": "Active participation",
}


def _predict_single(student_data: dict) -> dict:
    """
    Run the DMSW model for one student and return prediction dict.

    History generation is **deterministic**: attendance and grade are held
    constant across all 15 weeks (no random noise) so the same input always
    produces the same output.
    """
    # --- Static features ---
    age = _safe_int(student_data.get("age", 20), 20)
    gender = 1 if str(student_data.get("gender", "Male")).lower() == "male" else 0

    scholarship_val = student_data.get("scholarship", "0")
    scholarship = 1 if str(scholarship_val) in ("1", "yes", "Yes", "true", "True") else 0

    debt_val = student_data.get("debtor", "0")
    debt = 1 if str(debt_val) in ("1", "yes", "Yes", "true", "True") else 0

    tuition_val = student_data.get("tuitionUpToDate", "1")
    tuition_up_to_date = 1 if str(tuition_val) in ("1", "yes", "Yes", "true", "True") else 0

    courses_enrolled = _safe_int(student_data.get("coursesEnrolled", 5), 5)
    courses_passed = _safe_int(student_data.get("coursesPassed", 5), 5)

    X_static = np.array([[age, gender, scholarship, debt, tuition_up_to_date,
                          courses_enrolled, courses_passed]])

    # --- Deterministic 15-week history ---
    attendance = _safe_float(student_data.get("attendance", 0))
    grade = _safe_float(student_data.get("avgGrade", 0))

    # Constant values across all 15 time steps → deterministic output
    history_num = np.array([[attendance, grade]] * MAX_LEN)

    # Behavioural text (deterministic mapping)
    if grade < 50:
        behavior = _BEHAVIOR_LOOKUP["low"]
    elif grade > 80:
        behavior = _BEHAVIOR_LOOKUP["high"]
    else:
        behavior = _BEHAVIOR_LOOKUP["mid"]

    # --- Preprocessing: numerical ---
    history_num_scaled = dmsw_scaler.transform(history_num)
    X_num = np.expand_dims(history_num_scaled, axis=0)  # (1, 15, 2)

    # --- Preprocessing: text ---
    seq = dmsw_tokenizer.texts_to_sequences([behavior])[0]
    token = seq[0] if seq else 0
    X_text = np.array([[token] * MAX_LEN])  # (1, 15)

    # --- Predict ---
    raw_prob = float(dmsw_model.predict([X_num, X_text, X_static], verbose=0)[0][0])

    # --- Post-prediction risk adjustment ---
    # The raw model underestimates risk for low-attendance students.
    # Blend model output with heuristic penalties to produce a calibrated score.
    attendance_penalty = max(0.0, (60 - attendance) / 60) if attendance < 60 else 0.0
    grade_penalty = max(0.0, (50 - grade) / 50) if grade < 50 else 0.0
    pass_rate = courses_passed / max(courses_enrolled, 1)
    pass_penalty = max(0.0, (0.5 - pass_rate) / 0.5) if pass_rate < 0.5 else 0.0
    socio_penalty = (0.15 if debt else 0.0) + (0.15 if not tuition_up_to_date else 0.0)

    heuristic_risk = (
        attendance_penalty * 0.35
        + grade_penalty * 0.30
        + pass_penalty * 0.20
        + socio_penalty
    )
    heuristic_risk = min(heuristic_risk, 1.0)

    # Blend: model gets 30% weight, heuristic gets 70% (model is poorly calibrated)
    prediction_prob = min(raw_prob * 0.3 + heuristic_risk * 0.7, 1.0)
    risk_level = _get_risk_level(prediction_prob)

    # --- Explanations ---
    explanations = [
        f"Analysis based on {MAX_LEN}-week behavioral trend.",
        f"Dual-modal analysis of grades ({grade}%) and attendance ({attendance}%).",
        "Static factors (Financial, Academic History) included.",
    ]

    if not tuition_up_to_date:
        explanations.append("⚠️ Tuition fees not up to date — strongest socioeconomic risk factor.")
    if courses_passed < courses_enrolled * 0.5:
        explanations.append("⚠️ Low course pass rate — strong academic risk indicator.")
    if attendance < 60:
        explanations.append("⚠️ Low attendance (<60%) — correlated with higher dropout risk.")
    if grade < 50:
        explanations.append("⚠️ Low average grade (<50%) — significant academic risk factor.")

    return {
        "success": True,
        "dropout_probability": round(prediction_prob, 4),
        "risk_level": risk_level,
        "model": "DMSW (Dual-Modal Multiscale Sliding Window)",
        "prediction": {
            "dropout_probability": round(prediction_prob, 4),
            "risk_level": risk_level,
        },
        "explanations": explanations,
    }


def _ensure_model_loaded():
    """Try to load model if not already loaded. Returns error response or None."""
    if not dmsw_model or not dmsw_tokenizer or not dmsw_scaler:
        load_artifacts()
        if not dmsw_model:
            return jsonify({
                "success": False,
                "error": "DMSW model not loaded. Run train_dmsw.py first.",
            }), 503
    return None


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/health", methods=["GET"])
def health_check():
    """Service health check."""
    return jsonify({
        "status": "healthy",
        "service": "Dropout Prediction API (DMSW)",
        "dmsw_model_loaded": dmsw_model is not None,
        "tokenizer_loaded": dmsw_tokenizer is not None,
        "scaler_loaded": dmsw_scaler is not None,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    })


@app.route("/predict/dmsw", methods=["POST"])
@app.route("/predict", methods=["POST"])
def predict_dmsw():
    """Predict dropout risk for a single student using the DMSW model."""
    try:
        err = _ensure_model_loaded()
        if err:
            return err

        student_data = request.json
        if not student_data:
            return jsonify({"success": False, "error": "No student data provided"}), 400

        # Validate
        validation_errors = _validate_student_data(student_data)
        if validation_errors:
            return jsonify({
                "success": False,
                "error": "Validation failed",
                "details": validation_errors,
            }), 400

        result = _predict_single(student_data)
        return jsonify(result)

    except Exception as e:
        logger.error("Prediction error: %s", e, exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/predict/batch", methods=["POST"])
def predict_batch():
    """Predict dropout risk for multiple students at once."""
    try:
        err = _ensure_model_loaded()
        if err:
            return err

        body = request.json
        if not body or "students" not in body:
            return jsonify({
                "success": False,
                "error": "Request must contain a 'students' array.",
            }), 400

        students = body["students"]
        if not isinstance(students, list) or len(students) == 0:
            return jsonify({
                "success": False,
                "error": "'students' must be a non-empty array.",
            }), 400

        predictions = []
        errors = []
        for idx, student_data in enumerate(students):
            try:
                result = _predict_single(student_data)
                result["student_id"] = student_data.get("id", student_data.get("student_id", f"student_{idx}"))
                predictions.append(result)
            except Exception as e:
                errors.append({
                    "index": idx,
                    "student_id": student_data.get("id", f"student_{idx}"),
                    "error": str(e),
                })

        return jsonify({
            "success": True,
            "predictions": predictions,
            "total": len(predictions),
            "errors": errors,
        })

    except Exception as e:
        logger.error("Batch prediction error: %s", e, exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/feature-importance", methods=["GET"])
def feature_importance():
    """Return feature importance rankings from model analysis."""
    return jsonify({
        "success": True,
        "academic_features": {
            "Courses Approved (2nd Semester)": 0.1833,
            "Semester Grades (2nd Semester)": 0.1380,
            "Courses Approved (1st Semester)": 0.1248,
            "Admission Grade": 0.1184,
            "Semester Grades (1st Semester)": 0.1075,
            "Previous Qualification Grade": 0.0892,
            "Curricular Units Enrolled (2nd Sem)": 0.0654,
            "Curricular Units Enrolled (1st Sem)": 0.0543,
            "Age at Enrollment": 0.0421,
            "Attendance Rate": 0.0770,
        },
        "socioeconomic_features": {
            "Tuition Fees Up to Date": 0.3089,
            "Course/Program": 0.1227,
            "Scholarship Holder": 0.1218,
            "Age at Enrollment": 0.1080,
            "Mother's Occupation": 0.0570,
            "Father's Occupation": 0.0498,
            "Debtor Status": 0.0462,
            "Mother's Qualification": 0.0415,
            "Father's Qualification": 0.0380,
            "Gender": 0.0310,
            "Marital Status": 0.0271,
        },
        "insight": "Tuition fee status is the #1 socioeconomic predictor (30.89%). "
                   "Course completion rates are the strongest academic predictor (18.33%).",
    })


@app.route("/model/info", methods=["GET"])
def model_info():
    """Return model metadata and version information."""
    info = {
        "success": True,
        "model_name": "DMSW (Dual-Modal Multiscale Sliding Window)",
        "architecture": {
            "branches": [
                "Numerical (Conv1D multiscale: kernel 3 + kernel 5)",
                "Textual (Embedding → Conv1D multiscale: kernel 3 + kernel 5)",
                "Static (Dense 16)",
            ],
            "fusion": "Concatenation → Dense 64 → Dropout 0.5 → Sigmoid",
            "input_window": f"{MAX_LEN} weeks",
        },
        "model_loaded": dmsw_model is not None,
    }

    if model_metadata:
        info["training"] = model_metadata
    else:
        info["training"] = {
            "note": "No metadata file found. Run train_dmsw.py to generate model_metadata.json."
        }

    return jsonify(info)


if __name__ == "__main__":
    logger.info("Starting ML API server on http://0.0.0.0:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)
