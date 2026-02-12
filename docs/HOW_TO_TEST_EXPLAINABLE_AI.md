# ✅ How to Test Explainable AI & Real-Time ML Integration

## Quick Verification Checklist

Follow these steps to verify everything is working:

---

## Step 1: Check ML Service is Running ✅

### Terminal Check:
```bash
# Check if ML service is running
curl http://localhost:5001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "Dropout Prediction API",
  "model_loaded": true
}
```

**If not running:**
```bash
cd ml_service
python3 api_server.py
```

---

## Step 2: Open Browser Console 🔍

1. Open your React app: `http://localhost:3000`
2. Press `F12` or `Cmd+Option+I` (Mac) to open Developer Tools
3. Go to **Console** tab

**Look for:**
```
ML Service Status: Connected
```

**If you see:**
```
ML Service not available
```
→ Go back to Step 1 and start the ML service

---

## Step 3: Test Real-Time ML Integration 🤖

### Method A: Add a New Student

1. **Go to Dashboard** (`http://localhost:3000/dashboard`)

2. **Click "Add Student" button** (+ icon)

3. **Fill in student data:**
   ```
   Name: Test Student
   Email: test@example.com
   Phone: +1234567890
   Attendance: 55
   Avg Grade: 60
   Behavioral Score: 4
   ```

4. **Click "Add Student"**

5. **Check Console for:**
   ```javascript
   ML Service Status: Connected
   Predicting risk for Test Student...
   ```

6. **Look for Toast Notification:**
   - Should show: "Test Student added successfully!"
   - If ML works: May show risk alert

7. **Check Student Card:**
   - Should show risk level badge
   - Should have ML prediction data

---

### Method B: Import CSV File

1. **Go to Dashboard**

2. **Scroll to "Data Management" section**

3. **Click "Import CSV"**

4. **Select your `academic_records_sample.csv`**

5. **Watch for:**
   - Toast: "100 students imported. Running ML predictions..."
   - Console: "Predicting risk for 100 students..."
   - Toast: "ML predictions complete! Found X high-risk students."

6. **Check imported students:**
   - Should have risk levels
   - Should have predictions

---

## Step 4: Test Explainable AI 💡

### View Student Details:

1. **Click on any student card** in the dashboard

2. **Look for "🤖 AI Dropout Risk Prediction" panel**

3. **Click "Predict Dropout Risk" button**

4. **Wait for prediction to load**

5. **You should see:**

   #### A. Risk Level Badge
   ```
   Risk Level: [CRITICAL/HIGH/MEDIUM/LOW]
   ```

   #### B. Probabilities with Progress Bars
   ```
   Dropout Risk: XX%
   Graduate Probability: XX%
   ```

   #### C. Dual Scaling Scores
   ```
   📚 Academic Risk: XX%
   👥 Socioeconomic Risk: XX%
   ```

   #### D. **NEW: Explainable AI Section** ⭐
   This should appear below the prediction:

   ```
   ┌─────────────────────────────────────────┐
   │ Why is [Student Name] at [RISK] Risk?  │
   ├─────────────────────────────────────────┤
   │                                         │
   │ 🔴 Key Concerns                         │
   │   • Academic Performance                │
   │   • Financial Issues                    │
   │                                         │
   │ ⚠️ Risk Factors                         │
   │   • Low course completion rate: 45.2%   │
   │   • Low grades in semester 2: 8.5/20    │
   │   • Outstanding debt                    │
   │                                         │
   │ ✅ Protective Factors                   │
   │   • Scholarship holder                  │
   │                                         │
   │ 💡 Recommended Actions                  │
   │   → Consider academic tutoring          │
   │   → Connect with financial aid office   │
   │   → Immediate counselor intervention    │
   └─────────────────────────────────────────┘
   ```

---

## Step 5: Verify in Browser DevTools 🔧

### Check Network Tab:

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Click "Predict Dropout Risk"**
4. **Look for request to:** `http://localhost:5001/predict`

**Click on the request and check:**

#### Request Payload:
```json
{
  "Marital status": 1,
  "Attendance (%)": 55,
  "CGPA": 6.0,
  ...
}
```

#### Response:
```json
{
  "success": true,
  "prediction": {
    "prediction": "Dropout",
    "risk_level": "HIGH",
    "dropout_probability": 0.75,
    "academic_risk_score": 0.68,
    "socioeconomic_risk_score": 0.72,
    "explanations": {
      "risk_factors": [...],
      "protective_factors": [...],
      "key_concerns": [...],
      "recommendations": [...]
    }
  }
}
```

**✅ If you see `explanations` in the response, Explainable AI is working!**

---

## Step 6: Visual Verification Checklist ✅

Go through this checklist:

### Dashboard View:
- [ ] Students show risk level badges (CRITICAL/HIGH/MEDIUM/LOW)
- [ ] Risk colors are correct (red/orange/yellow/green)
- [ ] Student cards display risk scores

### Student Detail Modal:
- [ ] "AI Dropout Risk Prediction" panel visible
- [ ] "Predict Dropout Risk" button works
- [ ] Prediction results show up
- [ ] Progress bars animate
- [ ] Dual scaling scores display

### Explainable AI Section:
- [ ] "Why is [Name] at [RISK] Risk?" heading shows
- [ ] Key Concerns section appears (if applicable)
- [ ] Risk Factors list shows (if applicable)
- [ ] Protective Factors list shows (if applicable)
- [ ] Recommended Actions section appears
- [ ] Icons display correctly (⚠️, ✅, 💡)
- [ ] Colors match risk level

### Real-Time Integration:
- [ ] Adding student triggers automatic prediction
- [ ] CSV import triggers batch predictions
- [ ] Toast notifications show prediction status
- [ ] High-risk alerts appear automatically

---

## Step 7: Test Different Risk Levels 🎯

Create test students with different risk profiles:

### Test Case 1: LOW RISK
```
Attendance: 90
Avg Grade: 85
Behavioral Score: 9
```
**Expected:** 
- Risk Level: LOW
- Few or no risk factors
- Multiple protective factors

### Test Case 2: MEDIUM RISK
```
Attendance: 70
Avg Grade: 65
Behavioral Score: 6
```
**Expected:**
- Risk Level: MEDIUM
- Some risk factors
- Some protective factors
- Moderate recommendations

### Test Case 3: HIGH RISK
```
Attendance: 50
Avg Grade: 55
Behavioral Score: 3
```
**Expected:**
- Risk Level: HIGH or CRITICAL
- Multiple risk factors
- Few protective factors
- Urgent recommendations

---

## Step 8: Console Debugging 🐛

### Check for Errors:

Open Console and look for:

**✅ Good Messages:**
```
ML Service Status: Connected
Predicting risk for [Student Name]...
Prediction successful
```

**❌ Error Messages:**
```
ML Service not available
Failed to fetch
CORS error
```

### If You See Errors:

1. **"ML Service not available"**
   - Start ML service: `cd ml_service && python3 api_server.py`

2. **"CORS error"**
   - ML service should have flask-cors installed
   - Check: `pip list | grep flask-cors`

3. **"Failed to fetch"**
   - Check ML service is on port 5001
   - Check .env has: `REACT_APP_ML_API_URL=http://localhost:5001`

---

## Step 9: Test Batch Predictions 📊

### Import CSV and Monitor:

1. **Open Console** (F12)
2. **Import CSV file**
3. **Watch Console for:**

```javascript
Predicting risk for 100 students...
Batch prediction started
Processing batch...
Batch prediction complete
Found 25 high-risk students
```

4. **Check Toast Notifications:**
   - "100 students imported. Running ML predictions..."
   - "ML predictions complete! Found X high-risk students."

5. **Verify Students:**
   - All imported students should have risk levels
   - High-risk students should show in alerts

---

## Step 10: Verify Data Persistence 💾

### Check Student Data:

1. **Click on a predicted student**
2. **Open Browser DevTools**
3. **Go to Console**
4. **Type:**
```javascript
// Get students from localStorage or state
console.log(localStorage.getItem('students'))
```

**Look for:**
```json
{
  "id": "...",
  "name": "...",
  "riskLevel": "HIGH",
  "explanations": {
    "risk_factors": [...],
    "recommendations": [...]
  }
}
```

---

## 🎯 Quick Test Script

Run this in Browser Console to test everything:

```javascript
// Test ML Service Connection
fetch('http://localhost:5001/health')
  .then(r => r.json())
  .then(d => console.log('✅ ML Service:', d.status))
  .catch(e => console.error('❌ ML Service not available'));

// Test Prediction
const testStudent = {
  'Marital status': 1,
  'Attendance (%)': 55,
  'CGPA': 6.0,
  'Behavior Score': 4,
  // ... other fields
};

fetch('http://localhost:5001/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testStudent)
})
  .then(r => r.json())
  .then(d => {
    console.log('✅ Prediction:', d.prediction.risk_level);
    console.log('✅ Explanations:', d.prediction.explanations);
  })
  .catch(e => console.error('❌ Prediction failed'));
```

---

## ✅ Success Indicators

You'll know everything is working when you see:

### In Console:
- ✅ "ML Service Status: Connected"
- ✅ Prediction logs
- ✅ No error messages

### In UI:
- ✅ Risk level badges on students
- ✅ Prediction panel shows results
- ✅ **Explainable AI section appears**
- ✅ Risk factors listed
- ✅ Recommendations shown
- ✅ Toast notifications work

### In Network Tab:
- ✅ Requests to `/predict` succeed
- ✅ Response includes `explanations` object
- ✅ Status code 200

---

## 🐛 Troubleshooting

### Issue: No Explainable AI section shows

**Check:**
1. ML service is running
2. Prediction was successful
3. Response includes `explanations` field
4. ExplainableAI component is imported

**Fix:**
```bash
# Restart ML service
cd ml_service
python3 api_server.py
```

### Issue: Predictions not automatic

**Check:**
1. `realTimeMLIntegration.js` is imported
2. `mlIntegration.autoPredictStudent()` is called
3. Console shows "ML Service Status: Connected"

**Fix:**
- Check imports in EnhancedDashboard.js
- Verify ML service is running

### Issue: Explanations are empty

**Possible reasons:**
- Student data incomplete
- Not enough information to generate explanations
- ML model needs more data

**This is normal** - explanations are generated based on available data

---

## 📸 Screenshots to Verify

Take screenshots of:

1. **Dashboard with risk badges**
2. **Student detail with prediction panel**
3. **Explainable AI section showing:**
   - Key Concerns
   - Risk Factors
   - Protective Factors
   - Recommendations
4. **Console showing "ML Service Status: Connected"**
5. **Network tab showing successful `/predict` request**

---

## 🎉 You're All Set!

If you can see:
- ✅ Risk predictions
- ✅ Explainable AI section
- ✅ Risk factors and recommendations
- ✅ Automatic predictions on add/import

**Then Explainable AI and Real-Time ML Integration are working perfectly!** 🚀

---

## Need Help?

If something isn't working:
1. Check ML service is running
2. Check browser console for errors
3. Verify .env has correct API URL
4. Try restarting both React app and ML service
