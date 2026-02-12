import json
import os
import pickle
from datetime import datetime

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.utils.class_weight import compute_class_weight
from tensorflow.keras.layers import (
    Concatenate,
    Conv1D,
    Dense,
    Dropout,
    Embedding,
    GlobalMaxPooling1D,
    Input,
)
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.text import Tokenizer

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "dmsw_student_data.csv")
MODEL_FILE = os.path.join(BASE_DIR, "dmsw_model.h5")
TOKENIZER_FILE = os.path.join(BASE_DIR, "dmsw_tokenizer.pkl")
SCALER_FILE = os.path.join(BASE_DIR, "dmsw_scaler.pkl")
METADATA_FILE = os.path.join(BASE_DIR, "model_metadata.json")

MAX_LEN = 15
EMBEDDING_DIM = 50
VOCAB_SIZE = 1000
EPOCHS = 30        # Increased from 10; early stopping will prevent overfitting
BATCH_SIZE = 32
PATIENCE = 5       # Early stopping patience


def load_data():
    print("Loading data...")
    df = pd.read_csv(DATA_FILE)
    print(f"  Loaded {len(df)} rows from {DATA_FILE}")
    return df


def preprocess_data(df):
    print("Preprocessing data...")

    students = df["student_id"].unique()
    X_num = []
    X_text = []
    X_static = []
    y = []

    # Tokenizer for text
    tokenizer = Tokenizer(num_words=VOCAB_SIZE, oov_token="<OOV>")
    tokenizer.fit_on_texts(df["behavior_text"].astype(str))

    with open(TOKENIZER_FILE, "wb") as f:
        pickle.dump(tokenizer, f)

    print(f"  Processing {len(students)} students...")
    skipped = 0

    for student in students:
        student_df = df[df["student_id"] == student].sort_values("week")

        if len(student_df) < MAX_LEN:
            skipped += 1
            continue

        # Numerical: [attendance, grade]
        num_data = student_df[["attendance", "grade"]].values[:MAX_LEN]
        X_num.append(num_data)

        # Textual: first token per week
        text_data = student_df["behavior_text"].astype(str).tolist()[:MAX_LEN]
        seqs = tokenizer.texts_to_sequences(text_data)

        student_text_seq = []
        for s in seqs:
            student_text_seq.append(s[0] if s else 0)

        # Pad/Truncate to MAX_LEN
        if len(student_text_seq) > MAX_LEN:
            student_text_seq = student_text_seq[:MAX_LEN]
        else:
            student_text_seq = student_text_seq + [0] * (MAX_LEN - len(student_text_seq))

        X_text.append(student_text_seq)

        # Static features (from first row)
        first_row = student_df.iloc[0]
        static_feats = [
            first_row["age"],
            first_row["gender"],
            first_row["scholarship"],
            first_row["debt"],
            first_row["tuition_up_to_date"],
            first_row["courses_enrolled"],
            first_row["courses_passed"],
        ]
        X_static.append(static_feats)

        # Label
        y.append(first_row["dropout_label"])

    if skipped:
        print(f"  Skipped {skipped} students with < {MAX_LEN} weeks of data")

    X_num = np.array(X_num)
    X_text = np.array(X_text)
    X_static = np.array(X_static)
    y = np.array(y)

    # Scale numerical data
    num_samples, num_timesteps, num_features = X_num.shape
    X_num_reshaped = X_num.reshape(-1, num_features)

    scaler = StandardScaler()
    X_num_scaled = scaler.fit_transform(X_num_reshaped)
    X_num = X_num_scaled.reshape(num_samples, num_timesteps, num_features)

    with open(SCALER_FILE, "wb") as f:
        pickle.dump(scaler, f)

    print(f"  Final dataset: {len(y)} students | {int(y.sum())} dropout | {int(len(y) - y.sum())} non-dropout")
    return [X_num, X_text, X_static], y, len(static_feats)


def build_dmsw_model(vocab_size, num_static_features):
    # --- Branch 1: Numerical (Multiscale Sliding Window) ---
    input_num = Input(shape=(MAX_LEN, 2), name="numerical_input")
    conv_num_1 = Conv1D(filters=32, kernel_size=3, activation="relu", padding="same")(input_num)
    pool_num_1 = GlobalMaxPooling1D()(conv_num_1)
    conv_num_2 = Conv1D(filters=32, kernel_size=5, activation="relu", padding="same")(input_num)
    pool_num_2 = GlobalMaxPooling1D()(conv_num_2)

    # --- Branch 2: Textual (Dual-Modal) ---
    input_text = Input(shape=(MAX_LEN,), name="text_input")
    embedding = Embedding(input_dim=vocab_size, output_dim=EMBEDDING_DIM)(input_text)
    conv_text_1 = Conv1D(filters=32, kernel_size=3, activation="relu", padding="same")(embedding)
    pool_text_1 = GlobalMaxPooling1D()(conv_text_1)
    conv_text_2 = Conv1D(filters=32, kernel_size=5, activation="relu", padding="same")(embedding)
    pool_text_2 = GlobalMaxPooling1D()(conv_text_2)

    # --- Branch 3: Static ---
    input_static = Input(shape=(num_static_features,), name="static_input")
    dense_static = Dense(16, activation="relu")(input_static)

    # --- Fusion ---
    merged = Concatenate()([pool_num_1, pool_num_2, pool_text_1, pool_text_2, dense_static])
    dense1 = Dense(64, activation="relu")(merged)
    dropout = Dropout(0.5)(dense1)
    output = Dense(1, activation="sigmoid")(dropout)

    model = Model(inputs=[input_num, input_text, input_static], outputs=output)
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])
    return model


def train_model():
    df = load_data()
    X, y, num_static = preprocess_data(df)

    # --- Train / test split ---
    indices = np.arange(len(y))
    train_idx, test_idx, y_train, y_test = train_test_split(
        indices, y, test_size=0.2, random_state=42, stratify=y
    )

    X_train = [x[train_idx] for x in X]
    X_test = [x[test_idx] for x in X]

    print(f"\nTraining on {len(y_train)} samples, testing on {len(y_test)} samples")

    # --- Class weights to handle imbalance ---
    unique_classes = np.unique(y_train)
    class_weights_array = compute_class_weight("balanced", classes=unique_classes, y=y_train)
    class_weight_dict = {int(c): w for c, w in zip(unique_classes, class_weights_array)}
    print(f"  Class weights: {class_weight_dict}")

    # --- Build model ---
    model = build_dmsw_model(VOCAB_SIZE, num_static)
    model.summary()

    # --- Callbacks ---
    early_stop = tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=PATIENCE,
        restore_best_weights=True,
        verbose=1,
    )
    checkpoint = tf.keras.callbacks.ModelCheckpoint(
        MODEL_FILE,
        monitor="val_loss",
        save_best_only=True,
        verbose=1,
    )

    # --- Train ---
    history = model.fit(
        X_train,
        y_train,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_data=(X_test, y_test),
        class_weight=class_weight_dict,
        callbacks=[early_stop, checkpoint],
    )

    # --- Evaluate ---
    loss, acc = model.evaluate(X_test, y_test, verbose=0)
    print(f"\n{'='*50}")
    print(f"Test Accuracy : {acc*100:.2f}%")
    print(f"Test Loss     : {loss:.4f}")
    print(f"{'='*50}")

    # --- Extended metrics ---
    y_pred_prob = model.predict(X_test, verbose=0).flatten()
    y_pred = (y_pred_prob >= 0.5).astype(int)

    tp = int(np.sum((y_pred == 1) & (y_test == 1)))
    fp = int(np.sum((y_pred == 1) & (y_test == 0)))
    fn = int(np.sum((y_pred == 0) & (y_test == 1)))
    tn = int(np.sum((y_pred == 0) & (y_test == 0)))

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

    print(f"\nConfusion Matrix:")
    print(f"  TP={tp}  FP={fp}")
    print(f"  FN={fn}  TN={tn}")
    print(f"\nPrecision : {precision:.4f}")
    print(f"Recall    : {recall:.4f}")
    print(f"F1-Score  : {f1:.4f}")

    # --- Save metadata ---
    metadata = {
        "trained_at": datetime.utcnow().isoformat() + "Z",
        "dataset_file": os.path.basename(DATA_FILE),
        "total_students": len(y),
        "train_samples": len(y_train),
        "test_samples": len(y_test),
        "dropout_ratio": f"{y.mean()*100:.1f}%",
        "epochs_completed": len(history.history["loss"]),
        "max_epochs": EPOCHS,
        "early_stopping_patience": PATIENCE,
        "accuracy": round(acc, 4),
        "loss": round(loss, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {"TP": tp, "FP": fp, "FN": fn, "TN": tn},
        "class_weights": {str(k): round(v, 4) for k, v in class_weight_dict.items()},
    }

    with open(METADATA_FILE, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"\nModel metadata saved to {METADATA_FILE}")

    # Model is already saved by ModelCheckpoint callback (best weights)
    print(f"Best model saved to {MODEL_FILE}")


if __name__ == "__main__":
    train_model()
