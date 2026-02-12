import pandas as pd
import numpy as np
import random

# Constants
NUM_STUDENTS = 50
OUTPUT_IMPORT_FILE = 'dashboard_import_test.csv'
OUTPUT_TRUTH_FILE = 'ground_truth.csv'

def generate_test_data():
    print(f"Generating {NUM_STUDENTS} test students...")
    
    students = []
    ground_truth = []
    
    for i in range(NUM_STUDENTS):
        student_id = f"TEST{i+1:03d}"
        
        # Determine if student is a dropout (Ground Truth)
        is_dropout = random.random() < 0.4 # 40% dropout rate for testing
        
        # --- Generate Features based on Dropout Status ---
        # We want clear patterns to verify the model
        
        if is_dropout:
            # Profile: At-Risk
            attendance = random.uniform(30, 70)
            grade = random.uniform(30, 65)
            age = random.randint(19, 26)
            scholarship = 0 if random.random() < 0.8 else 1
            debt = 1 if random.random() < 0.7 else 0
            tuition = 0 if random.random() < 0.6 else 1
            courses_enrolled = random.randint(3, 5)
            courses_passed = random.randint(0, courses_enrolled - 2)
            gender = random.choice(['Male', 'Female'])
        else:
            # Profile: Safe
            attendance = random.uniform(80, 100)
            grade = random.uniform(75, 98)
            age = random.randint(18, 23)
            scholarship = 1 if random.random() < 0.5 else 0
            debt = 0 if random.random() < 0.9 else 1
            tuition = 1
            courses_enrolled = random.randint(4, 6)
            courses_passed = courses_enrolled if random.random() < 0.8 else courses_enrolled - 1
            gender = random.choice(['Male', 'Female'])

        # Create Dashboard Import Row
        student_row = {
            'name': f"Test Student {i+1}",
            'id': student_id,
            'email': f"test{i+1}@university.edu",
            'attendance': round(attendance, 1),
            'avgGrade': round(grade, 1),
            'behavioralScore': 5, # Placeholder
            'age': age,
            'gender': gender,
            'scholarship': 'Yes' if scholarship else 'No',
            'debt': 'Yes' if debt else 'No',
            'tuitionUpToDate': 'Yes' if tuition else 'No',
            'coursesEnrolled': courses_enrolled,
            'coursesPassed': courses_passed
        }
        students.append(student_row)
        
        # Create Ground Truth Row
        truth_row = {
            'Student ID': student_id,
            'Is Dropout': 'Yes' if is_dropout else 'No',
            'Expected Risk': 'HIGH' if is_dropout else 'LOW'
        }
        ground_truth.append(truth_row)

    # Save Files
    pd.DataFrame(students).to_csv(OUTPUT_IMPORT_FILE, index=False)
    pd.DataFrame(ground_truth).to_csv(OUTPUT_TRUTH_FILE, index=False)
    
    print(f"1. Import File: {OUTPUT_IMPORT_FILE} (Contains student data)")
    print(f"2. Truth File:  {OUTPUT_TRUTH_FILE} (Contains actual labels)")

if __name__ == "__main__":
    generate_test_data()
