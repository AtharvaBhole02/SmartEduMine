import pandas as pd
import numpy as np
import random

# Constants
NUM_STUDENTS = 2000  # Increased from 500 for better training
WEEKS = 15
OUTPUT_FILE = "dmsw_student_data.csv"

# Behavioral comments templates — diverse vocabulary for richer embeddings
POSITIVE_COMMENTS = [
    "Active participation in class",
    "Submitted assignment on time",
    "Showed great improvement",
    "Helped peers with coursework",
    "Asked insightful questions",
    "Perfect attendance this week",
    "Demonstrated strong leadership",
    "Consistent performance",
    "Enthusiastic about the topic",
    "Completed extra credit work",
    "Excellent presentation skills",
    "Strong problem-solving ability",
    "Engaged in group discussions",
    "Outstanding project submission",
    "Showed initiative in learning",
]

NEUTRAL_COMMENTS = [
    "Regular attendance",
    "Submitted assignment",
    "Quiet in class",
    "Average performance",
    "Met the basic requirements",
    "Present but passive",
    "No significant changes",
    "Followed instructions",
    "Standard participation",
    "Completed the quiz",
    "Attended but disengaged",
    "Moderate effort observed",
    "On-time submission with minor errors",
    "Adequate performance noted",
    "Satisfactory attendance record",
]

NEGATIVE_COMMENTS = [
    "Absent without leave",
    "Late submission of assignment",
    "Disruptive behavior in class",
    "Failed the weekly quiz",
    "Did not pay attention",
    "Sleeping in class",
    "Rude to classmates",
    "Incomplete homework",
    "Struggling with concepts",
    "Needs improvement in discipline",
    "Missed multiple deadlines",
    "Frequently late to class",
    "No homework submitted",
    "Declined to participate in activities",
    "Showed signs of academic distress",
]


def generate_student_data(student_id):
    # Determine if student will eventually dropout (30% chance)
    is_dropout = random.random() < 0.3

    # --- Static Features ---
    age = random.randint(18, 25)
    gender = random.choice([0, 1])  # 0: Female, 1: Male

    # Financial & Academic Context (correlated with dropout)
    if is_dropout:
        scholarship = 0 if random.random() < 0.7 else 1
        debt = 1 if random.random() < 0.6 else 0
        tuition_up_to_date = 0 if random.random() < 0.5 else 1
        courses_enrolled = random.randint(3, 6)
        courses_passed = random.randint(0, max(0, courses_enrolled - 1))
    else:
        scholarship = 1 if random.random() < 0.4 else 0
        debt = 0 if random.random() < 0.8 else 1
        tuition_up_to_date = 1 if random.random() < 0.9 else 0
        courses_enrolled = random.randint(4, 7)
        courses_passed = random.randint(max(0, courses_enrolled - 1), courses_enrolled)

    # Base stats for time-series
    attendance_base = random.uniform(60, 100) if not is_dropout else random.uniform(40, 80)
    grade_base = random.uniform(65, 95) if not is_dropout else random.uniform(30, 70)

    # --- Edge cases (~10% of students) ---
    edge_case = random.random()
    if edge_case < 0.05:
        # Good grades but poor attendance (borderline)
        attendance_base = random.uniform(30, 55)
        grade_base = random.uniform(70, 90)
    elif edge_case < 0.10:
        # Good attendance but poor grades
        attendance_base = random.uniform(80, 98)
        grade_base = random.uniform(25, 45)

    weeks_data = []
    current_attendance = attendance_base
    current_grade = grade_base

    for week in range(1, WEEKS + 1):
        # Trend: Dropouts tend to get worse over time
        if is_dropout:
            current_attendance -= random.uniform(0, 5)
            current_grade -= random.uniform(0, 4)
        else:
            current_attendance += random.uniform(-2, 2)
            current_grade += random.uniform(-2, 2)

        # Clamp values
        current_attendance = max(0, min(100, current_attendance))
        current_grade = max(0, min(100, current_grade))

        # Generate text based on performance
        if current_grade < 50 or current_attendance < 50:
            comment = random.choice(NEGATIVE_COMMENTS)
        elif current_grade > 80 and current_attendance > 80:
            comment = random.choice(POSITIVE_COMMENTS)
        else:
            comment = random.choice(NEUTRAL_COMMENTS)

        weeks_data.append({
            "student_id": student_id,
            "week": week,
            "attendance": round(current_attendance, 1),
            "grade": round(current_grade, 1),
            "behavior_text": comment,
            "age": age,
            "gender": gender,
            "scholarship": scholarship,
            "debt": debt,
            "tuition_up_to_date": tuition_up_to_date,
            "courses_enrolled": courses_enrolled,
            "courses_passed": courses_passed,
            "dropout_label": 1 if is_dropout else 0,
        })

    return weeks_data


# Generate dataset
random.seed(42)  # Reproducible dataset
all_data = []
for i in range(NUM_STUDENTS):
    student_id = f"STU{i+1:04d}"
    all_data.extend(generate_student_data(student_id))

df = pd.DataFrame(all_data)
df.to_csv(OUTPUT_FILE, index=False)

dropout_count = df.groupby("student_id")["dropout_label"].first().sum()
total = len(df["student_id"].unique())

print(f"Dataset generated: {len(df)} rows ({total} students × {WEEKS} weeks)")
print(f"  Dropout: {int(dropout_count)} ({dropout_count/total*100:.1f}%)")
print(f"  Non-dropout: {int(total - dropout_count)} ({(total - dropout_count)/total*100:.1f}%)")
print(f"Saved to {OUTPUT_FILE}")
