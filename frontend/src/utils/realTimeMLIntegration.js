/**
 * Real-Time ML Integration
 * Automatically predicts dropout risk when student data changes
 */

import { predictDropoutRisk, predictBatchDropoutRisk, mapStudentDataForPrediction, predictDropoutRiskDMSW, mapStudentDataForDMSW } from './dropoutPrediction';
import { notificationManager, createNotification } from './notificationManager';

class RealTimeMLIntegration {
  constructor() {
    this.predictionCache = new Map();
    this.pendingPredictions = new Set();
    this.batchQueue = [];
    this.batchTimeout = null;
    this.isMLServiceAvailable = false;
  }

  /**
   * Initialize ML service connection
   */
  async initialize() {
    try {
      const apiUrl = process.env.REACT_APP_ML_API_URL || 'http://localhost:5001';
      console.log('Attempts to connect to ML Service at:', apiUrl);
      const response = await fetch(`${apiUrl}/health`);
      const health = await response.json();
      this.isMLServiceAvailable = health.status === 'healthy';
      console.log('ML Service Status:', this.isMLServiceAvailable ? 'Connected' : 'Unavailable', health);
      return this.isMLServiceAvailable;
    } catch (error) {
      console.error('ML Service Logic Error:', error);
      console.warn('ML Service not available:', error.message);
      this.isMLServiceAvailable = false;
      return false;
    }
  }

  /**
   * Auto-predict when student is added or updated
   */
  async autoPredictStudent(student, options = {}) {
    if (!this.isMLServiceAvailable) {
      console.warn('ML Service marked as unavailable, attempting to reconnect...');
      await this.initialize();

      if (!this.isMLServiceAvailable) {
        console.warn('ML Service still not available, skipping prediction');
        return null;
      }
    }

    const {
      showNotification = true,
      updateCallback = null,
      forceRefresh = false
    } = options;

    // Check cache first
    const cacheKey = this.getCacheKey(student);
    if (!forceRefresh && this.predictionCache.has(cacheKey)) {
      const cached = this.predictionCache.get(cacheKey);
      if (Date.now() - cached.timestamp < 300000) { // 5 minutes
        return cached.prediction;
      }
    }

    // Avoid duplicate predictions unless forced
    if (!forceRefresh && this.pendingPredictions.has(student.id)) {
      console.log('Prediction already pending for student', student.id);
      return null;
    }

    this.pendingPredictions.add(student.id);

    try {
      // Use new DMSW mapper (only 9 fields instead of 35+)
      const mappedData = mapStudentDataForDMSW(student);

      // Use new DMSW Endpoint
      const response = await fetch(`${process.env.REACT_APP_ML_API_URL || 'http://localhost:5001'}/predict/dmsw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedData),
      });

      const result = await response.json();

      if (result.success) {
        const prediction = result.prediction;

        // Cache the prediction
        this.predictionCache.set(cacheKey, {
          prediction,
          timestamp: Date.now()
        });

        // Map ML risk level to status text
        let status = 'Low Risk';
        if (prediction.risk_level === 'CRITICAL' || prediction.risk_level === 'HIGH') {
          status = 'High Risk';
        } else if (prediction.risk_level === 'MEDIUM') {
          status = 'Medium Risk';
        }

        // Update student with prediction
        const updatedStudent = {
          ...student,
          riskScore: prediction.dropout_probability,
          riskLevel: prediction.risk_level,
          status: status, // Update status based on ML prediction
          academicRisk: prediction.academic_risk_score,
          socioeconomicRisk: prediction.socioeconomic_risk_score,
          mlPrediction: prediction.prediction,
          explanations: prediction.explanations,
          lastPredictionDate: new Date().toISOString()
        };

        // Callback to update student in state
        if (updateCallback) {
          updateCallback(updatedStudent);
        }

        // Show notification for high-risk students
        if (showNotification && (prediction.risk_level === 'CRITICAL' || prediction.risk_level === 'HIGH')) {
          this.showRiskAlert(student, prediction);
        }

        return prediction;
      }
    } catch (error) {
      console.error('Auto-prediction failed:', error);
    } finally {
      this.pendingPredictions.delete(student.id);
    }

    return null;
  }

  /**
   * Batch predict multiple students (optimized)
   */
  async batchPredictStudents(students, options = {}) {
    if (!this.isMLServiceAvailable) {
      console.warn('ML Service not available, skipping batch prediction');
      return [];
    }

    const {
      showProgress = true,
      updateCallback = null,
      onComplete = null
    } = options;

    try {
      const mappedStudents = students.map(s => ({
        id: s.id,
        data: mapStudentDataForDMSW(s)  // Use DMSW mapper for lightweight data
      }));

      if (showProgress) {
        console.log(`Predicting risk for ${students.length} students...`);
      }

      const result = await predictBatchDropoutRisk(mappedStudents.map(s => s.data));

      if (result.success) {
        const updatedStudents = students.map((student, index) => {
          const prediction = result.predictions[index];

          // Cache prediction
          const cacheKey = this.getCacheKey(student);
          this.predictionCache.set(cacheKey, {
            prediction,
            timestamp: Date.now()
          });

          // Map ML risk level to status text
          let status = 'Low Risk';
          if (prediction.risk_level === 'CRITICAL' || prediction.risk_level === 'HIGH') {
            status = 'High Risk';
          } else if (prediction.risk_level === 'MEDIUM') {
            status = 'Medium Risk';
          }

          return {
            ...student,
            riskScore: prediction.dropout_probability,
            riskLevel: prediction.risk_level,
            status: status, // Update status based on ML prediction
            academicRisk: prediction.academic_risk_score,
            socioeconomicRisk: prediction.socioeconomic_risk_score,
            mlPrediction: prediction.prediction,
            explanations: prediction.explanations,
            lastPredictionDate: new Date().toISOString()
          };
        });

        // Update callback
        if (updateCallback) {
          updateCallback(updatedStudents);
        }

        // Complete callback
        if (onComplete) {
          onComplete(updatedStudents);
        }

        // Show summary notification
        const highRisk = updatedStudents.filter(s => s.riskLevel === 'CRITICAL' || s.riskLevel === 'HIGH');
        if (highRisk.length > 0) {
          notificationManager.addNotification(
            createNotification(
              notificationManager.types.HIGH_RISK,
              'Batch Prediction Complete',
              `Found ${highRisk.length} high-risk students out of ${students.length} analyzed.`,
              { count: highRisk.length, total: students.length }
            )
          );
        }

        return updatedStudents;
      }
    } catch (error) {
      console.error('Batch prediction failed:', error);
    }

    return [];
  }

  /**
   * Queue student for batch prediction (debounced)
   */
  queueForBatchPrediction(student, callback) {
    this.batchQueue.push({ student, callback });

    // Clear existing timeout
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    // Process batch after 2 seconds of no new additions
    this.batchTimeout = setTimeout(() => {
      this.processBatchQueue();
    }, 2000);
  }

  /**
   * Process queued batch predictions
   */
  async processBatchQueue() {
    if (this.batchQueue.length === 0) return;

    const queue = [...this.batchQueue];
    this.batchQueue = [];

    const students = queue.map(item => item.student);
    const predictions = await this.batchPredictStudents(students, { showProgress: false });

    // Call individual callbacks
    queue.forEach((item, index) => {
      if (item.callback && predictions[index]) {
        item.callback(predictions[index]);
      }
    });
  }

  /**
   * Show risk alert notification
   */
  showRiskAlert(student, prediction) {
    const message = `${student.name} is at ${prediction.risk_level} risk (${(prediction.dropout_probability * 100).toFixed(1)}%)`;

    notificationManager.addNotification(
      createNotification(
        notificationManager.types.HIGH_RISK,
        'High Risk Student Detected',
        message,
        {
          studentId: student.id,
          studentName: student.name,
          riskLevel: prediction.risk_level,
          riskScore: prediction.dropout_probability,
          explanations: prediction.explanations
        }
      )
    );
  }

  /**
   * Get cache key for student
   */
  getCacheKey(student) {
    return `${student.id}_${student.attendance}_${student.avgGrade}_${student.behavioralScore}`;
  }

  /**
   * Clear prediction cache
   */
  clearCache() {
    this.predictionCache.clear();
  }

  /**
   * Get cached prediction
   */
  getCachedPrediction(student) {
    const cacheKey = this.getCacheKey(student);
    const cached = this.predictionCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < 300000) {
      return cached.prediction;
    }

    return null;
  }

  /**
   * Check if ML service is available
   */
  isAvailable() {
    return this.isMLServiceAvailable;
  }
}

// Create and export singleton instance
const instance = new RealTimeMLIntegration();

// Initialize asynchronously
setTimeout(() => {
  instance.initialize().catch(err => {
    console.warn('ML Integration initialization failed:', err);
  });
}, 0);

export const mlIntegration = instance;
export default instance;
