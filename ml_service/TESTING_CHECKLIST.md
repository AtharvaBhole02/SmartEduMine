# ✅ Testing Checklist - Dropout Prediction Model

## Pre-Testing Setup

- [ ] Python 3.8+ installed
- [ ] Virtual environment created
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] data.csv file accessible

## Model Training Tests

- [ ] Run `python train_model.py`
- [ ] Model trains without errors
- [ ] Accuracy > 75% for all models
- [ ] Model file created at `models/dropout_model.pkl`
- [ ] Feature importance displayed

## Model Testing

- [ ] Run `python test_predictions.py`
- [ ] Predictions generated for sample students
- [ ] Risk levels assigned correctly
- [ ] Probabilities sum to ~1.0

## API Server Tests

- [ ] Run `python api_server.py`
- [ ] Server starts on port 5001
- [ ] No error messages in console

### Health Check
```bash
curl http://localhost:5001/health
```
- [ ] Returns `{"status": "healthy"}`

### Single Prediction
```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d @test_student.json
```
- [ ] Returns prediction with risk_level
- [ ] dropout_probability between 0 and 1
- [ ] academic_risk_score present
- [ ] socioeconomic_risk_score present

### Feature Importance
```bash
curl http://localhost:5001/feature-importance
```
- [ ] Returns academic features
- [ ] Returns socioeconomic features
- [ ] Features sorted by importance

## React Integration Tests

- [ ] API URL configured in .env
- [ ] DropoutPredictionPanel component imports
- [ ] Component renders without errors
- [ ] "Predict Dropout Risk" button appears
- [ ] Clicking button triggers prediction
- [ ] Risk level badge displays
- [ ] Progress bars show correctly
- [ ] Dual scaling scores visible

## Batch Analysis Tests

- [ ] Run `python batch_analyze.py`
- [ ] Processes all students
- [ ] Creates reports/ directory
- [ ] Generates CSV report
- [ ] Generates JSON summary
- [ ] Shows top 20 high-risk students

## Error Handling Tests

- [ ] API handles missing data gracefully
- [ ] Invalid requests return error messages
- [ ] React component shows error states
- [ ] Service unavailable message displays

## Performance Tests

- [ ] Single prediction < 1 second
- [ ] Batch of 100 students < 10 seconds
- [ ] API server stable under load
- [ ] No memory leaks

## Documentation Tests

- [ ] README.md is clear
- [ ] Setup guide is accurate
- [ ] API examples work
- [ ] Code comments are helpful

## Final Checks

- [ ] All tests passing
- [ ] No console errors
- [ ] Documentation complete
- [ ] Ready for production use

---

## Test Data Sample

Create `test_student.json`:
```json
{
  "Marital status": 1,
  "Application mode": 17,
  "Application order": 5,
  "Course": 171,
  "Daytime/evening attendance\t": 1,
  "Previous qualification": 1,
  "Previous qualification (grade)": 122.0,
  "Nacionality": 1,
  "Mother's qualification": 19,
  "Father's qualification": 12,
  "Mother's occupation": 5,
  "Father's occupation": 9,
  "Admission grade": 127.3,
  "Displaced": 1,
  "Educational special needs": 0,
  "Debtor": 0,
  "Tuition fees up to date": 1,
  "Gender": 1,
  "Scholarship holder": 0,
  "Age at enrollment": 20,
  "International": 0,
  "Curricular units 1st sem (credited)": 0,
  "Curricular units 1st sem (enrolled)": 0,
  "Curricular units 1st sem (evaluations)": 0,
  "Curricular units 1st sem (approved)": 0,
  "Curricular units 1st sem (grade)": 0.0,
  "Curricular units 1st sem (without evaluations)": 0,
  "Curricular units 2nd sem (credited)": 0,
  "Curricular units 2nd sem (enrolled)": 0,
  "Curricular units 2nd sem (evaluations)": 0,
  "Curricular units 2nd sem (approved)": 0,
  "Curricular units 2nd sem (grade)": 0.0,
  "Curricular units 2nd sem (without evaluations)": 0,
  "Unemployment rate": 10.8,
  "Inflation rate": 1.4,
  "GDP": 1.74
}
```

---

**Once all items are checked, your ML system is ready!** ✅
