/**
 * Dropout Prediction API Integration
 * Connects React app to the ML service
 */

const API_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:5001';

/**
 * Check if ML service is available
 */
export const checkMLServiceHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error('ML Service health check failed:', error);
    return { status: 'unavailable', error: error.message };
  }
};

/**
 * Predict dropout risk for a single student using DMSW model
 */
export const predictDropoutRiskDMSW = async (studentData) => {
  try {
    const response = await fetch(`${API_URL}/predict/dmsw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('DMSW Dropout prediction failed:', error);
    throw error;
  }
};

/**
 * Predict dropout risk for a single student (OLD MODEL)
 */
export const predictDropoutRisk = async (studentData) => {
  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Dropout prediction failed:', error);
    throw error;
  }
};

/**
 * Predict dropout risk for multiple students
 */
export const predictBatchDropoutRisk = async (students) => {
  try {
    const response = await fetch(`${API_URL}/predict/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ students }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Batch prediction failed:', error);
    throw error;
  }
};

/**
 * Get feature importance from the model
 */
export const getFeatureImportance = async () => {
  try {
    const response = await fetch(`${API_URL}/feature-importance`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get feature importance:', error);
    throw error;
  }
};

/**
 * Analyze risk distribution in dataset
 */
export const analyzeRiskDistribution = async (dataPath = 'data.csv') => {
  try {
    const response = await fetch(
      `${API_URL}/analyze/risk-distribution?data_path=${dataPath}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Risk distribution analysis failed:', error);
    throw error;
  }
};

/**
 * Retrain the model with new data
 */
export const retrainModel = async (dataPath = 'data.csv') => {
  try {
    const response = await fetch(`${API_URL}/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data_path: dataPath }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Model retraining failed:', error);
    throw error;
  }
};

/**
 * Map student data for DMSW model (simplified - only needs 7 static features)
 */
export const mapStudentDataForDMSW = (student) => {
  // Get actual values from student data
  const avgGrade = parseFloat(student.avgGrade || 0);
  const attendance = parseFloat(student.attendance || 0);
  const age = parseInt(student.age || 20);
  const gender = student.gender || 'Male';

  // Get course data - prioritize explicit values
  const coursesEnrolled = parseInt(student.coursesEnrolled || student.sem1Enrolled || 5);

  // If coursesPassed is not provided or is 0, estimate from avgGrade
  let coursesPassed;
  const explicitCoursesPassed = parseInt(student.coursesPassed || student.sem1Approved || 0);

  if (explicitCoursesPassed > 0) {
    coursesPassed = explicitCoursesPassed;
  } else {
    // Estimate courses passed from grade
    const passRate = avgGrade / 100;
    coursesPassed = Math.round(coursesEnrolled * passRate);
    console.log(`  ℹ️ Estimating coursesPassed from grade: ${avgGrade}% → ${coursesPassed}/${coursesEnrolled} courses`);
  }

  // DMSW only needs these simple fields
  const dmswData = {
    age: age,
    gender: gender,
    scholarship: student.scholarship || '0',
    debtor: student.debtor || '0',
    tuitionUpToDate: student.tuitionUpToDate || '1',
    coursesEnrolled: coursesEnrolled,
    coursesPassed: coursesPassed,
    attendance: attendance,
    avgGrade: avgGrade
  };

  console.log('🔍 DMSW ML Data for', student.name || 'Student');
  console.log('  Static Features:', { age, gender, scholarship: dmswData.scholarship, debtor: dmswData.debtor, tuition: dmswData.tuitionUpToDate });
  console.log('  Academic:', { coursesEnrolled, coursesPassed, passRate: `${((coursesPassed / coursesEnrolled) * 100).toFixed(1)}%` });
  console.log('  Performance:', { avgGrade: `${avgGrade}%`, attendance: `${attendance}%` });
  console.log('  📤 Full DMSW Data:', JSON.stringify(dmswData, null, 2));

  return dmswData;
};

/**
 * Map student data from your app format to ML model format (OLD MODEL - 35+ fields)
 */
export const mapStudentDataForPrediction = (student) => {
  // Get actual values from student data
  const avgGrade = parseFloat(student.avgGrade || 0);
  const attendance = parseFloat(student.attendance || 0);

  // Get course data - prioritize explicit values
  const coursesEnrolled = parseInt(student.coursesEnrolled || student.sem1Enrolled || 6);

  // If coursesPassed is not provided or is 0, estimate from avgGrade
  let coursesPassed;
  const explicitCoursesPassed = parseInt(student.coursesPassed || student.sem1Approved || 0);

  if (explicitCoursesPassed > 0) {
    // Use the explicit value if it's greater than 0
    coursesPassed = explicitCoursesPassed;
  } else {
    // Estimate courses passed from grade: if grade > 60%, assume they passed most courses
    const passRate = avgGrade / 100; // Convert percentage to 0-1
    coursesPassed = Math.round(coursesEnrolled * passRate);
    console.log(`  ℹ️ Estimating coursesPassed from grade: ${avgGrade}% → ${coursesPassed}/${coursesEnrolled} courses`);
  }

  // Calculate grade on 0-20 scale (Portuguese system)
  // Handle different input formats:
  // - Percentage (0-100): convert to 0-20
  // - Already 0-20 scale: use as is
  // - CGPA (0-10): convert to 0-20
  let gradeScale;
  if (avgGrade > 100) {
    // Invalid input, cap at 100 and convert
    console.warn('Grade > 100 detected, capping at 100');
    gradeScale = 20; // Max grade
  } else if (avgGrade > 20) {
    // It's a percentage (21-100), convert to 0-20
    gradeScale = (avgGrade / 100) * 20;
  } else if (avgGrade > 10 && avgGrade <= 20) {
    // Already on 0-20 scale
    gradeScale = avgGrade;
  } else if (avgGrade > 0 && avgGrade <= 10) {
    // Could be CGPA (0-10) or low percentage, assume CGPA and convert
    gradeScale = avgGrade * 2; // Convert 0-10 to 0-20
  } else {
    // No grade provided, calculate from course pass rate
    const passRate = coursesEnrolled > 0 ? (coursesPassed / coursesEnrolled) : 0;
    gradeScale = passRate * 20; // Convert pass rate to grade
  }

  // Calculate previous and admission grades (0-200 scale)
  // Use actual values if provided, otherwise estimate from current performance
  // Scale: gradeScale (0-20) * 10 = 0-200
  const previousGrade = parseFloat(student.previousGrade || (gradeScale * 10) || 100);
  const admissionGrade = parseFloat(student.admissionGrade || (gradeScale * 10) || 100);

  // For attendance, if it's very low, it should impact the prediction but not completely override good grades
  // Attendance affects evaluations and grades, but we don't want to penalize too harshly
  const attendanceImpact = attendance / 100; // 0-1 scale
  // Use a more balanced formula: if attendance is low but grades are good, don't reduce grade as much
  // Changed from 0.6 to 0.75 to be even less aggressive
  const effectiveGrade = gradeScale * Math.max(attendanceImpact, 0.75); // Low attendance reduces grade, but not below 75% of actual grade

  const mlData = {
    'Marital status': student.maritalStatus || 1,
    'Application mode': student.applicationMode || 1,
    'Application order': student.applicationOrder || 1,
    'Course': student.course || 1,
    'Daytime/evening attendance\t': 1,
    'Previous qualification': student.previousQualification || 1,
    'Previous qualification (grade)': previousGrade,
    'Nacionality': student.nationality || 1,
    "Mother's qualification": student.motherQualification || 1,
    "Father's qualification": student.fatherQualification || 1,
    "Mother's occupation": student.motherOccupation || 1,
    "Father's occupation": student.fatherOccupation || 1,
    'Admission grade': admissionGrade,
    'Displaced': student.displaced || 0,
    'Educational special needs': student.specialNeeds || 0,
    'Debtor': student.debtor || 0,
    'Tuition fees up to date': student.tuitionUpToDate || 1,
    'Gender': student.gender === 'Male' ? 1 : 0,
    'Scholarship holder': student.scholarship || 0,
    'Age at enrollment': parseInt(student.age || 18),
    'International': student.international || 0,
    // Semester 1 data
    'Curricular units 1st sem (credited)': parseInt(student.sem1Credited || 0),
    'Curricular units 1st sem (enrolled)': coursesEnrolled,
    'Curricular units 1st sem (evaluations)': parseInt(student.sem1Evaluations || coursesEnrolled),
    'Curricular units 1st sem (approved)': coursesPassed,
    'Curricular units 1st sem (grade)': effectiveGrade, // Use attendance-adjusted grade
    'Curricular units 1st sem (without evaluations)': parseInt(student.sem1WithoutEval || (coursesEnrolled - coursesPassed)),
    // Semester 2 data (mirror semester 1 if not provided)
    'Curricular units 2nd sem (credited)': parseInt(student.sem2Credited || 0),
    'Curricular units 2nd sem (enrolled)': parseInt(student.sem2Enrolled || coursesEnrolled),
    'Curricular units 2nd sem (evaluations)': parseInt(student.sem2Evaluations || coursesEnrolled),
    'Curricular units 2nd sem (approved)': parseInt(student.sem2Approved || coursesPassed),
    'Curricular units 2nd sem (grade)': parseFloat(student.sem2Grade || effectiveGrade),
    'Curricular units 2nd sem (without evaluations)': parseInt(student.sem2WithoutEval || (coursesEnrolled - coursesPassed)),
    // Economic indicators
    'Unemployment rate': parseFloat(student.unemploymentRate || 10.8),
    'Inflation rate': parseFloat(student.inflationRate || 1.4),
    'GDP': parseFloat(student.gdp || 1.74),
  };

  // Debug logging
  console.log('🔍 ML Data for', student.name || 'Student');
  console.log('  Courses: ', coursesPassed, '/', coursesEnrolled, '=', ((coursesPassed / coursesEnrolled) * 100).toFixed(1), '% pass rate');
  console.log('  Grade: ', avgGrade, '% → ', gradeScale.toFixed(2), '/20 → effective:', effectiveGrade.toFixed(2), '/20');
  console.log('  Attendance:', attendance, '% (impact:', attendanceImpact.toFixed(2), ')');
  console.log('  📤 Full ML Data being sent:', JSON.stringify(mlData, null, 2));

  return mlData;
};

/**
 * Get risk level color for UI
 */
export const getRiskLevelColor = (riskLevel) => {
  const colors = {
    CRITICAL: 'red',
    HIGH: 'orange',
    MEDIUM: 'yellow',
    LOW: 'green',
  };
  return colors[riskLevel] || 'gray';
};

/**
 * Get risk level badge class
 */
export const getRiskLevelBadgeClass = (riskLevel) => {
  const classes = {
    CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  return classes[riskLevel] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};
