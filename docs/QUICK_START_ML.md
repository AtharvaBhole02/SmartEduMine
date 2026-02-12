# 🚀 Quick Start - Dropout Prediction ML Model

## 3-Step Setup

### 1️⃣ Install & Train (5 minutes)
```bash
cd ml_service
pip install -r requirements.txt
python train_model.py
```

### 2️⃣ Start API Server
```bash
python api_server.py
```
API runs at: `http://localhost:5001`

### 3️⃣ Use in React
```javascript
import DropoutPredictionPanel from './components/ML/DropoutPredictionPanel';

<DropoutPredictionPanel student={student} />
```

## What You Get

**Prediction Output:**
- Risk Level: CRITICAL/HIGH/MEDIUM/LOW
- Dropout Probability: 0-100%
- Academic Risk Score
- Socioeconomic Risk Score

## Files Created

- `ml_service/` - ML service (9 files)
- `src/utils/dropoutPrediction.js` - API utilities
- `src/components/ML/DropoutPredictionPanel.js` - React component
- Documentation files (3 files)

## Need Help?

📖 **ML_SETUP_GUIDE.md** - Detailed setup  
📖 **DUAL_SCALING_MODEL_DOCUMENTATION.md** - Full docs  
📖 **ML_MODEL_SUMMARY.md** - Overview
