const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: String,
    age: Number,
    gender: String,
    attendance: {
        type: Number,
        default: 0
    },
    avgGrade: {
        type: Number,
        default: 0
    },
    behavioralScore: {
        type: Number,
        default: 0
    },
    riskScore: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Low Risk'
    },
    // ML Fields
    riskLevel: {
        type: String,
        default: 'LOW'
    },
    academicRisk: {
        type: Number,
        default: 0
    },
    socioeconomicRisk: {
        type: Number,
        default: 0
    },
    mlPrediction: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    explanations: [{
        type: String
    }],
    lastPredictionDate: {
        type: Date
    },
    coursesEnrolled: {
        type: Number,
        default: 0
    },
    coursesPassed: {
        type: Number,
        default: 0
    },
    scholarship: {
        type: String,
        default: '0'
    },
    debtor: {
        type: String,
        default: '0'
    },
    tuitionUpToDate: {
        type: String,
        default: '1'
    },
    lastActivity: {
        type: String,
        default: 'Just now'
    },
    notes: [{
        id: String,
        text: String,
        date: Date,
        author: String
    }],
    activities: [{
        id: String,
        type: String,
        title: String,
        description: String,
        timestamp: Date,
        author: String
    }],
    counselor: {
        id: String,
        name: String,
        email: String,
        specialization: String
    },
    guardians: [{
        id: String,
        name: String,
        relation: String,
        phone: String,
        email: String,
        isPrimary: Boolean
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', StudentSchema);
