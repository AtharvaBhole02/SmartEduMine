# Dual Scaling Dropout Prediction Model

A machine learning system that predicts student dropout risk using a dual scaling approach that analyzes both **academic performance** and **socioeconomic factors**.

## 🎯 Model Architecture

### Dual Scaling Approach

The model uses three layers:

1. **Academic Model** - Random Forest analyzing:
   - Previous qualification grades
   - Admission grades
   - Curricular units (enrolled, approved, grades)
   - Semester performance metrics

2. **Socioeconomic Model** - Gradient Boosting analyzing:
   - Family background (parents' education, occupation)
   - Financial status (debtor, tuition fees, scholarship)
   - Demographics (age, gender, marital status)
   - Economic indicators (unemployment, inflation, GDP)

3. **Ensemble Model** - Combines predictions from both models for final risk assessment

## 📊 Features

- **Dual perspective analysis**: Academic + Socioeconomic factors
- **Risk categorization**: CRITICAL, HIGH, MEDIUM, LOW
- **Feature importance tracking**: Identifies key dropout indicators
- **REST API**: Easy integration with existing systems
- **Batch predictions**: Process multiple students at once

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python train_model.py
```

This will:
- Load data from `data.csv`
- Train the dual scaling model
- Save the trained model to `models/dropout_model.pkl`
- Display accuracy metrics and feature importance

### 3. Test the Model

```bash
python test_predictions.py
```

### 4. Start the API Server

```bash
python api_server.py
```

The API will be available at `http://localhost:5001`

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Predict Single Student
```bash
POST /predict
Content-Type: application/json

{
  "Marital status": 1,
  "Application mode": 17,
  "Previous qualification (grade)": 122.0,
  "Admission grade": 127.3,
  ...
}
```

Response:
```json
{
  "success": true,
  "prediction": {
    "prediction": "Dropout",
    "dropout_probability": 0.85,
    "graduate_probability": 0.12,
    "enrolled_probability": 0.03,
    "academic_risk_score": 0.78,
    "socioeconomic_risk_score": 0.82,
    "risk_level": "CRITICAL"
  }
}
```

### Batch Predictions
```bash
POST /predict/batch
Content-Type: application/json

{
  "students": [
    { "id": "S001", ... },
    { "id": "S002", ... }
  ]
}
```

### Feature Importance
```bash
GET /feature-importance
```

### Risk Distribution Analysis
```bash
GET /analyze/risk-distribution?data_path=data.csv
```

### Retrain Model
```bash
POST /train
Content-Type: application/json

{
  "data_path": "data.csv"
}
```

## 🔗 Integration with React App

Add this utility to your React app:

```javascript
// src/utils/dropoutPrediction.js
const API_URL = 'http://localhost:5001';

export const predictDropoutRisk = async (studentData) => {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  return response.json();
};

export const predictBatchDropoutRisk = async (students) => {
  const response = await fetch(`${API_URL}/predict/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ students })
  });
  return response.json();
};
```

## 📈 Model Performance

The dual scaling approach typically achieves:
- **Academic Model**: 75-85% accuracy
- **Socioeconomic Model**: 70-80% accuracy
- **Ensemble Model**: 80-90% accuracy

## 🎓 Key Features Identified

### Top Academic Indicators:
1. Curricular units approved (1st & 2nd semester)
2. Curricular units grade (1st & 2nd semester)
3. Previous qualification grade
4. Admission grade

### Top Socioeconomic Indicators:
1. Tuition fees up to date
2. Scholarship holder status
3. Debtor status
4. Parents' education level
5. Age at enrollment

## 🔧 Customization

### Adjust Risk Thresholds

Edit `dropout_predictor.py`:

```python
def _get_risk_level(self, dropout_prob):
    if dropout_prob >= 0.7:  # Adjust threshold
        return 'CRITICAL'
    elif dropout_prob >= 0.5:
        return 'HIGH'
    # ...
```

### Add New Features

Modify the `prepare_features()` method to include additional data points.

## 📝 Data Format

The model expects CSV data with semicolon separators (`;`) containing:
- Academic performance metrics
- Socioeconomic indicators
- Target variable: "Dropout", "Graduate", or "Enrolled"

## 🐛 Troubleshooting

**Model not found error:**
```bash
python train_model.py
```

**Port already in use:**
```bash
# Change port in api_server.py
app.run(host='0.0.0.0', port=5002, debug=True)
```

**CORS issues:**
Already configured with `flask-cors`. Ensure API server is running.

## 📚 Dependencies

- pandas: Data manipulation
- numpy: Numerical operations
- scikit-learn: Machine learning models
- joblib: Model serialization
- flask: API server
- flask-cors: Cross-origin requests

## 🎯 Next Steps

1. Train the model with your data
2. Test predictions
3. Start the API server
4. Integrate with your React dashboard
5. Monitor and retrain periodically with new data
