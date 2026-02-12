"""
Comprehensive Model Accuracy Evaluation
Evaluates the dual scaling dropout prediction model
"""

from dropout_predictor import DualScalingDropoutPredictor
import pandas as pd
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, classification_report, roc_auc_score
)
import json

def evaluate_model():
    print("="*70)
    print("DUAL SCALING DROPOUT PREDICTION MODEL - ACCURACY EVALUATION")
    print("="*70)
    
    # Load model
    print("\n📊 Loading trained model...")
    predictor = DualScalingDropoutPredictor()
    predictor.load_model('models/dropout_model.pkl')
    
    # Load data
    print("📊 Loading dataset...")
    df = pd.read_csv('data.csv', sep=';')
    
    print(f"\n📈 Dataset Statistics:")
    print(f"   Total Students: {len(df)}")
    print(f"   Features: {len(df.columns)}")
    print(f"\n   Target Distribution:")
    print(df['Target'].value_counts())
    print(f"\n   Percentages:")
    print(df['Target'].value_counts(normalize=True) * 100)
    
    # Prepare features
    academic_features, socioeconomic_features = predictor.prepare_features(df)
    
    # Get features
    X_academic = df[academic_features].fillna(0)
    X_academic_scaled = predictor.academic_scaler.transform(X_academic)
    
    X_socioeconomic = df[socioeconomic_features].fillna(0)
    X_socioeconomic_scaled = predictor.socioeconomic_scaler.transform(X_socioeconomic)
    
    # Get true labels
    y_true = predictor.label_encoder.transform(df['Target'])
    
    # Get predictions from individual models
    print("\n" + "="*70)
    print("INDIVIDUAL MODEL PERFORMANCE")
    print("="*70)
    
    # Academic Model
    acad_pred = predictor.academic_model.predict(X_academic_scaled)
    acad_accuracy = accuracy_score(y_true, acad_pred)
    print(f"\n📚 Academic Model:")
    print(f"   Accuracy: {acad_accuracy:.2%}")
    print(f"   Precision: {precision_score(y_true, acad_pred, average='weighted'):.2%}")
    print(f"   Recall: {recall_score(y_true, acad_pred, average='weighted'):.2%}")
    print(f"   F1-Score: {f1_score(y_true, acad_pred, average='weighted'):.2%}")
    
    # Socioeconomic Model
    socio_pred = predictor.socioeconomic_model.predict(X_socioeconomic_scaled)
    socio_accuracy = accuracy_score(y_true, socio_pred)
    print(f"\n👥 Socioeconomic Model:")
    print(f"   Accuracy: {socio_accuracy:.2%}")
    print(f"   Precision: {precision_score(y_true, socio_pred, average='weighted'):.2%}")
    print(f"   Recall: {recall_score(y_true, socio_pred, average='weighted'):.2%}")
    print(f"   F1-Score: {f1_score(y_true, socio_pred, average='weighted'):.2%}")
    
    # Ensemble Model
    acad_probs = predictor.academic_model.predict_proba(X_academic_scaled)
    socio_probs = predictor.socioeconomic_model.predict_proba(X_socioeconomic_scaled)
    X_ensemble = np.hstack([acad_probs, socio_probs])
    
    ensemble_pred = predictor.ensemble_model.predict(X_ensemble)
    ensemble_probs = predictor.ensemble_model.predict_proba(X_ensemble)
    
    ensemble_accuracy = accuracy_score(y_true, ensemble_pred)
    
    print("\n" + "="*70)
    print("🎯 ENSEMBLE MODEL PERFORMANCE (FINAL MODEL)")
    print("="*70)
    print(f"\n   Overall Accuracy: {ensemble_accuracy:.2%}")
    print(f"   Precision: {precision_score(y_true, ensemble_pred, average='weighted'):.2%}")
    print(f"   Recall: {recall_score(y_true, ensemble_pred, average='weighted'):.2%}")
    print(f"   F1-Score: {f1_score(y_true, ensemble_pred, average='weighted'):.2%}")
    
    # Detailed classification report
    print("\n" + "="*70)
    print("DETAILED CLASSIFICATION REPORT")
    print("="*70)
    print(classification_report(
        y_true, 
        ensemble_pred,
        target_names=predictor.label_encoder.classes_,
        digits=4
    ))
    
    # Confusion Matrix
    print("\n" + "="*70)
    print("CONFUSION MATRIX")
    print("="*70)
    cm = confusion_matrix(y_true, ensemble_pred)
    classes = predictor.label_encoder.classes_
    
    print("\n           Predicted")
    print("           ", "  ".join(f"{c:>10}" for c in classes))
    print("Actual")
    for i, actual_class in enumerate(classes):
        print(f"{actual_class:>10}", "  ".join(f"{cm[i][j]:>10}" for j in range(len(classes))))
    
    # Per-class accuracy
    print("\n" + "="*70)
    print("PER-CLASS ACCURACY")
    print("="*70)
    for i, class_name in enumerate(classes):
        class_mask = y_true == i
        class_accuracy = accuracy_score(y_true[class_mask], ensemble_pred[class_mask])
        class_count = np.sum(class_mask)
        print(f"\n   {class_name}:")
        print(f"      Accuracy: {class_accuracy:.2%}")
        print(f"      Count: {class_count} students")
        print(f"      Correctly Predicted: {np.sum((y_true == i) & (ensemble_pred == i))}")
    
    # ROC-AUC Score (for multi-class)
    try:
        roc_auc = roc_auc_score(y_true, ensemble_probs, multi_class='ovr', average='weighted')
        print("\n" + "="*70)
        print("ROC-AUC SCORE")
        print("="*70)
        print(f"\n   Weighted ROC-AUC: {roc_auc:.4f}")
        print(f"   (1.0 = Perfect, 0.5 = Random)")
    except:
        print("\n   ROC-AUC calculation skipped")
    
    # Model Comparison
    print("\n" + "="*70)
    print("MODEL COMPARISON")
    print("="*70)
    print(f"\n   Academic Model:      {acad_accuracy:.2%}")
    print(f"   Socioeconomic Model: {socio_accuracy:.2%}")
    print(f"   Ensemble Model:      {ensemble_accuracy:.2%}")
    print(f"\n   Improvement over Academic: {(ensemble_accuracy - acad_accuracy)*100:+.2f}%")
    print(f"   Improvement over Socioeconomic: {(ensemble_accuracy - socio_accuracy)*100:+.2f}%")
    
    # Feature Importance
    print("\n" + "="*70)
    print("TOP 10 MOST IMPORTANT FEATURES")
    print("="*70)
    
    print("\n📚 Academic Features:")
    academic_importance = sorted(
        predictor.feature_importance['academic'].items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]
    for i, (feature, importance) in enumerate(academic_importance, 1):
        print(f"   {i}. {feature}: {importance:.4f}")
    
    print("\n👥 Socioeconomic Features:")
    socio_importance = sorted(
        predictor.feature_importance['socioeconomic'].items(),
        key=lambda x: x[1],
        reverse=True
    )[:10]
    for i, (feature, importance) in enumerate(socio_importance, 1):
        print(f"   {i}. {feature}: {importance:.4f}")
    
    # Summary
    print("\n" + "="*70)
    print("📊 SUMMARY")
    print("="*70)
    print(f"\n   ✅ Model Accuracy: {ensemble_accuracy:.2%}")
    print(f"   ✅ Total Students Analyzed: {len(df)}")
    print(f"   ✅ Correctly Predicted: {np.sum(y_true == ensemble_pred)}")
    print(f"   ❌ Incorrectly Predicted: {np.sum(y_true != ensemble_pred)}")
    
    # Accuracy Rating
    if ensemble_accuracy >= 0.90:
        rating = "EXCELLENT ⭐⭐⭐⭐⭐"
    elif ensemble_accuracy >= 0.80:
        rating = "VERY GOOD ⭐⭐⭐⭐"
    elif ensemble_accuracy >= 0.70:
        rating = "GOOD ⭐⭐⭐"
    elif ensemble_accuracy >= 0.60:
        rating = "FAIR ⭐⭐"
    else:
        rating = "NEEDS IMPROVEMENT ⭐"
    
    print(f"\n   Rating: {rating}")
    
    # Save results
    results = {
        'overall_accuracy': float(ensemble_accuracy),
        'academic_accuracy': float(acad_accuracy),
        'socioeconomic_accuracy': float(socio_accuracy),
        'precision': float(precision_score(y_true, ensemble_pred, average='weighted')),
        'recall': float(recall_score(y_true, ensemble_pred, average='weighted')),
        'f1_score': float(f1_score(y_true, ensemble_pred, average='weighted')),
        'total_students': len(df),
        'correct_predictions': int(np.sum(y_true == ensemble_pred)),
        'incorrect_predictions': int(np.sum(y_true != ensemble_pred))
    }
    
    with open('models/accuracy_report.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n   📄 Detailed report saved to: models/accuracy_report.json")
    print("\n" + "="*70)

if __name__ == "__main__":
    evaluate_model()
