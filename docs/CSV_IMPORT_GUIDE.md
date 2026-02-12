# 📊 CSV Import Guide - Fixed!

## ✅ Issue Fixed

**Problem:** Getting `toLowerCase()` error when importing CSV files

**Solution:** 
1. Fixed CSV import to handle missing fields
2. Added safe null checks in filter logic
3. Auto-generates required fields (ID, risk score, status)

---

## 📝 CSV Format

### Required Columns

Your CSV file should have these columns (in any order):

```csv
name,email,phone,attendance,avgGrade,behavioralScore
```

### Optional Columns

These will be auto-generated if missing:
- `id` - Auto-generated unique ID
- `riskScore` - Calculated from attendance, grades, behavior
- `status` - Determined from risk score (Low/Medium/High Risk)
- `lastActivity` - Set to "Just added"

---

## 📋 Sample CSV Format

### Minimal Format (Required Fields Only)

```csv
name,email,phone,attendance,avgGrade,behavioralScore
John Doe,john@example.com,+1234567890,85,78,8
Jane Smith,jane@example.com,+1234567891,92,88,9
Mike Johnson,mike@example.com,+1234567892,65,70,6
```

### Full Format (All Fields)

```csv
id,name,email,phone,attendance,avgGrade,behavioralScore,riskScore,status
BBCO22122,John Doe,john@example.com,+1234567890,85,78,8,0.25,Low Risk
BBCO22120,Jane Smith,jane@example.com,+1234567891,92,88,9,0.15,Low Risk
BBCO22129,Mike Johnson,mike@example.com,+1234567892,65,70,6,0.55,Medium Risk
```

---

## 🎯 Field Descriptions

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| name | Text | - | Student's full name |
| email | Text | - | Email address |
| phone | Text | - | Phone number |
| attendance | Number | 0-100 | Attendance percentage |
| avgGrade | Number | 0-100 | Average grade percentage |
| behavioralScore | Number | 0-10 | Behavioral rating (10 = excellent) |
| id | Text | - | Unique student ID (auto-generated if missing) |
| riskScore | Number | 0-1 | Dropout risk (auto-calculated if missing) |
| status | Text | - | Risk level (auto-determined if missing) |

---

## 🔄 How Import Works Now

1. **Upload CSV** - Click "Import CSV" button
2. **Parse Data** - System reads CSV and extracts columns
3. **Validate** - Checks for required fields
4. **Auto-Generate** - Creates missing fields:
   - ID: `BBCO{timestamp}{index}`
   - Risk Score: Calculated from attendance, grades, behavior
   - Status: Based on risk score
5. **Import** - Adds students to dashboard

---

## 📊 Risk Score Calculation

If not provided in CSV, risk score is calculated as:

```javascript
Risk Score = (Attendance Risk × 0.4) + (Grade Risk × 0.35) + (Behavioral Risk × 0.25)

Where:
- Attendance Risk = (100 - attendance) / 100
- Grade Risk = (100 - avgGrade) / 100
- Behavioral Risk = (10 - behavioralScore) / 10
```

### Status Determination

- **High Risk**: Risk Score ≥ 0.7 (70%)
- **Medium Risk**: Risk Score 0.4 - 0.69 (40-69%)
- **Low Risk**: Risk Score < 0.4 (<40%)

---

## 🎯 Download Template

Click "Download Template" button in the dashboard to get a pre-formatted CSV file with:
- Correct column headers
- Sample data rows
- Proper formatting

---

## ✅ What's Fixed

### Before (Error):
```
Cannot read properties of undefined (reading 'toLowerCase')
```

### After (Working):
- ✅ Handles missing fields gracefully
- ✅ Auto-generates required data
- ✅ Safe null checks in filters
- ✅ Validates data before import
- ✅ Shows helpful error messages

---

## 🧪 Test Your Import

### Test CSV 1: Minimal Data
```csv
name,email,phone,attendance,avgGrade,behavioralScore
Test Student 1,test1@example.com,+1111111111,75,80,7
Test Student 2,test2@example.com,+1111111112,45,60,4
Test Student 3,test3@example.com,+1111111113,90,95,9
```

### Test CSV 2: With Empty Fields
```csv
name,email,phone,attendance,avgGrade,behavioralScore
Student A,,,85,78,8
Student B,email@test.com,+1234567890,,,
Student C,,,,,
```

**Result:** All will import successfully with auto-generated/default values!

---

## 🐛 Troubleshooting

### Issue: Import button doesn't work
**Solution:** Make sure file has `.csv` extension

### Issue: Data looks wrong after import
**Solution:** Check CSV format matches template

### Issue: Some students missing
**Solution:** Ensure each row has at least a name

### Issue: Risk scores seem off
**Solution:** Verify attendance, avgGrade, and behavioralScore values are correct

---

## 💡 Tips

1. **Use Template** - Download and modify the template for best results
2. **Check Data** - Verify numbers are in correct ranges before import
3. **Test Small** - Import a few students first to test
4. **Export First** - Export existing data to see correct format
5. **No Special Characters** - Avoid commas in names/emails (use semicolons if needed)

---

## 📥 How to Import

1. Click **"Import CSV"** button in Data Management section
2. Select your CSV file
3. System processes and validates data
4. Students appear in dashboard immediately
5. Check for any students with "Unknown Student" name (indicates parsing issue)

---

**The CSV import is now fixed and handles all edge cases!** 📊✅
