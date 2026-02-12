import React, { useState, useEffect, useCallback } from 'react';
import HeaderWithNav from '../Layout/HeaderWithNav';
import { useToast } from '../Notifications/ToastContainer';
import StudentComparison from '../Students/StudentComparison';
import StudentProfileModal from '../Students/StudentProfileModal';
import { notificationManager, createNotification } from '../../utils/notificationManager';
import { mlIntegration } from '../../utils/realTimeMLIntegration';

// Import Tab Components
import OverviewTab from './tabs/OverviewTab';
import StudentsTab from './tabs/StudentsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import PredictionsTab from './tabs/PredictionsTab';

// Import Modal Components
import AddStudentModal from './modals/AddStudentModal';
import EditStudentModal from './modals/EditStudentModal';
import ConfirmDialog from './modals/ConfirmDialog';

// Helper to generate trend data based on current stats
const generateTrendData = (students) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentRiskRate = students.length > 0
    ? (students.filter(s => s.riskScore >= 0.5).length / students.length) * 100
    : 0;

  return months.map((month, index) => {
    const variance = (5 - index) * (Math.random() * 2 - 1);
    const rate = Math.max(0, currentRiskRate + variance);

    return {
      month,
      dropoutRate: parseFloat(rate.toFixed(1)),
      predictions: parseFloat((rate * 1.1).toFixed(1)),
      interventions: Math.max(0, Math.floor(rate * 2 + (Math.random() * 5)))
    };
  });
};

const predictDropoutRisk = (attendance, avgGrade, behavioralScore) => {
  const attendanceWeight = 0.4;
  const gradeWeight = 0.35;
  const behavioralWeight = 0.25;
  const attendanceRisk = (100 - attendance) / 100;
  const gradeRisk = (100 - avgGrade) / 100;
  const behavioralRisk = (10 - behavioralScore) / 10;
  const riskScore = (attendanceRisk * attendanceWeight + gradeRisk * gradeWeight + behavioralRisk * behavioralWeight);
  return Math.min(riskScore, 1);
};

const EnhancedDashboard = () => {
  const { addToast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students from API
  const fetchStudents = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/students`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStudents(data.map(s => ({ ...s, id: s.studentId || s._id })));
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      addToast('Failed to load students from database', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('riskScore');
  const [compareStudents, setCompareStudents] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '', email: '', phone: '', attendance: '', avgGrade: '', behavioralScore: '',
    coursesEnrolled: '', coursesPassed: '', age: '', gender: 'Male',
    scholarship: '0', debtor: '0', tuitionUpToDate: '1'
  });
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, studentId: null });
  const fileInputRef = React.useRef(null);

  // CSV Handling Logic
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.name.endsWith('.csv'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0].map(h => h.trim());
        const data = rows.slice(1).filter(row => row.length > 1 && row[0]?.trim()).map((row, rowIndex) => {
          const rawObj = {};
          headers.forEach((header, colIndex) => {
            rawObj[header] = row[colIndex]?.trim() || '';
          });

          const obj = {
            id: rawObj.id || rawObj.StudentID || rawObj.student_id || `BBCO${Date.now()}${rowIndex}`,
            name: rawObj.name || rawObj.Name || rawObj.student_name || 'Unknown Student',
            email: rawObj.email || rawObj.Email || '',
            phone: rawObj.phone || rawObj.Phone || rawObj.contact || '',
            attendance: parseFloat(rawObj.attendance || rawObj['Attendance (%)'] || rawObj.Attendance || 0),
            avgGrade: parseFloat(rawObj.avgGrade || rawObj.CGPA || rawObj.cgpa || rawObj['Internal Marks'] || 0),
            behavioralScore: parseFloat(rawObj.behavioralScore || rawObj['Behavior Score'] || rawObj.behavior || 5),
            age: parseInt(rawObj.age || rawObj.Age || 0),
            gender: rawObj.gender || rawObj.Gender || 'Male',
            scholarship: rawObj.scholarship || rawObj.Scholarship || '0',
            debtor: rawObj.debtor || rawObj.debt || rawObj.Debt || '0',
            tuitionUpToDate: rawObj.tuitionUpToDate || rawObj['Tuition Up To Date'] || rawObj.tuition || '1',
            coursesEnrolled: parseInt(rawObj.coursesEnrolled || rawObj['Courses Enrolled'] || 0),
            coursesPassed: parseInt(rawObj.coursesPassed || rawObj['Courses Passed'] || 0),
          };

          if (obj.avgGrade <= 10 && obj.avgGrade > 0) {
            obj.avgGrade = obj.avgGrade * 10;
          }

          if (!obj.riskScore) {
            const attendanceRisk = (100 - obj.attendance) / 100;
            const gradeRisk = (100 - obj.avgGrade) / 100;
            const behavioralRisk = (10 - obj.behavioralScore) / 10;
            obj.riskScore = (attendanceRisk * 0.4 + gradeRisk * 0.35 + behavioralRisk * 0.25);
          }

          if (obj.riskScore >= 0.5) obj.status = 'High Risk';
          else if (obj.riskScore >= 0.4) obj.status = 'Medium Risk';
          else obj.status = 'Low Risk';

          obj.lastActivity = 'Just added';
          return obj;
        });

        // Add strict validation/clamping for imported data
        const sanitizedData = data.map(student => ({
          ...student,
          attendance: Math.min(100, Math.max(0, student.attendance || 0)),
          avgGrade: Math.min(100, Math.max(0, student.avgGrade || 0)),
          behavioralScore: Math.min(10, Math.max(0, student.behavioralScore || 0)),
          age: Math.max(0, student.age || 0),
          coursesEnrolled: Math.max(0, student.coursesEnrolled || 0),
          coursesPassed: Math.max(0, student.coursesPassed || 0)
        }));

        handleBulkImport(sanitizedData);
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const headers = ['id', 'name', 'email', 'phone', 'attendance', 'avgGrade', 'behavioralScore', 'riskScore', 'status'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => headers.map(header => student[header] || '').join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    addToast('Students exported successfully!', 'success');
  };

  const downloadTemplate = () => {
    const headers = ['name', 'email', 'phone', 'attendance', 'avgGrade', 'behavioralScore'];
    const template = [
      headers.join(','),
      'John Doe,john@example.com,+1234567890,85,78,8',
      'Jane Smith,jane@example.com,+1234567891,92,88,9'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Check for high-risk students and show notifications
  useEffect(() => {
    const highRiskStudents = students.filter(s => s.riskScore >= 0.5);
    const newHighRisk = highRiskStudents.filter(s => !localStorage.getItem(`notified_${s.id}`));

    if (newHighRisk.length > 0) {
      if (newHighRisk.length === 1) {
        addToast(`${newHighRisk[0].name} is now at high risk (${(newHighRisk[0].riskScore * 100).toFixed(1)}%)`, 'warning', 5000);
      } else {
        addToast(`${newHighRisk.length} students are now at high risk - check notifications`, 'warning', 5000);
      }

      newHighRisk.forEach(student => {
        notificationManager.addNotification(
          createNotification(
            notificationManager.types.HIGH_RISK,
            'High Risk Student Alert',
            `${student.name} (${student.id}) has a risk score of ${(student.riskScore * 100).toFixed(1)}%. Immediate attention required.`,
            { studentId: student.id, studentName: student.name, riskScore: student.riskScore }
          )
        );
        localStorage.setItem(`notified_${student.id}`, 'true');
      });
    }
  }, [students, addToast]);

  // Computed values
  const totalStudents = students.length;
  const highRiskStudents = students.filter(s => s.riskScore >= 0.5).length;
  const avgAttendance = totalStudents > 0 ? (students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents).toFixed(1) : 0;
  const interventionAlerts = students.filter(s => s.riskScore >= 0.5).length;

  const riskDistribution = React.useMemo(() => [
    { name: 'Low Risk', value: students.filter(s => s.status === 'Low Risk').length, color: '#10B981' },
    { name: 'Medium Risk', value: students.filter(s => s.status === 'Medium Risk').length, color: '#F59E0B' },
    { name: 'High Risk', value: students.filter(s => s.status === 'High Risk').length, color: '#EF4444' },
  ], [students]);

  const monthlyTrendData = React.useMemo(() => generateTrendData(students), [students]);

  // Student CRUD operations
  const addStudent = async () => {
    if (newStudent.name && newStudent.attendance && newStudent.avgGrade && newStudent.behavioralScore) {
      const attendance = parseInt(newStudent.attendance);
      const avgGrade = parseInt(newStudent.avgGrade);
      const behavioralScore = parseInt(newStudent.behavioralScore);
      const riskScore = predictDropoutRisk(attendance, avgGrade, behavioralScore);
      let status = 'Low Risk';
      if (riskScore >= 0.5) status = 'High Risk';
      else if (riskScore >= 0.4) status = 'Medium Risk';

      const nextNumber = students.length + 1;
      const studentId = `STU${String(nextNumber).padStart(3, '0')}`;

      const student = {
        id: studentId,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        age: parseInt(newStudent.age) || 0,
        gender: newStudent.gender || 'Male',
        coursesEnrolled: parseInt(newStudent.coursesEnrolled) || 0,
        coursesPassed: parseInt(newStudent.coursesPassed) || 0,
        attendance,
        avgGrade,
        behavioralScore,
        riskScore,
        status,
        scholarship: newStudent.scholarship || '0',
        debtor: newStudent.debtor || '0',
        tuitionUpToDate: newStudent.tuitionUpToDate || '1',
        lastActivity: 'Just added'
      };

      const mlPrediction = await mlIntegration.autoPredictStudent(student, {
        showNotification: false,
        updateCallback: (updatedStudent) => {
          setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        }
      });

      const finalStudent = mlPrediction ? {
        ...student,
        riskScore: mlPrediction.dropout_probability,
        riskLevel: mlPrediction.risk_level,
        status: mlPrediction.risk_level === 'CRITICAL' ? 'High Risk' :
          mlPrediction.risk_level === 'HIGH' ? 'High Risk' :
            mlPrediction.risk_level === 'MEDIUM' ? 'Medium Risk' : 'Low Risk',
        mlPrediction: mlPrediction.prediction,
        explanations: mlPrediction.explanations
      } : student;

      try {
        const { id, ...rest } = finalStudent;
        const studentPayload = { ...rest, studentId: finalStudent.id };

        const res = await fetch(`${process.env.REACT_APP_API_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentPayload)
        });

        if (res.ok) {
          const savedStudent = await res.json();
          setStudents([...students, { ...savedStudent, id: savedStudent.studentId }]);
        } else {
          throw new Error('Failed to save');
        }
      } catch (err) {
        console.error('Error saving student:', err);
        addToast('Failed to save student to database', 'error');
        return;
      }
      setNewStudent({
        name: '', email: '', phone: '', attendance: '', avgGrade: '', behavioralScore: '',
        coursesEnrolled: '', coursesPassed: '', age: '', gender: 'Male',
        scholarship: '0', debtor: '0', tuitionUpToDate: '1'
      });
      setShowAddStudentModal(false);
      addToast(`${finalStudent.name} added successfully!`, 'success', 3000);

      notificationManager.addNotification(
        createNotification(
          notificationManager.types.SUCCESS,
          'New Student Added',
          `${finalStudent.name} has been added to the system with ${finalStudent.status} status.`,
          { studentId: finalStudent.id, studentName: finalStudent.name }
        )
      );
    }
  };

  const handleBulkImport = async (data) => {
    const maxIdNum = students.reduce((max, s) => {
      const idStr = s.id || s.studentId || '';
      const match = idStr.match(/STU(\d+)/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);

    const importedStudents = data.map((row, index) => {
      const attendance = parseInt(row.attendance) || 0;
      const avgGrade = parseInt(row.avgGrade) || 0;
      const behavioralScore = parseInt(row.behavioralScore) || 0;
      const riskScore = predictDropoutRisk(attendance, avgGrade, behavioralScore);
      let status = 'Low Risk';
      if (riskScore >= 0.5) status = 'High Risk';
      else if (riskScore >= 0.4) status = 'Medium Risk';

      const nextNumber = maxIdNum + index + 1;
      const studentId = `STU${String(nextNumber).padStart(3, '0')}`;

      return {
        id: row.id || studentId,
        name: row.name,
        email: row.email,
        phone: row.phone,
        age: parseInt(row.age) || 0,
        gender: row.gender || 'Male',
        coursesEnrolled: parseInt(row.coursesEnrolled) || 0,
        coursesPassed: parseInt(row.coursesPassed) || 0,
        attendance,
        avgGrade,
        behavioralScore,
        riskScore,
        status,
        scholarship: row.scholarship || '0',
        debtor: row.debtor || '0',
        tuitionUpToDate: row.tuitionUpToDate || '1',
        lastActivity: 'Imported'
      };
    });

    try {
      const bulkPayload = importedStudents.map(s => {
        const { id, ...rest } = s;
        return { ...rest, studentId: id };
      });
      const response = await fetch(`${process.env.REACT_APP_API_URL}/students/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkPayload)
      });

      const result = await response.json();

      if (!response.ok && response.status !== 207) {
        throw new Error(result.message || 'Server responded with error');
      }

      if (result.success || response.status === 207) {
        const insertedCount = result.insertedCount || 0;
        const errorCount = result.errorCount || 0;

        if (insertedCount > 0) {
          addToast(`Successfully imported ${insertedCount} students.`, 'success', 3000);
          setTimeout(fetchStudents, 1000);
        }

        if (errorCount > 0) {
          addToast(`Skipped ${errorCount} duplicates.`, 'warning', 5000);
        }

        if (insertedCount > 0) {
          await mlIntegration.batchPredictStudents(importedStudents, {
            showProgress: true,
            updateCallback: (updated) => {
              setStudents(prev => {
                const existingIds = new Set(prev.map(s => s.id));
                const newStudents = updated.filter(s => !existingIds.has(s.id));
                const updatedExisting = prev.map(s => {
                  const match = updated.find(u => u.id === s.id);
                  return match || s;
                });
                return [...updatedExisting, ...newStudents];
              });
            },
            onComplete: (predicted) => {
              const highRiskCount = predicted.filter(s => s.riskLevel === 'CRITICAL' || s.riskLevel === 'HIGH').length;
              if (highRiskCount > 0) {
                addToast(`Analysis complete! ${highRiskCount} high-risk students found.`, 'warning', 4000);
              }
            }
          });

          notificationManager.addNotification(
            createNotification(
              notificationManager.types.SYSTEM,
              'Bulk Import Completed',
              `${insertedCount} students imported. ${errorCount > 0 ? `${errorCount} duplicates skipped.` : ''}`,
              { count: insertedCount }
            )
          );
        }
      } else {
        throw new Error(result.message || 'Import failed');
      }
    } catch (err) {
      console.error('Bulk save failed', err);
      addToast(`Failed to save imported students: ${err.message}`, 'error');
    }
  };

  const deleteStudent = async (studentId) => {
    setConfirmDialog({ isOpen: true, studentId });
  };

  const confirmDeleteStudent = async () => {
    const studentId = confirmDialog.studentId;
    setConfirmDialog({ isOpen: false, studentId: null });
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/students/${studentId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Delete failed', err);
      addToast('Failed to delete student from database', 'error');
      return;
    }

    setStudents(students.filter(s => s.id !== studentId));
    setShowStudentModal(false);
    addToast('Student deleted successfully', 'info', 3000);
    localStorage.removeItem(`notified_${studentId}`);

    notificationManager.addNotification(
      createNotification(
        notificationManager.types.SYSTEM,
        'Student Deleted',
        `Student has been removed from the system.`,
        { studentId }
      )
    );
  };

  const openEditModal = (student) => {
    setEditingStudent({
      ...student,
      coursesEnrolled: student.coursesEnrolled || '',
      coursesPassed: student.coursesPassed || '',
      age: student.age || '',
      scholarship: student.scholarship || '0',
      debtor: student.debtor || '0',
      tuitionUpToDate: student.tuitionUpToDate || '1'
    });
    setShowEditModal(true);
    setShowStudentModal(false);
  };

  const updateStudent = async () => {
    if (editingStudent.name && editingStudent.attendance && editingStudent.avgGrade && editingStudent.behavioralScore) {
      const attendance = parseInt(editingStudent.attendance);
      const avgGrade = parseInt(editingStudent.avgGrade);
      const behavioralScore = parseInt(editingStudent.behavioralScore);
      const coursesEnrolled = parseInt(editingStudent.coursesEnrolled) || 0;
      const coursesPassed = parseInt(editingStudent.coursesPassed) || 0;

      // Preserve original risk data for fallback
      const originalRiskScore = editingStudent.riskScore;
      const originalRiskLevel = editingStudent.riskLevel;
      const originalStatus = editingStudent.status;

      const {
        sem1Enrolled, sem1Approved, sem1Credited, sem1Evaluations, sem1Grade, sem1WithoutEval,
        sem2Enrolled, sem2Approved, sem2Credited, sem2Evaluations, sem2Grade, sem2WithoutEval,
        mlPrediction: oldMlPrediction, explanations: oldExplanations, riskLevel: _oldRiskLevel,
        ...cleanStudent
      } = editingStudent;

      const studentForPrediction = {
        ...cleanStudent,
        attendance,
        avgGrade,
        behavioralScore,
        coursesEnrolled,
        coursesPassed
      };

      const mlPrediction = await mlIntegration.autoPredictStudent(studentForPrediction, {
        showNotification: false,
        forceRefresh: true,
        updateCallback: (updatedStudent) => {
          setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        }
      });

      let updatedStudent;
      if (mlPrediction) {
        updatedStudent = {
          ...editingStudent,
          attendance,
          avgGrade,
          behavioralScore,
          coursesEnrolled,
          coursesPassed,
          riskScore: mlPrediction.dropout_probability,
          riskLevel: mlPrediction.risk_level,
          status: mlPrediction.risk_level === 'CRITICAL' || mlPrediction.risk_level === 'HIGH' ? 'High Risk' :
            mlPrediction.risk_level === 'MEDIUM' ? 'Medium Risk' : 'Low Risk',
          mlPrediction: mlPrediction.prediction,
          explanations: mlPrediction.explanations
        };
      } else {
        // ML service unavailable — use local formula as fallback, or keep original
        const fallbackRisk = originalRiskScore != null
          ? originalRiskScore
          : (1 - ((attendance / 100) * 0.3 + (avgGrade / 100) * 0.4 + (behavioralScore / 100) * 0.3));
        const fallbackStatus = fallbackRisk >= 0.5 ? 'High Risk' : fallbackRisk >= 0.3 ? 'Medium Risk' : 'Low Risk';

        updatedStudent = {
          ...editingStudent,
          attendance,
          avgGrade,
          behavioralScore,
          coursesEnrolled,
          coursesPassed,
          riskScore: fallbackRisk,
          riskLevel: originalRiskLevel || (fallbackRisk >= 0.7 ? 'CRITICAL' : fallbackRisk >= 0.5 ? 'HIGH' : fallbackRisk >= 0.3 ? 'MEDIUM' : 'LOW'),
          status: fallbackStatus
        };
      }

      try {
        const { id, _id, ...rest } = updatedStudent;
        const studentPayload = { ...rest, studentId: updatedStudent.id };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/students/${updatedStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentPayload)
        });

        if (!response.ok) {
          throw new Error('Update request failed');
        }
      } catch (err) {
        console.error('Update failed', err);
        addToast('Failed to update student in database', 'error');
        return;
      }

      setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      setShowEditModal(false);
      setEditingStudent(null);
      addToast(`${updatedStudent.name} updated successfully!`, 'success', 3000);

      notificationManager.addNotification(
        createNotification(
          notificationManager.types.SUCCESS,
          'Student Updated',
          `${updatedStudent.name}'s information has been updated.`,
          { studentId: updatedStudent.id, studentName: updatedStudent.name }
        )
      );
    }
  };

  const generateHighRiskNotifications = () => {
    const highRisk = students.filter(s => s.riskScore >= 0.5);
    highRisk.forEach(student => {
      notificationManager.addNotification(
        createNotification(
          notificationManager.types.HIGH_RISK,
          'High Risk Student Alert',
          `${student.name} (${student.id}) has a risk score of ${(student.riskScore * 100).toFixed(1)}%. Immediate attention required.`,
          { studentId: student.id, studentName: student.name, riskScore: student.riskScore }
        )
      );
    });
    addToast(`${highRisk.length} high-risk notifications created!`, 'success');
  };

  const toggleCompareStudent = (student) => {
    if (compareStudents.find(s => s.id === student.id)) {
      setCompareStudents(compareStudents.filter(s => s.id !== student.id));
    } else if (compareStudents.length < 4) {
      setCompareStudents([...compareStudents, student]);
    } else {
      addToast('Maximum 4 students can be compared', 'warning');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'all' || (student.status || '').toLowerCase().includes(filterRisk.toLowerCase());
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'riskScore') return b.riskScore - a.riskScore;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'attendance') return a.attendance - b.attendance;
    return 0;
  });

  const getRiskColor = (riskScore) => {
    if (riskScore >= 0.5) return '#EF4444';
    if (riskScore >= 0.4) return '#F59E0B';
    return '#10B981';
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  // Light theme background

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithNav interventionAlerts={interventionAlerts} selectedTab={selectedTab} onTabChange={setSelectedTab} />
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24">
        {selectedTab === 'overview' && (
          <OverviewTab
            students={students}
            totalStudents={totalStudents}
            highRiskStudents={highRiskStudents}
            avgAttendance={avgAttendance}
            interventionAlerts={interventionAlerts}
            monthlyTrendData={monthlyTrendData}
            riskDistribution={riskDistribution}
            onTabChange={setSelectedTab}
            onAddStudent={() => setShowAddStudentModal(true)}
            onImportCSV={() => fileInputRef.current?.click()}
            onExport={handleExport}
            onDownloadTemplate={downloadTemplate}
            onGenerateHighRiskNotifications={generateHighRiskNotifications}
            onStudentClick={handleStudentClick}
          />
        )}

        {selectedTab === 'students' && (
          <StudentsTab
            students={students}
            filteredStudents={filteredStudents}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterRisk={filterRisk}
            setFilterRisk={setFilterRisk}
            sortBy={sortBy}
            setSortBy={setSortBy}
            compareStudents={compareStudents}
            onShowComparison={() => setShowComparison(true)}
            onImportCSV={() => fileInputRef.current?.click()}
            onExport={handleExport}
            onAddStudent={() => setShowAddStudentModal(true)}
            onStudentClick={handleStudentClick}
            onToggleCompare={toggleCompareStudent}
            getRiskColor={getRiskColor}
          />
        )}

        {selectedTab === 'analytics' && (
          <AnalyticsTab
            students={students}
            totalStudents={totalStudents}
            monthlyTrendData={monthlyTrendData}
            onStudentClick={handleStudentClick}
          />
        )}

        {selectedTab === 'predictions' && (
          <PredictionsTab
            students={students}
            onStudentClick={handleStudentClick}
          />
        )}
      </main>

      {/* Modals */}
      {showAddStudentModal && (
        <AddStudentModal
          newStudent={newStudent}
          setNewStudent={setNewStudent}
          onClose={() => setShowAddStudentModal(false)}
          onSubmit={addStudent}
        />
      )}

      {showEditModal && editingStudent && (
        <EditStudentModal
          editingStudent={editingStudent}
          setEditingStudent={setEditingStudent}
          onClose={() => { setShowEditModal(false); setEditingStudent(null); }}
          onSubmit={updateStudent}
        />
      )}

      {showStudentModal && selectedStudent && (
        <StudentProfileModal
          student={selectedStudent}
          onClose={() => setShowStudentModal(false)}
          theme="light"
          onEdit={openEditModal}
          onDelete={deleteStudent}
        />
      )}

      {showComparison && (
        <StudentComparison
          students={compareStudents}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Styled Confirm Dialog — replaces window.confirm */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDeleteStudent}
        onCancel={() => setConfirmDialog({ isOpen: false, studentId: null })}
      />
    </div>
  );
};

export default EnhancedDashboard;
