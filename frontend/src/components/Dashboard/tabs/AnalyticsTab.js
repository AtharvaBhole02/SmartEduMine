import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, Users } from 'lucide-react';

const AnalyticsTab = ({
    students,
    totalStudents,
    monthlyTrendData,
    onStudentClick
}) => {
    // Empty state guard
    if (students.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
                    <p className="text-sm text-gray-500 mt-2">In-depth analysis of student performance and risk factors</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                        <Users className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No data to analyze</h3>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                        Add students to the system to see performance analytics and risk factor breakdowns.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-500 mt-2">In-depth analysis of student performance and risk factors</p>
            </div>

            {/* Risk Distribution Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 border-2 border-red-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Critical/High Risk</h3>
                        <div className="p-2 rounded-xl bg-red-50">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                    <div className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2">
                        {students.filter(s => s.riskScore >= 0.5).length}
                    </div>
                    <p className="text-sm text-gray-500">
                        {totalStudents > 0 ? ((students.filter(s => s.riskScore >= 0.5).length / totalStudents) * 100).toFixed(1) : '0.0'}% of total students
                    </p>
                    <div className="mt-4 space-y-2">
                        {students.filter(s => s.riskScore >= 0.5).slice(0, 3).map(s => (
                            <div key={s.id} className="flex justify-between items-center text-xs bg-red-50 rounded-lg p-2 border border-red-100 cursor-pointer hover:bg-red-100" onClick={() => onStudentClick(s)}>
                                <span className="text-gray-900 font-medium truncate">{s.name}</span>
                                <span className="text-red-600 font-bold">{(s.riskScore * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 border-2 border-amber-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Medium Risk</h3>
                        <div className="p-2 rounded-xl bg-amber-50">
                            <AlertTriangle className="h-6 w-6 text-amber-500" />
                        </div>
                    </div>
                    <div className="text-4xl md:text-5xl font-extrabold text-amber-600 mb-2">
                        {students.filter(s => s.riskScore >= 0.4 && s.riskScore < 0.5).length}
                    </div>
                    <p className="text-sm text-gray-500">
                        {totalStudents > 0 ? ((students.filter(s => s.riskScore >= 0.4 && s.riskScore < 0.5).length / totalStudents) * 100).toFixed(1) : '0.0'}% of total students
                    </p>
                    <div className="mt-4 space-y-2">
                        {students.filter(s => s.riskScore >= 0.4 && s.riskScore < 0.5).slice(0, 3).map(s => (
                            <div key={s.id} className="flex justify-between items-center text-xs bg-amber-50 rounded-lg p-2 border border-amber-100 cursor-pointer hover:bg-amber-100" onClick={() => onStudentClick(s)}>
                                <span className="text-gray-900 font-medium truncate">{s.name}</span>
                                <span className="text-amber-600 font-bold">{(s.riskScore * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 border-2 border-emerald-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Low Risk</h3>
                        <div className="p-2 rounded-xl bg-emerald-50">
                            <Users className="h-6 w-6 text-emerald-500" />
                        </div>
                    </div>
                    <div className="text-4xl md:text-5xl font-extrabold text-emerald-600 mb-2">
                        {students.filter(s => s.riskScore < 0.4).length}
                    </div>
                    <p className="text-sm text-gray-500">
                        {totalStudents > 0 ? ((students.filter(s => s.riskScore < 0.4).length / totalStudents) * 100).toFixed(1) : '0.0'}% of total students
                    </p>
                    <div className="mt-4 space-y-2">
                        {students.filter(s => s.riskScore < 0.4).slice(0, 3).map(s => (
                            <div key={s.id} className="flex justify-between items-center text-xs bg-emerald-50 rounded-lg p-2 border border-emerald-100 cursor-pointer hover:bg-emerald-100" onClick={() => onStudentClick(s)}>
                                <span className="text-gray-900 font-medium truncate">{s.name}</span>
                                <span className="text-emerald-600 font-bold">{(s.riskScore * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Risk Factors Analysis */}
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-8 border border-gray-100">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Key Risk Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm font-medium">Low Attendance</span>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{students.filter(s => s.attendance < 60).length}</div>
                        <div className="text-xs text-gray-500 mt-1">Students below 60%</div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm font-medium">Poor Grades</span>
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{students.filter(s => s.avgGrade < 60).length}</div>
                        <div className="text-xs text-gray-500 mt-1">Students below 60%</div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-sm font-medium">Behavioral</span>
                            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{students.filter(s => s.behavioralScore < 5).length}</div>
                        <div className="text-xs text-gray-500 mt-1">Score below 5/10</div>
                    </div>
                </div>
            </div>

            {/* Student Performance Analytics */}
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-8 border border-gray-100">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Student Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={students.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px' }} angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Bar dataKey="attendance" fill="#7c3aed" name="Attendance %" isAnimationActive={false} />
                        <Bar dataKey="avgGrade" fill="#10b981" name="Avg Grade %" isAnimationActive={false} />
                        <Bar dataKey="behavioralScore" fill="#f59e0b" name="Behavioral (×10)" isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Intervention Effectiveness */}
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-8 border border-gray-100">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Risk Trends Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="dropoutRate" stroke="#ef4444" strokeWidth={3} name="Actual Dropout %" isAnimationActive={false} dot={{ r: 4 }} activeDot={false} />
                        <Line type="monotone" dataKey="predictions" stroke="#7c3aed" strokeWidth={3} name="Predicted %" isAnimationActive={false} dot={{ r: 4 }} activeDot={false} />
                        <Line type="monotone" dataKey="interventions" stroke="#10b981" strokeWidth={3} name="Interventions" isAnimationActive={false} dot={{ r: 4 }} activeDot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Action Items & Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-8 border border-gray-100">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Priority Action Items</h3>
                <div className="space-y-3">
                    {students
                        .filter(s => s.riskScore >= 0.5)
                        .sort((a, b) => b.riskScore - a.riskScore)
                        .slice(0, 5)
                        .map((student, index) => (
                            <div
                                key={student.id}
                                onClick={() => onStudentClick(student)}
                                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-violet-50 rounded-xl cursor-pointer transition-all border border-gray-100"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-gray-900 font-semibold">{student.name}</h4>
                                        <p className="text-xs text-gray-500">
                                            {student.attendance < 60 && 'Low attendance • '}
                                            {student.avgGrade < 60 && 'Poor grades • '}
                                            {student.behavioralScore < 5 && 'Behavioral concerns'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <div className="text-red-600 font-bold text-lg">{(student.riskScore * 100).toFixed(0)}%</div>
                                        <div className="text-xs text-gray-500">Risk Score</div>
                                    </div>
                                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                                        Take Action
                                    </button>
                                </div>
                            </div>
                        ))}
                    {students.filter(s => s.riskScore >= 0.5).length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No high-risk students at this time</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsTab;
