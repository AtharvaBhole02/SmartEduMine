import React from 'react';
import { GitCompare, Award, AlertTriangle, CreditCard } from 'lucide-react';

const StudentCard = ({ student, onClick, isSelected, onToggleCompare, getRiskColor }) => {
    // Get progress bar color class
    const getProgressColor = (value, type) => {
        if (type === 'attendance') {
            if (value >= 75) return 'progress-bar-fill-green';
            if (value >= 50) return 'progress-bar-fill-yellow';
            return 'progress-bar-fill-red';
        }
        if (value >= 60) return 'progress-bar-fill-green';
        if (value >= 40) return 'progress-bar-fill-yellow';
        return 'progress-bar-fill-red';
    };

    // Get status badge style
    const getStatusBadgeClass = (riskScore) => {
        if (riskScore >= 0.5) return 'bg-red-50 text-red-600 border-red-100';
        if (riskScore >= 0.4) return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    };

    // Financial indicators
    const hasScholarship = student.scholarship === '1' || student.scholarship === 1;
    const hasDebt = student.debtor === '1' || student.debtor === 1;
    const tuitionPaid = student.tuitionUpToDate === '1' || student.tuitionUpToDate === 1;

    return (
        <div
            className={`group card-flat bg-white rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5
                 ${isSelected ? 'ring-2 ring-violet-500 border-violet-200' : 'border-gray-100 hover:border-violet-200'}`}
        >
            {/* Header with name + risk + compare */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0 mr-3" onClick={() => onClick(student)}>
                    <h3 className="font-semibold text-[15px] text-gray-900 truncate pr-2">
                        {student.name}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-gray-500 truncate">
                        ID: {student.id}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Risk badge */}
                    <div
                        className="px-3 py-1.5 rounded-full text-white font-semibold text-xs shadow-sm flex items-center gap-1.5"
                        style={{ backgroundColor: getRiskColor(student.riskScore) }}
                    >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>{(student.riskScore * 100).toFixed(0)}%</span>
                    </div>
                    {/* Compare button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleCompare(student);
                        }}
                        className={`p-2 rounded-xl transition-all ${isSelected ? 'bg-violet-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        aria-label={isSelected ? 'Remove from comparison' : 'Add to comparison'}
                    >
                        <GitCompare className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Metrics with progress bars */}
            <div className="space-y-3" onClick={() => onClick(student)}>
                {/* Attendance */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-gray-500">Attendance</span>
                        <span className="text-sm font-semibold text-gray-900">{student.attendance}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className={`progress-bar-fill ${getProgressColor(student.attendance, 'attendance')}`}
                            style={{ width: `${student.attendance}%` }}
                        />
                    </div>
                </div>

                {/* Grade */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-gray-500">Average Grade</span>
                        <span className="text-sm font-semibold text-gray-900">{student.avgGrade}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className={`progress-bar-fill ${getProgressColor(student.avgGrade, 'grade')}`}
                            style={{ width: `${student.avgGrade}%` }}
                        />
                    </div>
                </div>

                {/* Behavioral score */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs font-medium text-gray-500">Behavioral</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-50 text-gray-900 border border-slate-200">
                        {student.behavioralScore}/10
                    </span>
                </div>
            </div>

            {/* Financial indicators */}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap" onClick={() => onClick(student)}>
                <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border
                    ${hasScholarship ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-gray-500 bg-gray-50 border-gray-100'}`}
                    title={hasScholarship ? 'Scholarship holder' : 'No scholarship'}>
                    <Award className="h-3.5 w-3.5" />
                    <span>{hasScholarship ? 'Scholar' : 'No Aid'}</span>
                </div>
                <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border
                    ${hasDebt ? 'text-red-600 bg-red-50 border-red-100' : 'text-gray-500 bg-gray-50 border-gray-100'}`}
                    title={hasDebt ? 'Has outstanding debt' : 'No debt'}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{hasDebt ? 'Debt' : 'No Debt'}</span>
                </div>
                <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border
                    ${tuitionPaid ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'}`}
                    title={tuitionPaid ? 'Tuition up to date' : 'Tuition not paid'}>
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>{tuitionPaid ? 'Paid' : 'Unpaid'}</span>
                </div>
            </div>

            {/* Status + last activity */}
            <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                    {student.lastActivity || 'No recent activity'}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadgeClass(student.riskScore)}`}>
                    {student.status}
                </span>
            </div>
        </div>
    );
};

export default StudentCard;
