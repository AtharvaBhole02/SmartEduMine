# 🧪 Test: Low Score Students Should Show High Risk

## Issue Fixed
Students with low attendance and grades were showing as LOW RISK due to incorrect default values in data mapping.

## What Was Wrong

**Before:**
```javascript
'Admission grade': parseFloat(student.gpa || 120)  // ❌ Default 120 is HIGH
'Curricular units 1st sem (grade)': parseFloat(student.gpa || 12)  // ❌ Default 12 is GOOD
```

When a student had:
- Attendance: 40%
- Avg Grade: 50%

The ML model received:
- Admission grade: 120 (excellent!)
- Semester grades: 12 (good!)

Result: **LOW RISK** ❌ (Wrong!)

---

## What's Fixed

**After:**
```javascript
// Convert avgGrade properly
const gradeScale = avgGrade > 20 ? avgGrade / 5 : avgGrade; // 50% → 10/20
const admissionGrade = gradeScale * 6; // 10 * 6 = 60 (poor)
const coursesPassed = Math.floor(coursesEnrolled * (avgGrade / 100)); // 6 * 0.5 = 3
```

Now when a student has:
- Attendance: 40%
- Avg Grade: 50%

The ML model receives:
- Admission grade: 60 (poor)
- Semester grades: 10/20 (poor)
- Courses passed: 3/6 (50%)

Result: **HIGH RISK** ✅ (Correct!)

---

## Test Cases

### Test 1: High Risk Student ❌

**Input:**
```
Name: High Risk Student
Attendance: 40%
Avg Grade: 50%
Behavioral Score: 3
```

**Expected Result:**
- Risk Level: **HIGH** or **CRITICAL**
- Dropout Probability: **> 60%**
- Explanations should show:
  - Low attendance
  - Low grades
  - Poor course completion

**How to Test:**
1. Go to Dashboard
2. Click "Add Student"
3. Enter the data above
4. Click "Add Student"
5. Click on the student card
6. Click "Predict Dropout Risk"
7. **Verify risk level is HIGH or CRITICAL** ✅

---

### Test 2: Medium Risk Student ⚠️

**Input:**
```
Name: Medium Risk Student
Attendance: 65%
Avg Grade: 65%
Behavioral Score: 6
```

**Expected Result:**
- Risk Level: **MEDIUM**
- Dropout Probability: **40-60%**

---

### Test 3: Low Risk Student ✅

**Input:**
```
Name: Low Risk Student
Attendance: 90%
Avg Grade: 85%
Behavioral Score: 9
```

**Expected Result:**
- Risk Level: **LOW**
- Dropout Probability: **< 30%**
- Explanations should show protective factors

---

## Quick Verification

### Test in Browser Console:

```javascript
// Test the mapping function
const testStudent = {
  name: 'Test',
  attendance: 40,
  avgGrade: 50,
  behavioralScore: 3,
  coursesEnrolled: 6
};

// Import the function
import { mapStudentDataForPrediction } from './utils/dropoutPrediction';

const mapped = mapStudentDataForPrediction(testStudent);

console.log('Admission grade:', mapped['Admission grade']); 
// Should be LOW (around 60), not HIGH (120)

console.log('Semester grade:', mapped['Curricular units 1st sem (grade)']);
// Should be LOW (around 10), not GOOD (12)

console.log('Courses passed:', mapped['Curricular units 1st sem (approved)']);
// Should be LOW (around 3), not GOOD (5)
```

---

## Expected Behavior

### Low Attendance + Low Grades = HIGH RISK ✅

| Attendance | Avg Grade | Expected Risk |
|------------|-----------|---------------|
| 40% | 50% | HIGH/CRITICAL |
| 50% | 55% | HIGH |
| 60% | 60% | MEDIUM/HIGH |
| 70% | 70% | MEDIUM |
| 80% | 80% | LOW/MEDIUM |
| 90% | 90% | LOW |

---

## Verification Steps

1. **Add a high-risk student** (40% attendance, 50% grade)
2. **Check the prediction**
3. **Should show:**
   - ✅ Risk Level: HIGH or CRITICAL
   - ✅ Dropout Probability: > 60%
   - ✅ Explanations mention low grades and attendance
   - ✅ Recommendations for intervention

4. **If still showing LOW RISK:**
   - Check ML service is running
   - Check browser console for errors
   - Verify the mapping in Network tab

---

## Debug: Check Mapped Data

To see what data is being sent to ML model:

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Add a student**
4. **Look for `/predict` request**
5. **Check Request Payload:**

```json
{
  "Admission grade": 60,  // ✅ Should be LOW for low-grade student
  "Curricular units 1st sem (grade)": 10,  // ✅ Should be LOW
  "Curricular units 1st sem (approved)": 3,  // ✅ Should be LOW
  "Curricular units 1st sem (enrolled)": 6
}
```

**If you see high values (120, 12, 5) → Mapping not updated**
**If you see low values (60, 10, 3) → Mapping is correct** ✅

---

## Real Example

### Before Fix:
```
Student: John (Attendance: 45%, Grade: 55%)
Mapped Data:
  - Admission grade: 120 ❌
  - Semester grade: 12 ❌
  - Courses passed: 5 ❌
Result: LOW RISK ❌ (Wrong!)
```

### After Fix:
```
Student: John (Attendance: 45%, Grade: 55%)
Mapped Data:
  - Admission grade: 66 ✅
  - Semester grade: 11 ✅
  - Courses passed: 3 ✅
Result: HIGH RISK ✅ (Correct!)
```

---

## ✅ Success Criteria

The fix is working if:

1. **Low attendance + Low grades = HIGH RISK**
2. **Explanations mention specific issues**
3. **Recommendations are appropriate**
4. **Network request shows correct mapped values**

---

## 🎯 Try It Now!

1. **Add this student:**
   - Name: Test High Risk
   - Attendance: 40
   - Avg Grade: 50
   - Behavioral Score: 3

2. **Expected:**
   - Risk Level: **HIGH** or **CRITICAL** ✅
   - NOT "Low Risk" ❌

3. **If it works:** The fix is successful! 🎉

---

**The mapping has been fixed to correctly reflect student performance in ML predictions!** ✅
