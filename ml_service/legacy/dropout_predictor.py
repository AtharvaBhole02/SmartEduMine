"""
Dual Scaling Dropout Prediction Model
Uses both academic and socioeconomic factors to predict student dropout risk
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import json
from datetime import datetime

class DualScalingDropoutPredictor:
    def __init__(self):
        self.academic_scaler = StandardScaler()
        self.socioeconomic_scaler = StandardScaler()
        self.academic_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.socioeconomic_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        self.ensemble_model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.label_encoder = LabelEncoder()
        self.feature_importance = {}
        
    def load_data(self, filepath='data.csv'):
        """Load and preprocess the student data"""
        df = pd.read_csv(filepath, sep=';')
        return df
    
    def prepare_features(self, df):
        """Separate features into academic and socioeconomic categories"""
        
        # Academic features
        academic_features = [
            'Previous qualification (grade)',
            'Admission grade',
            'Curricular units 1st sem (credited)',
            'Curricular units 1st sem (enrolled)',
            'Curricular units 1st sem (evaluations)',
            'Curricular units 1st sem (approved)',
            'Curricular units 1st sem (grade)',
            'Curricular units 2nd sem (credited)',
            'Curricular units 2nd sem (enrolled)',
            'Curricular units 2nd sem (evaluations)',
            'Curricular units 2nd sem (approved)',
            'Curricular units 2nd sem (grade)'
        ]
        
        # Socioeconomic features
        socioeconomic_features = [
            'Marital status',
            'Application mode',
            'Application order',
            'Course',
            'Daytime/evening attendance\t',
            'Previous qualification',
            'Nacionality',
            "Mother's qualification",
            "Father's qualification",
            "Mother's occupation",
            "Father's occupation",
            'Displaced',
            'Educational special needs',
            'Debtor',
            'Tuition fees up to date',
            'Gender',
            'Scholarship holder',
            'Age at enrollment',
            'International',
            'Unemployment rate',
            'Inflation rate',
            'GDP'
        ]
        
        return academic_features, socioeconomic_features
    
    def train(self, df):
        """Train the dual scaling model"""
        print("Starting dual scaling model training...")
        
        # Encode target variable
        y = self.label_encoder.fit_transform(df['Target'])
        
        # Get feature sets
        academic_features, socioeconomic_features = self.prepare_features(df)
        
        # Prepare academic features
        X_academic = df[academic_features].fillna(0)
        X_academic_scaled = self.academic_scaler.fit_transform(X_academic)
        
        # Prepare socioeconomic features
        X_socioeconomic = df[socioeconomic_features].fillna(0)
        X_socioeconomic_scaled = self.socioeconomic_scaler.fit_transform(X_socioeconomic)
        
        # Split data
        X_acad_train, X_acad_test, y_train, y_test = train_test_split(
            X_academic_scaled, y, test_size=0.2, random_state=42, stratify=y
        )
        X_socio_train, X_socio_test, _, _ = train_test_split(
            X_socioeconomic_scaled, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train academic model
        print("\nTraining Academic Model...")
        self.academic_model.fit(X_acad_train, y_train)
        acad_score = self.academic_model.score(X_acad_test, y_test)
        print(f"Academic Model Accuracy: {acad_score:.4f}")
        
        # Train socioeconomic model
        print("\nTraining Socioeconomic Model...")
        self.socioeconomic_model.fit(X_socio_train, y_train)
        socio_score = self.socioeconomic_model.score(X_socio_test, y_test)
        print(f"Socioeconomic Model Accuracy: {socio_score:.4f}")
        
        # Create ensemble features
        acad_probs = self.academic_model.predict_proba(X_acad_train)
        socio_probs = self.socioeconomic_model.predict_proba(X_socio_train)
        X_ensemble_train = np.hstack([acad_probs, socio_probs])
        
        acad_probs_test = self.academic_model.predict_proba(X_acad_test)
        socio_probs_test = self.socioeconomic_model.predict_proba(X_socio_test)
        X_ensemble_test = np.hstack([acad_probs_test, socio_probs_test])
        
        # Train ensemble model
        print("\nTraining Ensemble Model...")
        self.ensemble_model.fit(X_ensemble_train, y_train)
        ensemble_score = self.ensemble_model.score(X_ensemble_test, y_test)
        print(f"Ensemble Model Accuracy: {ensemble_score:.4f}")
        
        # Evaluate
        y_pred = self.ensemble_model.predict(X_ensemble_test)
        print("\n" + "="*50)
        print("CLASSIFICATION REPORT")
        print("="*50)
        print(classification_report(y_test, y_pred, 
                                   target_names=self.label_encoder.classes_))
        
        # Store feature importance
        self.feature_importance = {
            'academic': dict(zip(academic_features, 
                               self.academic_model.feature_importances_)),
            'socioeconomic': dict(zip(socioeconomic_features, 
                                    self.socioeconomic_model.feature_importances_))
        }
        
        return {
            'academic_accuracy': acad_score,
            'socioeconomic_accuracy': socio_score,
            'ensemble_accuracy': ensemble_score
        }
    
    def predict(self, student_data):
        """Predict dropout risk for a single student with explanations"""
        academic_features, socioeconomic_features = self.prepare_features(
            pd.DataFrame([student_data])
        )
        
        # Prepare features
        X_academic = pd.DataFrame([student_data])[academic_features].fillna(0)
        X_academic_scaled = self.academic_scaler.transform(X_academic)
        
        X_socioeconomic = pd.DataFrame([student_data])[socioeconomic_features].fillna(0)
        X_socioeconomic_scaled = self.socioeconomic_scaler.transform(X_socioeconomic)
        
        # Get predictions from both models
        acad_probs = self.academic_model.predict_proba(X_academic_scaled)
        socio_probs = self.socioeconomic_model.predict_proba(X_socioeconomic_scaled)
        
        # Ensemble prediction
        X_ensemble = np.hstack([acad_probs, socio_probs])
        final_probs = self.ensemble_model.predict_proba(X_ensemble)[0]
        prediction = self.ensemble_model.predict(X_ensemble)[0]
        
        # Rule-based override for extreme cases
        dropout_prob = float(final_probs[0])
        dropout_prob = self._apply_rule_based_adjustments(student_data, dropout_prob)
        
        # Generate explanations
        explanations = self._generate_explanations(student_data, X_academic.iloc[0], X_socioeconomic.iloc[0])
        
        return {
            'prediction': self.label_encoder.inverse_transform([prediction])[0],
            'dropout_probability': dropout_prob,
            'graduate_probability': float(final_probs[1]) if len(final_probs) > 1 else 0,
            'enrolled_probability': float(final_probs[2]) if len(final_probs) > 2 else 0,
            'academic_risk_score': float(acad_probs[0][0]),
            'socioeconomic_risk_score': float(socio_probs[0][0]),
            'risk_level': self._get_risk_level(dropout_prob),
            'explanations': explanations
        }
    
    def _apply_rule_based_adjustments(self, student_data, dropout_prob):
        """Apply rule-based adjustments for extreme cases"""
        # Get key metrics
        sem1_enrolled = student_data.get('Curricular units 1st sem (enrolled)', 0)
        sem1_approved = student_data.get('Curricular units 1st sem (approved)', 0)
        sem2_enrolled = student_data.get('Curricular units 2nd sem (enrolled)', 0)
        sem2_approved = student_data.get('Curricular units 2nd sem (approved)', 0)
        sem1_grade = student_data.get('Curricular units 1st sem (grade)', 0)
        sem2_grade = student_data.get('Curricular units 2nd sem (grade)', 0)
        
        # Calculate pass rates
        sem1_pass_rate = (sem1_approved / sem1_enrolled * 100) if sem1_enrolled > 0 else 0
        sem2_pass_rate = (sem2_approved / sem2_enrolled * 100) if sem2_enrolled > 0 else 0
        avg_pass_rate = (sem1_pass_rate + sem2_pass_rate) / 2 if (sem1_enrolled > 0 or sem2_enrolled > 0) else 0
        
        # Average grade
        avg_grade = (sem1_grade + sem2_grade) / 2 if (sem1_grade > 0 or sem2_grade > 0) else 0
        
        # CRITICAL RISK: Very low pass rate (< 40%) AND very low grades (< 8/20)
        # Changed from OR to AND to be less aggressive
        if avg_pass_rate < 40 and avg_grade < 8:
            dropout_prob = max(dropout_prob, 0.75)  # Ensure at least 75% risk
        
        # HIGH RISK: Low pass rate (< 50%) AND low grades (< 10/20)
        elif avg_pass_rate < 50 and avg_grade < 10:
            dropout_prob = max(dropout_prob, 0.60)  # Ensure at least 60% risk
        
        # HIGH RISK: Either very low pass rate OR very low grades (but not both)
        elif avg_pass_rate < 40 or avg_grade < 8:
            dropout_prob = max(dropout_prob, 0.55)  # Ensure at least 55% risk
        
        # MEDIUM RISK: Moderate pass rate (< 60%) OR moderate grades (< 11/20)
        elif avg_pass_rate < 60 or avg_grade < 11:
            dropout_prob = max(dropout_prob, 0.40)  # Ensure at least 40% risk
        
        # Additional risk factors
        debtor = student_data.get('Debtor', 0)
        tuition_up_to_date = student_data.get('Tuition fees up to date', 1)
        
        # Financial issues increase risk
        if debtor == 1 or tuition_up_to_date == 0:
            dropout_prob = min(dropout_prob * 1.15, 0.95)  # Increase by 15%, cap at 95%
        
        return dropout_prob
    
    def _generate_explanations(self, raw_data, academic_data, socioeconomic_data):
        """Generate human-readable explanations for the prediction"""
        explanations = {
            'risk_factors': [],
            'protective_factors': [],
            'key_concerns': [],
            'recommendations': []
        }
        
        # Academic risk factors
        sem1_approved = raw_data.get('Curricular units 1st sem (approved)', 0)
        sem1_enrolled = raw_data.get('Curricular units 1st sem (enrolled)', 0)
        sem2_approved = raw_data.get('Curricular units 2nd sem (approved)', 0)
        sem2_enrolled = raw_data.get('Curricular units 2nd sem (enrolled)', 0)
        sem1_grade = raw_data.get('Curricular units 1st sem (grade)', 0)
        sem2_grade = raw_data.get('Curricular units 2nd sem (grade)', 0)
        
        # Check academic performance
        if sem1_enrolled > 0:
            sem1_pass_rate = (sem1_approved / sem1_enrolled) * 100
            if sem1_pass_rate < 60:
                explanations['risk_factors'].append(f"Low course completion rate in semester 1: {sem1_pass_rate:.1f}%")
                explanations['key_concerns'].append("Academic Performance")
                explanations['recommendations'].append("Consider academic tutoring or study skills workshop")
        
        if sem2_enrolled > 0:
            sem2_pass_rate = (sem2_approved / sem2_enrolled) * 100
            if sem2_pass_rate < 60:
                explanations['risk_factors'].append(f"Low course completion rate in semester 2: {sem2_pass_rate:.1f}%")
        
        if sem1_grade > 0 and sem1_grade < 10:
            explanations['risk_factors'].append(f"Low grades in semester 1: {sem1_grade:.1f}/20")
            explanations['recommendations'].append("Academic support and personalized learning plan needed")
        
        if sem2_grade > 0 and sem2_grade < 10:
            explanations['risk_factors'].append(f"Low grades in semester 2: {sem2_grade:.1f}/20")
        
        # Socioeconomic risk factors
        debtor = raw_data.get('Debtor', 0)
        tuition_up_to_date = raw_data.get('Tuition fees up to date', 1)
        scholarship = raw_data.get('Scholarship holder', 0)
        
        if debtor == 1:
            explanations['risk_factors'].append("Outstanding debt")
            explanations['key_concerns'].append("Financial Issues")
            explanations['recommendations'].append("Connect with financial aid office for payment plans")
        
        if tuition_up_to_date == 0:
            explanations['risk_factors'].append("Tuition fees not up to date")
            explanations['key_concerns'].append("Financial Issues")
            explanations['recommendations'].append("Urgent: Address tuition payment status")
        
        # Protective factors
        if scholarship == 1:
            explanations['protective_factors'].append("Scholarship holder - financial support in place")
        
        if sem1_grade >= 14 or sem2_grade >= 14:
            explanations['protective_factors'].append("Strong academic performance")
        
        if sem1_enrolled > 0 and (sem1_approved / sem1_enrolled) >= 0.8:
            explanations['protective_factors'].append("High course completion rate")
        
        # Additional recommendations based on risk level
        if len(explanations['risk_factors']) >= 3:
            explanations['recommendations'].append("Immediate counselor intervention recommended")
            explanations['recommendations'].append("Consider comprehensive support plan")
        
        return explanations
    
    def _get_risk_level(self, dropout_prob):
        """Categorize risk level"""
        if dropout_prob >= 0.6:
            return 'CRITICAL'
        elif dropout_prob >= 0.4:
            return 'HIGH'
        elif dropout_prob >= 0.25:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def save_model(self, filepath='ml_service/models/dropout_model.pkl'):
        """Save the trained model"""
        model_data = {
            'academic_scaler': self.academic_scaler,
            'socioeconomic_scaler': self.socioeconomic_scaler,
            'academic_model': self.academic_model,
            'socioeconomic_model': self.socioeconomic_model,
            'ensemble_model': self.ensemble_model,
            'label_encoder': self.label_encoder,
            'feature_importance': self.feature_importance,
            'trained_date': datetime.now().isoformat()
        }
        joblib.dump(model_data, filepath)
        print(f"\nModel saved to {filepath}")
    
    def load_model(self, filepath='ml_service/models/dropout_model.pkl'):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        self.academic_scaler = model_data['academic_scaler']
        self.socioeconomic_scaler = model_data['socioeconomic_scaler']
        self.academic_model = model_data['academic_model']
        self.socioeconomic_model = model_data['socioeconomic_model']
        self.ensemble_model = model_data['ensemble_model']
        self.label_encoder = model_data['label_encoder']
        self.feature_importance = model_data['feature_importance']
        print(f"Model loaded from {filepath}")
        print(f"Trained on: {model_data.get('trained_date', 'Unknown')}")


if __name__ == "__main__":
    # Train the model
    predictor = DualScalingDropoutPredictor()
    df = predictor.load_data('data.csv')
    
    print(f"Loaded {len(df)} student records")
    print(f"Target distribution:\n{df['Target'].value_counts()}\n")
    
    # Train
    results = predictor.train(df)
    
    # Save
    predictor.save_model()
    
    print("\n" + "="*50)
    print("MODEL TRAINING COMPLETE")
    print("="*50)
