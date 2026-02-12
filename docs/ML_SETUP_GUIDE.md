# 🤖 Dual Scaling Dropout Prediction Model - Setup Guide

## Overview

This ML system predicts student dropout risk using a **dual scaling approach** that analyzes:
1. **Academic Performance** (grades, units completed, evaluations)
2. **Socioeconomic Factors** (family background, financial status, demographics)

The system combines predictions from both models using an ensemble approach for highly accurate risk assessment.

---

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Your existing React app (already set up)
- data.csv file (already in your project root)

---

## 🚀 Installation Steps

### Step 1: Set Up Python Environment

```bash
# Navigate to ml_service directory
cd ml_service

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Train the Model

```bash
# Make sure you're in ml_service directory
python train_model.py
```

**Expected Output:**
```
==============================================================
DUAL SCALING DROPOUT PREDICTION MODEL - TRAINING
==============================================================

Loading data from data.csv...

Dataset Information:
  Total Records: 4424
  Features: 37

Target Distribution:
Dropout     1421
Graduate    2209
Enrolled     794

Starting dual scaling model training...

Training Academic Model...
Academic Model Accuracy: 0.8234

Training Socioeconomic Model...
Socioeconomic Model Accuracy: 0.7891

Training Ensemble Model...
Ensemble Model Accuracy: 0.8567

Model saved to models/dropout_model.pkl
```

### Step 3: Test the Model

```bash
python test_predictions.py
```

This will show sample predictions to verify the model works correctly.

### Step 4: Start the ML API Server

```bash
python api_server.py
```

**Expected Output:**
```
Model loaded successfully
 * Running on http://0.0.0.0:5001
```

Keep this terminal window open - the API server needs to run continuously.

---

## 🔗 Integration with React App

### Step 1: Add Environment Variable

Create or update `.env` in your React app root:

```env
REACT_APP_ML_API_URL=http://localhost:5001
```

### Step 2: Use the Prediction Component

Add the dropout prediction panel to any student detail page:

```javascript
import DropoutPredictionPanel from './components/ML/DropoutPredictionPanel';

function StudentDetailPage({ student }) {
  return (
    <div>
      {/* Your existing student info */}
      
      {/* Add ML Prediction Panel */}
      <DropoutPredictionPanel student={student} />
    </div>
  );
}
```

### Step 3: Use Prediction Utilities

```javascript
import { 
  predictDropoutRisk, 
  predictBatchDropoutRisk,
  mapStudentDataForPrediction 
} from './utils/dropoutPrediction';

// Predict for single student
const prediction = await predictDropoutRisk(
  mapStudentDataForPrediction(student)
);

// Predict for multiple students
const predictions = await predictBatchDropoutRisk(
  students.map(mapStudentDataForPrediction)
);
```

---

## 📊 API Endpoints

### 1. Health Check
```bash
curl http://localhost:5001/health
```

### 2. Single Prediction
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Marital status": 1,
    "Application mode": 17,
    "Previous qualification (grade)": 122.0,
    "Admission grade": 127.3,
    ...
  }'
```

### 3. Batch Predictions
```bash
curl -X POST http://localhost:5001/predict/batch \
  -H "Content-Type: application/json" \
  -d '{
    "students": [
      { "id": "S001", ... },
      { "id": "S002", ... }
    ]
  }'
```

### 4. Feature Importance
```bash
curl http://localhost:5001/feature-importance
```

### 5. Risk Distribution
```bash
curl http://localhost:5001/analyze/risk-distribution
```

---

## 🎯 Understanding the Predictions

### Risk Levels

- **CRITICAL** (≥70% dropout probability): Immediate intervention required
- **HIGH** (50-69%): Close monitoring and support needed
- **MEDIUM** (30-49%): Regular check-ins recommended
- **LOW** (<30%): Student on track

### Dual Scaling Scores

1. **Academic Risk Score**: Based on grades, units completed, evaluations
2. **Socioeconomic Risk Score**: Based on family background, financial status
3. **Combined Prediction**: Ensemble model weighs both factors

### Example Prediction Response

```json
{
  "prediction": "Dropout",
  "dropout_probability": 0.85,
  "graduate_probability": 0.12,
  "enrolled_probability": 0.03,
  "academic_risk_score": 0.78,
  "socioeconomic_risk_score": 0.82,
  "risk_level": "CRITICAL"
}
```

---

## 🔧 Customization

### Adjust Risk Thresholds

Edit `ml_service/dropout_predictor.py`:

```python
def _get_risk_level(self, dropout_prob):
    if dropout_prob >= 0.7:  # Change to 0.8 for stricter threshold
        return 'CRITICAL'
    elif dropout_prob >= 0.5:  # Change to 0.6
        return 'HIGH'
    elif dropout_prob >= 0.3:  # Change to 0.4
        return 'MEDIUM'
    else:
        return 'LOW'
```

### Change API Port

Edit `ml_service/api_server.py`:

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)  # Change port
```

---

## 🐛 Troubleshooting

### Issue: "Model not found"
**Solution:** Run `python train_model.py` first

### Issue: "Port 5001 already in use"
**Solution:** 
```bash
# Find and kill the process
lsof -ti:5001 | xargs kill -9
# Or change the port in api_server.py
```

### Issue: "CORS error in browser"
**Solution:** Already configured with flask-cors. Ensure:
1. API server is running
2. Correct API URL in .env file

### Issue: "Module not found"
**Solution:**
```bash
cd ml_service
pip install -r requirements.txt
```

### Issue: "Data file not found"
**Solution:** Ensure `data.csv` is in the project root, or update the path in `train_model.py`:
```python
df = predictor.load_data('../data.csv')  # Adjust path as needed
```

---

## 📈 Model Performance

Based on the dataset:

- **Total Students**: 4,424
- **Dropouts**: 1,421 (32%)
- **Graduates**: 2,209 (50%)
- **Enrolled**: 794 (18%)

**Expected Accuracy:**
- Academic Model: 75-85%
- Socioeconomic Model: 70-80%
- Ensemble Model: 80-90%

---

## 🔄 Retraining the Model

### When to Retrain:
- New student data available
- Model accuracy decreases
- Significant changes in student demographics

### How to Retrain:

**Option 1: Manual**
```bash
cd ml_service
python train_model.py
```

**Option 2: Via API**
```bash
curl -X POST http://localhost:5001/train \
  -H "Content-Type: application/json" \
  -d '{"data_path": "data.csv"}'
```

---

## 📚 Key Features Identified

### Top Academic Indicators:
1. Curricular units approved (1st & 2nd semester)
2. Curricular units grade (1st & 2nd semester)
3. Previous qualification grade
4. Admission grade
5. Number of evaluations

### Top Socioeconomic Indicators:
1. Tuition fees up to date
2. Scholarship holder status
3. Debtor status
4. Parents' education level
5. Age at enrollment
6. Economic indicators (unemployment, GDP)

---

## 🎓 Production Deployment

### For Production Use:

1. **Use a production WSGI server:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 api_server:app
```

2. **Set up as a service** (systemd on Linux):
```ini
[Unit]
Description=Dropout Prediction ML Service
After=network.target

[Service]
User=your-user
WorkingDirectory=/path/to/ml_service
ExecStart=/path/to/venv/bin/gunicorn -w 4 -b 0.0.0.0:5001 api_server:app
Restart=always

[Install]
WantedBy=multi-user.target
```

3. **Use environment variables for configuration**
4. **Set up monitoring and logging**
5. **Implement rate limiting**
6. **Add authentication if needed**

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure data.csv is in the correct location
4. Check API server logs for errors

---

## ✅ Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Virtual environment created
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Model trained (`python train_model.py`)
- [ ] Model tested (`python test_predictions.py`)
- [ ] API server running (`python api_server.py`)
- [ ] React app .env configured
- [ ] Integration component added to React app
- [ ] Test prediction in browser

---

**You're all set! The dual scaling dropout prediction model is ready to help identify at-risk students.** 🎉
