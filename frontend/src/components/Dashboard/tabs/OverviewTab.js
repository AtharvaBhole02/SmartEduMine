import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { AlertTriangle, Users, Bell, Calendar, Plus, Download, Upload, FileText, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';

/* Custom tooltip for the pie chart */
const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm">
                <span className="font-semibold" style={{ color: data.payload.color }}>{data.name}</span>
                <span className="text-gray-600 ml-2">{data.value} students</span>
            </div>
        );
    }
    return null;
};

/* Custom label renderer for pie slices */
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
    if (value === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight={600}>
            {value}
        </text>
    );
};

const OverviewTab = ({
    students,
    totalStudents,
    highRiskStudents,
    avgAttendance,
    interventionAlerts,
    monthlyTrendData,
    riskDistribution,
    onTabChange,
    onAddStudent,
    onImportCSV,
    onExport,
    onDownloadTemplate,
    onGenerateHighRiskNotifications,
    onStudentClick
}) => {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-2">Overview of student performance and risk analytics</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={onAddStudent} className="btn-primary flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Student</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid — with correct trendDirection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Students"
                    value={totalStudents}
                    icon={Users}
                    color="#6366f1"
                    subtitle="Active enrollments"
                    trend={`${students.filter(s => s.lastActivity === 'Just added').length} new this session`}
                    trendDirection="up"
                    onClick={() => onTabChange('students')}
                />
                <StatCard
                    title="High Risk"
                    value={highRiskStudents}
                    icon={AlertTriangle}
                    color="#ef4444"
                    subtitle="Require attention"
                    trend={`${((highRiskStudents / totalStudents) * 100 || 0).toFixed(1)}% of total`}
                    trendDirection={highRiskStudents > 0 ? 'down' : 'up'}
                    onClick={() => onTabChange('predictions')}
                />
                <StatCard
                    title="Avg Attendance"
                    value={`${avgAttendance}%`}
                    icon={Calendar}
                    color="#10b981"
                    subtitle="Across all students"
                    trend={avgAttendance < 75 ? "Below Target (75%)" : "On Track"}
                    trendDirection={avgAttendance < 75 ? 'down' : 'up'}
                />
                <StatCard
                    title="Alerts"
                    value={interventionAlerts}
                    icon={Bell}
                    color="#f59e0b"
                    subtitle="Active notifications"
                    trend="Active alerts"
                    trendDirection={interventionAlerts > 0 ? 'neutral' : 'up'}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Trend Chart */}
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">Dropout Trends</h3>
                        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600">
                            <option>Last 6 months</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={monthlyTrendData}>
                            <defs>
                                <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', fontSize: '0.8rem' }}
                            />
                            <Area type="monotone" dataKey="predictions" stroke="#6366f1" strokeWidth={2} fill="url(#colorPredictions)" isAnimationActive={false} />
                            <Area type="monotone" dataKey="dropoutRate" stroke="#10b981" strokeWidth={2} fill="url(#colorActual)" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center space-x-6 mt-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <span className="text-xs text-gray-500">Predicted</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-xs text-gray-500">Actual</span>
                        </div>
                    </div>
                </div>

                {/* Risk Distribution — with Tooltip + labels */}
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Risk Distribution</h3>
                    {totalStudents === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Users className="h-10 w-10 mb-3 opacity-50" />
                            <p className="text-sm">No student data yet</p>
                        </div>
                    ) : (
                        <>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={riskDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        dataKey="value"
                                        isAnimationActive={false}
                                        label={renderPieLabel}
                                    >
                                        {riskDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<PieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center space-x-4 mt-2">
                                {riskDistribution.map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        <span className="text-xs text-gray-500">{item.name}: {item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* High Risk Alert Section — with chevron indicators */}
            {highRiskStudents > 0 && (
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-red-50">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">High Risk Students</h3>
                                <p className="text-xs text-gray-500">{highRiskStudents} students require immediate attention</p>
                            </div>
                        </div>
                        <button
                            onClick={onGenerateHighRiskNotifications}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center space-x-1"
                            aria-label="Send high-risk alerts"
                        >
                            <Bell className="h-4 w-4" />
                            <span>Send Alerts</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                    <th className="pb-3">Student</th>
                                    <th className="pb-3">Attendance</th>
                                    <th className="pb-3">Grade</th>
                                    <th className="pb-3">Risk Score</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 w-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.filter(s => s.riskScore >= 0.5).slice(0, 5).map(student => (
                                    <tr key={student.id} onClick={() => onStudentClick(student)} className="cursor-pointer hover:bg-gray-50 group">
                                        <td className="py-3">
                                            <div className="font-medium text-gray-900 text-sm">{student.name}</div>
                                            <div className="text-xs text-gray-500">{student.id}</div>
                                        </td>
                                        <td className="py-3 text-sm text-gray-600">{student.attendance}%</td>
                                        <td className="py-3 text-sm text-gray-600">{student.avgGrade}%</td>
                                        <td className="py-3">
                                            <span className="text-sm font-semibold text-red-600">{(student.riskScore * 100).toFixed(0)}%</span>
                                        </td>
                                        <td className="py-3">
                                            <span className="risk-badge-high">{student.status}</span>
                                        </td>
                                        <td className="py-3">
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={onImportCSV} className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-medium border border-gray-200" aria-label="Import CSV file">
                        <Upload className="h-4 w-4" />
                        <span>Import CSV</span>
                    </button>
                    <button onClick={onExport} className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-medium border border-gray-200" aria-label="Export students as CSV">
                        <Download className="h-4 w-4" />
                        <span>Export CSV</span>
                    </button>
                    <button onClick={onDownloadTemplate} className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-medium border border-gray-200" aria-label="Download CSV template">
                        <FileText className="h-4 w-4" />
                        <span>Template</span>
                    </button>
                    <button onClick={onGenerateHighRiskNotifications} className="flex items-center justify-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 text-sm font-medium border border-gray-200" aria-label="Generate high-risk alerts">
                        <Bell className="h-4 w-4" />
                        <span>Alerts</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
