"""
Test script to verify low performance students are correctly classified as HIGH/CRITICAL risk
"""

import requests
import json

API_URL = 'http://localhost:5001'

def test_low_performance_student():
    """Test a student with very poor performance"""
    
    # Student with 2 out of 6 courses passed, low grades, low attendance
    poor_student = {
        'Marital status': 1,
        'Application mode': 1,
        'Application order': 1,
        'Course': 1,
        'Daytime/evening attendance\t': 1,
        'Previous qualification': 1,
        'Previous qualification (grade)': 100,
        'Nacionality': 1,
        "Mother's qualification": 1,
        "Father's qualification": 1,
        "Mother's occupation": 1,
        "Father's occupation": 1,
        'Admission grade': 100,
        'Displaced': 0,
        'Educational special needs': 0,
        'Debtor': 0,
        'Tuition fees up to date': 1,
        'Gender': 1,
        'Scholarship holder': 0,
        'Age at enrollment': 18,
        'International': 0,
        # Semester 1: 2 out of 6 courses passed, low grade
        'Curricular units 1st sem (credited)': 0,
        'Curricular units 1st sem (enrolled)': 6,
        'Curricular units 1st sem (evaluations)': 6,
        'Curricular units 1st sem (approved)': 2,  # Only 2 passed
        'Curricular units 1st sem (grade)': 5.0,  # Very low grade (5/20)
        'Curricular units 1st sem (without evaluations)': 4,
        # Semester 2: Similar poor performance
        'Curricular units 2nd sem (credited)': 0,
        'Curricular units 2nd sem (enrolled)': 6,
        'Curricular units 2nd sem (evaluations)': 6,
        'Curricular units 2nd sem (approved)': 2,  # Only 2 passed
        'Curricular units 2nd sem (grade)': 5.0,  # Very low grade (5/20)
        'Curricular units 2nd sem (without evaluations)': 4,
        'Unemployment rate': 10.8,
        'Inflation rate': 1.4,
        'GDP': 1.74,
    }
    
    print("="*70)
    print("Testing POOR PERFORMANCE Student")
    print("="*70)
    print(f"Courses Enrolled: 6")
    print(f"Courses Passed: 2 (33.3% pass rate)")
    print(f"Average Grade: 5.0/20 (25%)")
    print(f"Expected Risk: HIGH or CRITICAL")
    print("-"*70)
    
    try:
        response = requests.post(f'{API_URL}/predict', json=poor_student)
        result = response.json()
        
        print(f"\n✓ Prediction: {result['prediction']}")
        print(f"✓ Risk Level: {result['risk_level']}")
        print(f"✓ Dropout Probability: {result['dropout_probability']:.2%}")
        print(f"✓ Academic Risk Score: {result['academic_risk_score']:.2%}")
        print(f"✓ Socioeconomic Risk Score: {result['socioeconomic_risk_score']:.2%}")
        
        print(f"\n📊 Risk Factors:")
        for factor in result['explanations']['risk_factors']:
            print(f"  • {factor}")
        
        print(f"\n💡 Recommendations:")
        for rec in result['explanations']['recommendations']:
            print(f"  • {rec}")
        
        # Verify the risk level is appropriate
        if result['risk_level'] in ['HIGH', 'CRITICAL']:
            print(f"\n✅ PASS: Student correctly classified as {result['risk_level']} risk")
        else:
            print(f"\n❌ FAIL: Student should be HIGH/CRITICAL risk, but got {result['risk_level']}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")

def test_moderate_performance_student():
    """Test a student with moderate performance"""
    
    moderate_student = {
        'Marital status': 1,
        'Application mode': 1,
        'Application order': 1,
        'Course': 1,
        'Daytime/evening attendance\t': 1,
        'Previous qualification': 1,
        'Previous qualification (grade)': 120,
        'Nacionality': 1,
        "Mother's qualification": 1,
        "Father's qualification": 1,
        "Mother's occupation": 1,
        "Father's occupation": 1,
        'Admission grade': 120,
        'Displaced': 0,
        'Educational special needs': 0,
        'Debtor': 0,
        'Tuition fees up to date': 1,
        'Gender': 1,
        'Scholarship holder': 0,
        'Age at enrollment': 18,
        'International': 0,
        # Semester 1: 4 out of 6 courses passed, moderate grade
        'Curricular units 1st sem (credited)': 0,
        'Curricular units 1st sem (enrolled)': 6,
        'Curricular units 1st sem (evaluations)': 6,
        'Curricular units 1st sem (approved)': 4,  # 4 passed
        'Curricular units 1st sem (grade)': 11.0,  # Moderate grade (11/20)
        'Curricular units 1st sem (without evaluations)': 2,
        # Semester 2: Similar moderate performance
        'Curricular units 2nd sem (credited)': 0,
        'Curricular units 2nd sem (enrolled)': 6,
        'Curricular units 2nd sem (evaluations)': 6,
        'Curricular units 2nd sem (approved)': 4,
        'Curricular units 2nd sem (grade)': 11.0,
        'Curricular units 2nd sem (without evaluations)': 2,
        'Unemployment rate': 10.8,
        'Inflation rate': 1.4,
        'GDP': 1.74,
    }
    
    print("\n" + "="*70)
    print("Testing MODERATE PERFORMANCE Student")
    print("="*70)
    print(f"Courses Enrolled: 6")
    print(f"Courses Passed: 4 (66.7% pass rate)")
    print(f"Average Grade: 11.0/20 (55%)")
    print(f"Expected Risk: MEDIUM")
    print("-"*70)
    
    try:
        response = requests.post(f'{API_URL}/predict', json=moderate_student)
        result = response.json()
        
        print(f"\n✓ Prediction: {result['prediction']}")
        print(f"✓ Risk Level: {result['risk_level']}")
        print(f"✓ Dropout Probability: {result['dropout_probability']:.2%}")
        
        if result['risk_level'] == 'MEDIUM':
            print(f"\n✅ PASS: Student correctly classified as MEDIUM risk")
        else:
            print(f"\n⚠️  Got {result['risk_level']} risk (expected MEDIUM)")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")

def test_good_performance_student():
    """Test a student with good performance"""
    
    good_student = {
        'Marital status': 1,
        'Application mode': 1,
        'Application order': 1,
        'Course': 1,
        'Daytime/evening attendance\t': 1,
        'Previous qualification': 1,
        'Previous qualification (grade)': 150,
        'Nacionality': 1,
        "Mother's qualification": 1,
        "Father's qualification": 1,
        "Mother's occupation": 1,
        "Father's occupation": 1,
        'Admission grade': 150,
        'Displaced': 0,
        'Educational special needs': 0,
        'Debtor': 0,
        'Tuition fees up to date': 1,
        'Gender': 1,
        'Scholarship holder': 1,
        'Age at enrollment': 18,
        'International': 0,
        # Semester 1: All courses passed, good grade
        'Curricular units 1st sem (credited)': 0,
        'Curricular units 1st sem (enrolled)': 6,
        'Curricular units 1st sem (evaluations)': 6,
        'Curricular units 1st sem (approved)': 6,  # All passed
        'Curricular units 1st sem (grade)': 15.0,  # Good grade (15/20)
        'Curricular units 1st sem (without evaluations)': 0,
        # Semester 2: All courses passed, good grade
        'Curricular units 2nd sem (credited)': 0,
        'Curricular units 2nd sem (enrolled)': 6,
        'Curricular units 2nd sem (evaluations)': 6,
        'Curricular units 2nd sem (approved)': 6,
        'Curricular units 2nd sem (grade)': 15.0,
        'Curricular units 2nd sem (without evaluations)': 0,
        'Unemployment rate': 10.8,
        'Inflation rate': 1.4,
        'GDP': 1.74,
    }
    
    print("\n" + "="*70)
    print("Testing GOOD PERFORMANCE Student")
    print("="*70)
    print(f"Courses Enrolled: 6")
    print(f"Courses Passed: 6 (100% pass rate)")
    print(f"Average Grade: 15.0/20 (75%)")
    print(f"Expected Risk: LOW")
    print("-"*70)
    
    try:
        response = requests.post(f'{API_URL}/predict', json=good_student)
        result = response.json()
        
        print(f"\n✓ Prediction: {result['prediction']}")
        print(f"✓ Risk Level: {result['risk_level']}")
        print(f"✓ Dropout Probability: {result['dropout_probability']:.2%}")
        
        if result['risk_level'] == 'LOW':
            print(f"\n✅ PASS: Student correctly classified as LOW risk")
        else:
            print(f"\n⚠️  Got {result['risk_level']} risk (expected LOW)")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    print("\n🧪 Testing ML Model with Different Performance Levels\n")
    
    # Test all three scenarios
    test_low_performance_student()
    test_moderate_performance_student()
    test_good_performance_student()
    
    print("\n" + "="*70)
    print("Testing Complete!")
    print("="*70)
