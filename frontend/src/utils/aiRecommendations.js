// AI-Powered Recommendation Engine for Student Interventions

export const aiRecommendationEngine = {
  // Generate personalized recommendations based on student data
  generateRecommendations: (student) => {
    const recommendations = {
      priority: getPriority(student.riskScore),
      immediateActions: [],
      counselingStrategies: [],
      courseRecommendations: [],
      supportServices: [],
      parentEngagement: [],
      timeline: getTimeline(student.riskScore)
    };

    // Analyze attendance issues
    if (student.attendance < 70) {
      recommendations.immediateActions.push({
        action: 'Schedule Attendance Intervention Meeting',
        reason: `Attendance at ${student.attendance}% is below acceptable threshold`,
        urgency: 'high',
        icon: '📅'
      });

      recommendations.counselingStrategies.push({
        strategy: 'Identify Attendance Barriers',
        description: 'Conduct one-on-one session to understand reasons for absences (transportation, health, family issues, bullying)',
        duration: '30-45 minutes',
        icon: '🔍'
      });

      recommendations.supportServices.push({
        service: 'Transportation Assistance',
        description: 'Explore bus pass programs or carpool arrangements',
        provider: 'Student Services Office',
        icon: '🚌'
      });
    }

    // Analyze grade performance
    if (student.avgGrade < 70) {
      recommendations.immediateActions.push({
        action: 'Academic Support Plan',
        reason: `Grade average of ${student.avgGrade}% indicates academic struggle`,
        urgency: 'high',
        icon: '📚'
      });

      recommendations.courseRecommendations.push({
        course: 'Tutoring Program',
        description: 'Peer or professional tutoring in struggling subjects',
        frequency: '2-3 times per week',
        duration: '1 hour sessions',
        icon: '👨‍🏫'
      });

      recommendations.courseRecommendations.push({
        course: 'Study Skills Workshop',
        description: 'Learn effective note-taking, time management, and test preparation strategies',
        frequency: 'Weekly for 6 weeks',
        duration: '90 minutes',
        icon: '📝'
      });
    }

    // Analyze behavioral issues
    if (student.behavioralScore < 6) {
      recommendations.immediateActions.push({
        action: 'Behavioral Assessment',
        reason: `Behavioral score of ${student.behavioralScore}/10 suggests engagement issues`,
        urgency: 'medium',
        icon: '🎯'
      });

      recommendations.counselingStrategies.push({
        strategy: 'Motivational Interviewing',
        description: 'Use MI techniques to explore student\'s goals, values, and barriers to success',
        duration: '45-60 minutes',
        icon: '💬'
      });

      recommendations.supportServices.push({
        service: 'Mental Health Counseling',
        description: 'Professional counseling for stress, anxiety, or depression',
        provider: 'Campus Counseling Center',
        icon: '🧠'
      });
    }

    // High-risk specific recommendations
    if (student.riskScore >= 0.5) {
      recommendations.immediateActions.push({
        action: 'Emergency Intervention Team Meeting',
        reason: 'High dropout risk requires immediate multi-stakeholder response',
        urgency: 'critical',
        icon: '🚨'
      });

      recommendations.parentEngagement.push({
        action: 'Parent Conference (Urgent)',
        description: 'Schedule immediate meeting with parents/guardians to discuss concerns and create action plan',
        timeline: 'Within 48 hours',
        icon: '👨‍👩‍👧'
      });

      recommendations.counselingStrategies.push({
        strategy: 'Crisis Intervention Protocol',
        description: 'Assess immediate needs, safety concerns, and create emergency support plan',
        duration: 'Immediate',
        icon: '⚡'
      });
    }

    // Medium-risk recommendations
    if (student.riskScore >= 0.4 && student.riskScore < 0.5) {
      recommendations.counselingStrategies.push({
        strategy: 'Goal-Setting Sessions',
        description: 'Work with student to set SMART goals for attendance, grades, and engagement',
        duration: '30 minutes weekly',
        icon: '🎯'
      });

      recommendations.courseRecommendations.push({
        course: 'Success Coaching Program',
        description: 'One-on-one coaching to develop academic and life skills',
        frequency: 'Bi-weekly',
        duration: '45 minutes',
        icon: '🌟'
      });
    }

    // General support recommendations
    recommendations.supportServices.push({
      service: 'Academic Advisor Check-in',
      description: 'Regular meetings to review progress and adjust support plan',
      provider: 'Academic Advising Office',
      icon: '📊'
    });

    recommendations.courseRecommendations.push({
      course: 'Peer Mentorship Program',
      description: 'Connect with successful peer mentor for guidance and support',
      frequency: 'Weekly',
      duration: 'Ongoing',
      icon: '🤝'
    });

    // Parent engagement strategies
    recommendations.parentEngagement.push({
      action: 'Weekly Progress Reports',
      description: 'Send automated weekly updates to parents about attendance, grades, and behavior',
      timeline: 'Ongoing',
      icon: '📧'
    });

    return recommendations;
  },

  // Get specific intervention based on risk factors
  getTargetedIntervention: (student) => {
    const interventions = [];

    // Attendance-focused
    if (student.attendance < 50) {
      interventions.push({
        type: 'Attendance Recovery',
        title: 'Intensive Attendance Intervention',
        description: 'Daily check-ins, attendance contracts, and barrier removal',
        steps: [
          'Meet with student to sign attendance contract',
          'Identify and address specific barriers (transportation, health, etc.)',
          'Implement daily check-in system',
          'Provide incentives for improved attendance',
          'Monitor progress weekly'
        ],
        expectedOutcome: 'Increase attendance to 80%+ within 4 weeks',
        icon: '📈'
      });
    }

    // Grade-focused
    if (student.avgGrade < 60) {
      interventions.push({
        type: 'Academic Recovery',
        title: 'Intensive Academic Support',
        description: 'Targeted tutoring, modified assignments, and progress monitoring',
        steps: [
          'Assess specific subject weaknesses',
          'Assign dedicated tutor for struggling subjects',
          'Create modified assignment plan with teacher',
          'Implement weekly progress checks',
          'Provide study materials and resources'
        ],
        expectedOutcome: 'Raise grade average to 70%+ within 6 weeks',
        icon: '📚'
      });
    }

    // Behavioral-focused
    if (student.behavioralScore < 5) {
      interventions.push({
        type: 'Engagement Enhancement',
        title: 'Student Engagement Program',
        description: 'Activities and strategies to increase motivation and participation',
        steps: [
          'Identify student interests and strengths',
          'Connect to relevant clubs or activities',
          'Implement positive behavior reinforcement',
          'Provide leadership opportunities',
          'Regular motivational check-ins'
        ],
        expectedOutcome: 'Improve behavioral score to 7+ within 8 weeks',
        icon: '⭐'
      });
    }

    return interventions;
  }
};

// Helper functions
const getPriority = (riskScore) => {
  if (riskScore >= 0.5) return { level: 'CRITICAL', color: '#EF4444', label: 'Immediate Action Required' };
  if (riskScore >= 0.4) return { level: 'MEDIUM', color: '#F59E0B', label: 'Action Needed Soon' };
  return { level: 'LOW', color: '#10B981', label: 'Monitor Closely' };
};

const getTimeline = (riskScore) => {
  if (riskScore >= 0.5) {
    return {
      immediate: 'Within 24-48 hours',
      shortTerm: '1-2 weeks',
      mediumTerm: '1 month',
      longTerm: 'Ongoing monitoring'
    };
  }
  if (riskScore >= 0.4) {
    return {
      immediate: 'Within 1 week',
      shortTerm: '2-4 weeks',
      mediumTerm: '2-3 months',
      longTerm: 'Semester-long support'
    };
  }
  return {
    immediate: 'Within 2 weeks',
    shortTerm: '1 month',
    mediumTerm: '3-6 months',
    longTerm: 'Annual check-ins'
  };
};
