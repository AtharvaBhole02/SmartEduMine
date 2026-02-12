import React, { useState } from 'react';
import {
    X, Mail, Phone, Calendar, MapPin,
    BookOpen, TrendingUp, AlertTriangle,
    DollarSign, Award, Clock, Activity,
    ChevronRight, User
} from 'lucide-react';
import AIRecommendations from '../AI/AIRecommendations';

const StudentDetailModal = ({ student, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!student) return null;

    const getRiskColor = (score) => {
        if (score >= 0.5) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (score >= 0.4) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Activity },
        { id: 'ai', label: 'AI Insights', icon: TrendingUp },
        { id: 'academic', label: 'Academic', icon: BookOpen },
        { id: 'financial', label: 'Financial', icon: DollarSign },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-white">

                {/* Header Section */}
                <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-end">
                    <div className="absolute top-0 right-0 p-4">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex items-end space-x-6 w-full translate-y-8">
                        <div className="h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-white">
                            {student.name.charAt(0)}
                        </div>
                        <div className="flex-1 pb-2">
                            <h2 className="text-3xl font-bold text-white">{student.name}</h2>
                            <div className="flex items-center space-x-4 text-blue-100 mt-1">
                                <span className="flex items-center text-sm"><User className="h-4 w-4 mr-1" /> {student.id}</span>
                                <span className="flex items-center text-sm"><Mail className="h-4 w-4 mr-1" /> {student.email}</span>
                            </div>
                        </div>
                        <div className="pb-2 hidden md:block">
                            <div className={`px-4 py-2 rounded-xl border backdrop-blur-md flex items-center space-x-2 ${getRiskColor(student.riskScore)} bg-white/90`}>
                                <AlertTriangle className="h-5 w-5" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-70">Risk Level</p>
                                    <p className="font-bold">{student.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mt-12 px-6 border-b border-slate-200 flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 flex items-center space-x-2 font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            <tab.icon className="h-4 w-4" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Stats Grid */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    label="Attendance"
                                    value={`${student.attendance}%`}
                                    icon={Calendar}
                                    color="emerald"
                                    trend="+2.5%"
                                />
                                <StatCard
                                    label="Avg Grade"
                                    value={`${student.avgGrade}%`}
                                    icon={Award}
                                    color="blue"
                                    trend="-1.2%"
                                />
                                <StatCard
                                    label="Behavior Score"
                                    value={`${student.behavioralScore}/10`}
                                    icon={User}
                                    color="purple"
                                    trend="Stable"
                                />

                                {/* Detailed Info Card */}
                                <div className="col-span-1 md:col-span-3 rounded-2xl p-6 border bg-white border-slate-200">
                                    <h3 className="text-lg font-bold mb-4 text-slate-900">Quick Actions</h3>
                                    <div className="flex flex-wrap gap-3">
                                        <ActionButton icon={Mail} label="Email Student" />
                                        <ActionButton icon={Phone} label="Call Guardian" />
                                        <ActionButton icon={Calendar} label="Schedule Meeting" />
                                        <ActionButton icon={BookOpen} label="View Transcript" />
                                    </div>
                                </div>
                            </div>

                            {/* Risk Analysis Card */}
                            <div className="rounded-2xl p-6 border flex flex-col items-center justify-center text-center bg-white border-slate-200">
                                <div className="relative h-40 w-40 mb-4">
                                    <svg className="h-full w-full" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#e2e8f0"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke={student.riskScore >= 0.5 ? '#ef4444' : student.riskScore >= 0.4 ? '#f59e0b' : '#10b981'}
                                            strokeWidth="3"
                                            strokeDasharray={`${student.riskScore * 100}, 100`}
                                            className="animate-[spin_1s_ease-out_reverse]"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-slate-900">
                                            {(student.riskScore * 100).toFixed(0)}%
                                        </span>
                                        <span className="text-xs text-slate-500 uppercase font-bold">Risk Score</span>
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold mb-2 text-slate-900">
                                    {student.status}
                                </h4>
                                <p className="text-sm text-slate-500">
                                    Based on recent academic and behavioral patterns.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* AI INSIGHTS TAB */}
                    {activeTab === 'ai' && (
                        <div className="animate-fadeIn">
                            <AIRecommendations student={student} />
                        </div>
                    )}

                    {/* ACADEMIC TAB */}
                    {activeTab === 'academic' && (
                        <div className="rounded-2xl p-6 border bg-white border-slate-200">
                            <h3 className="text-lg font-bold mb-6 text-slate-900">Academic History</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                                    <div>
                                        <p className="text-sm text-slate-500">Courses Enrolled</p>
                                        <p className="text-xl font-bold text-slate-900">{student.coursesEnrolled || 5}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Courses Passed</p>
                                        <p className="text-xl font-bold text-slate-900">{student.coursesPassed || 4}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Completion Rate</p>
                                        <p className="text-xl font-bold text-slate-900">
                                            {Math.round(((student.coursesPassed || 4) / (student.coursesEnrolled || 5)) * 100)}%
                                        </p>
                                    </div>
                                </div>
                                {/* Placeholder for Course List */}
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="p-4 rounded-xl flex justify-between items-center bg-slate-50">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                                                    C{i}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">Course {i}</p>
                                                    <p className="text-xs text-slate-500">Prof. Smith</p>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${i === 2 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                {i === 2 ? 'C-' : 'A'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FINANCIAL TAB */}
                    {activeTab === 'financial' && (
                        <div className="rounded-2xl p-6 border bg-white border-slate-200">
                            <h3 className="text-lg font-bold mb-6 text-slate-900">Financial Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Scholarship Status</p>
                                    <div className="flex items-center space-x-2">
                                        <Award className={`h-5 w-5 ${student.scholarship === 'Yes' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                        <p className="text-lg font-bold text-slate-900">
                                            {student.scholarship === 'Yes' ? 'Active Scholarship' : 'No Scholarship'}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Tuition Status</p>
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className={`h-5 w-5 ${student.tuitionUpToDate === 'Yes' ? 'text-emerald-500' : 'text-red-500'}`} />
                                        <p className="text-lg font-bold text-slate-900">
                                            {student.tuitionUpToDate === 'Yes' ? 'Paid Up To Date' : 'Payment Overdue'}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                                    <p className="text-sm text-slate-500 mb-1">Outstanding Debt</p>
                                    <div className="flex items-center space-x-2">
                                        <AlertTriangle className={`h-5 w-5 ${student.debt === 'Yes' ? 'text-red-500' : 'text-emerald-500'}`} />
                                        <p className="text-lg font-bold text-slate-900">
                                            {student.debt === 'Yes' ? 'Has Outstanding Debt' : 'No Debt'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ label, value, icon: Icon, color, trend }) => {
    const colors = {
        emerald: 'text-emerald-500 bg-emerald-500/10',
        blue: 'text-blue-500 bg-blue-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
    };

    return (
        <div className="p-5 rounded-2xl border transition-all hover:shadow-lg bg-white border-slate-200">
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-xl ${colors[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-emerald-100 text-emerald-700' :
                    trend === 'Stable' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {trend}
                </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{label}</p>
            <h4 className="text-2xl font-bold mt-1 text-slate-900">{value}</h4>
        </div>
    );
};

const ActionButton = ({ icon: Icon, label }) => (
    <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all bg-slate-100 hover:bg-slate-200 text-slate-700">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
    </button>
);

export default StudentDetailModal;
