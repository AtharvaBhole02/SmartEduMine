export const mockStudentData = [
  { 
    id: 'BBCO22122', 
    name: 'John Doe', 
    email: 'john.doe@college.edu', 
    phone: '+91-9876543210', 
    attendance: 75, 
    avgGrade: 82, 
    behavioralScore: 7, 
    riskScore: 0.3, 
    status: 'Low Risk', 
    lastActivity: '2 hours ago' 
  },
  { 
    id: 'BBCO22120', 
    name: 'Jane Smith', 
    email: 'jane.smith@college.edu', 
    phone: '+91-9876543211', 
    attendance: 45, 
    avgGrade: 65, 
    behavioralScore: 4, 
    riskScore: 0.8, 
    status: 'High Risk', 
    lastActivity: '5 days ago' 
  },
  { 
    id: 'BBCO22129', 
    name: 'Mike Johnson', 
    email: 'mike.johnson@college.edu', 
    phone: '+91-9876543212', 
    attendance: 85, 
    avgGrade: 88, 
    behavioralScore: 8, 
    riskScore: 0.2, 
    status: 'Low Risk', 
    lastActivity: '1 hour ago' 
  },
  { 
    id: 'BBCO22132', 
    name: 'Sarah Wilson', 
    email: 'sarah.wilson@college.edu', 
    phone: '+91-9876543213', 
    attendance: 60, 
    avgGrade: 70, 
    behavioralScore: 5, 
    riskScore: 0.6, 
    status: 'Medium Risk', 
    lastActivity: '1 day ago' 
  },
  { 
    id: 'BBCO22135', 
    name: 'Tom Brown', 
    email: 'tom.brown@college.edu', 
    phone: '+91-9876543214', 
    attendance: 40, 
    avgGrade: 55, 
    behavioralScore: 3, 
    riskScore: 0.9, 
    status: 'High Risk', 
    lastActivity: '3 days ago' 
  },
];

export const monthlyTrendData = [
  { month: 'Jan', dropoutRate: 5.2, predictions: 6.1, interventions: 12 },
  { month: 'Feb', dropoutRate: 4.8, predictions: 5.5, interventions: 15 },
  { month: 'Mar', dropoutRate: 6.1, predictions: 6.8, interventions: 18 },
  { month: 'Apr', dropoutRate: 5.5, predictions: 5.9, interventions: 14 },
  { month: 'May', dropoutRate: 4.2, predictions: 4.8, interventions: 11 },
  { month: 'Jun', dropoutRate: 3.9, predictions: 4.2, interventions: 9 },
];

export const riskDistribution = [
  { name: 'Low Risk', value: 45, color: '#10B981' },
  { name: 'Medium Risk', value: 30, color: '#F59E0B' },
  { name: 'High Risk', value: 25, color: '#EF4444' },
];

export const performanceMetrics = {
  accuracy: 94.5,
  improvement: 15,
  f1Score: 0.89,
  studentsHelped: 87
};