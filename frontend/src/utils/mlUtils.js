// Simple ML prediction function (simulating DMSW model)
export const predictDropoutRisk = (attendance, avgGrade, behavioralScore) => {
  // Normalized weights for different factors
  const attendanceWeight = 0.4;
  const gradeWeight = 0.35;
  const behavioralWeight = 0.25;

  // Normalize inputs (0-1 scale, inverted for risk)
  const attendanceRisk = (100 - attendance) / 100;
  const gradeRisk = (100 - avgGrade) / 100;
  const behavioralRisk = (10 - behavioralScore) / 10;

  // Calculate weighted risk score
  const riskScore = (attendanceRisk * attendanceWeight +
    gradeRisk * gradeWeight +
    behavioralRisk * behavioralWeight);

  return Math.min(riskScore, 1); // Cap at 1
};

// DMSW (Dual-Modal Multiscale Sliding Window) Model Simulation
export const dmsw_model = {
  predict: (studentData) => {
    // This would be replaced with actual TensorFlow.js model in production
    const { attendance, avgGrade, behavioralScore, historicalData = [] } = studentData;

    // Simulate sliding window analysis
    const timeWindows = [1, 7, 30]; // days
    let windowScores = [];

    timeWindows.forEach(window => {
      const baseScore = predictDropoutRisk(attendance, avgGrade, behavioralScore);

      // Add temporal variance based on window size
      const temporalFactor = Math.random() * 0.1 - 0.05; // ±5% variance
      windowScores.push(Math.max(0, Math.min(1, baseScore + temporalFactor)));
    });

    // Combine scores from different windows
    const finalScore = windowScores.reduce((sum, score, index) => {
      const weight = timeWindows[index] === 1 ? 0.5 : (timeWindows[index] === 7 ? 0.3 : 0.2);
      return sum + (score * weight);
    }, 0);

    return {
      riskScore: finalScore,
      confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
      factors: {
        attendance: (100 - attendance) / 100,
        academic: (100 - avgGrade) / 100,
        behavioral: (10 - behavioralScore) / 10,
        temporal: windowScores
      }
    };
  },

  getFeatureImportance: () => {
    return {
      attendance: 0.4,
      grades: 0.35,
      behavioral: 0.25,
      temporal_patterns: 0.15,
      engagement: 0.10
    };
  }
};

// Risk categorization helper
export const categorizeRisk = (riskScore) => {
  if (riskScore >= 0.5) return { level: 'High Risk', color: '#EF4444' };
  if (riskScore >= 0.4) return { level: 'Medium Risk', color: '#F59E0B' };
  return { level: 'Low Risk', color: '#10B981' };
};

// Generate intervention recommendations
export const generateInterventions = (student) => {
  const interventions = [];

  if (student.attendance < 60) {
    interventions.push({
      type: 'Attendance Warning',
      priority: 'High',
      description: 'Schedule meeting with student to discuss attendance issues'
    });
  }

  if (student.avgGrade < 65) {
    interventions.push({
      type: 'Academic Support',
      priority: 'High',
      description: 'Assign peer tutor or study group'
    });
  }

  if (student.behavioralScore < 5) {
    interventions.push({
      type: 'Counseling Session',
      priority: 'Medium',
      description: 'Schedule behavioral counseling session'
    });
  }

  if (student.riskScore >= 0.5) {
    interventions.push({
      type: 'Parent Conference',
      priority: 'High',
      description: 'Immediate parent meeting required'
    });
  }

  return interventions;
};