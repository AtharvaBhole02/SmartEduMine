import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight, ChevronLeft, AlertTriangle, Users } from 'lucide-react';

const ITEMS_PER_PAGE = 25;

const PredictionsTab = ({ students, onStudentClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('all');
    const [sortBy, setSortBy] = useState('riskScore');
    const [currentPage, setCurrentPage] = useState(1);

    // Summary counts
    const summary = useMemo(() => ({
        critical: students.filter(s => s.riskScore >= 0.7).length,
        high: students.filter(s => s.riskScore >= 0.5 && s.riskScore < 0.7).length,
        medium: students.filter(s => s.riskScore >= 0.3 && s.riskScore < 0.5).length,
        low: students.filter(s => s.riskScore < 0.3).length,
    }), [students]);

    // Filtered + sorted students
    const filteredStudents = useMemo(() => {
        let result = students.filter(student => {
            const matchesSearch =
                (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (student.id || '').toLowerCase().includes(searchTerm.toLowerCase());

            let matchesFilter = true;
            if (filterRisk === 'critical') matchesFilter = student.riskScore >= 0.7;
            else if (filterRisk === 'high') matchesFilter = student.riskScore >= 0.5 && student.riskScore < 0.7;
            else if (filterRisk === 'medium') matchesFilter = student.riskScore >= 0.3 && student.riskScore < 0.5;
            else if (filterRisk === 'low') matchesFilter = student.riskScore < 0.3;

            return matchesSearch && matchesFilter;
        });

        result.sort((a, b) => {
            if (sortBy === 'riskScore') return b.riskScore - a.riskScore;
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
            if (sortBy === 'attendance') return a.attendance - b.attendance;
            return 0;
        });

        return result;
    }, [students, searchTerm, filterRisk, sortBy]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedStudents = filteredStudents.slice(
        (safeCurrentPage - 1) * ITEMS_PER_PAGE,
        safeCurrentPage * ITEMS_PER_PAGE
    );

    // Reset page on filter change
    const handleFilterChange = (value) => {
        setFilterRisk(value);
        setCurrentPage(1);
    };
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const getRiskBadgeClass = (score) => {
        if (score >= 0.7) return 'bg-red-100 text-red-700 border-red-200';
        if (score >= 0.5) return 'bg-orange-100 text-orange-700 border-orange-200';
        if (score >= 0.3) return 'bg-amber-100 text-amber-700 border-amber-200';
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    };

    const getRiskLabel = (score) => {
        if (score >= 0.7) return 'Critical';
        if (score >= 0.5) return 'High';
        if (score >= 0.3) return 'Medium';
        return 'Low';
    };

    if (students.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Predictions</h1>
                    <p className="text-sm text-gray-500 mt-1">ML-powered dropout risk predictions for all students</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No predictions available</h3>
                    <p className="text-sm text-gray-500 text-center max-w-md">
                        Add students to the system to see ML-powered dropout risk predictions here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Predictions</h1>
                <p className="text-sm text-gray-500 mt-1">ML-powered dropout risk predictions for all students</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                    onClick={() => handleFilterChange(filterRisk === 'critical' ? 'all' : 'critical')}
                    className={`p-3 rounded-xl border text-left transition-all ${filterRisk === 'critical' ? 'bg-red-50 border-red-200 ring-1 ring-red-300' : 'bg-white border-gray-200 hover:border-red-200'}`}
                >
                    <p className="text-xs font-medium text-gray-500 uppercase">Critical</p>
                    <p className="text-2xl font-bold text-red-600 mt-0.5">{summary.critical}</p>
                </button>
                <button
                    onClick={() => handleFilterChange(filterRisk === 'high' ? 'all' : 'high')}
                    className={`p-3 rounded-xl border text-left transition-all ${filterRisk === 'high' ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-300' : 'bg-white border-gray-200 hover:border-orange-200'}`}
                >
                    <p className="text-xs font-medium text-gray-500 uppercase">High</p>
                    <p className="text-2xl font-bold text-orange-600 mt-0.5">{summary.high}</p>
                </button>
                <button
                    onClick={() => handleFilterChange(filterRisk === 'medium' ? 'all' : 'medium')}
                    className={`p-3 rounded-xl border text-left transition-all ${filterRisk === 'medium' ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-300' : 'bg-white border-gray-200 hover:border-amber-200'}`}
                >
                    <p className="text-xs font-medium text-gray-500 uppercase">Medium</p>
                    <p className="text-2xl font-bold text-amber-600 mt-0.5">{summary.medium}</p>
                </button>
                <button
                    onClick={() => handleFilterChange(filterRisk === 'low' ? 'all' : 'low')}
                    className={`p-3 rounded-xl border text-left transition-all ${filterRisk === 'low' ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-300' : 'bg-white border-gray-200 hover:border-emerald-200'}`}
                >
                    <p className="text-xs font-medium text-gray-500 uppercase">Low</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-0.5">{summary.low}</p>
                </button>
            </div>

            {/* Search + Filter Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
                <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1 max-w-full md:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="glass-input pl-14 py-3"
                            aria-label="Search students"
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Filter className="h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        </div>
                        <select
                            value={filterRisk}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="glass-select pl-14 py-3 w-full md:w-auto font-medium"
                            aria-label="Filter by risk level"
                        >
                            <option value="all">All Risk Levels</option>
                            <option value="critical">Critical (≥70%)</option>
                            <option value="high">High (50–70%)</option>
                            <option value="medium">Medium (30–50%)</option>
                            <option value="low">Low (&lt;30%)</option>
                        </select>
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="glass-select py-3 w-full md:w-auto font-medium"
                        aria-label="Sort predictions"
                    >
                        <option value="riskScore">Sort by Risk (High→Low)</option>
                        <option value="name">Sort by Name (A→Z)</option>
                        <option value="attendance">Sort by Attendance (Low→High)</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="px-4 md:px-6 py-4 space-y-2">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-xl">
                            <div className="col-span-5 md:col-span-3">Student</div>
                            <div className="hidden md:block md:col-span-2">Attendance</div>
                            <div className="hidden md:block md:col-span-2">Grade</div>
                            <div className="col-span-3 md:col-span-2">Risk Score</div>
                            <div className="col-span-3 md:col-span-2">Status</div>
                            <div className="col-span-1 md:col-span-1"></div>
                        </div>

                        {/* Empty filter state */}
                        {paginatedStudents.length === 0 && (
                            <div className="py-12 flex flex-col items-center text-gray-400">
                                <AlertTriangle className="h-8 w-8 mb-2 opacity-50" />
                                <p className="text-sm">No students match the current filter</p>
                            </div>
                        )}

                        {/* Table Rows */}
                        {paginatedStudents.map((student) => (
                            <div
                                key={student.id}
                                className="grid grid-cols-12 gap-4 px-4 py-4 items-center cursor-pointer bg-white hover:bg-violet-50 rounded-xl border border-gray-100 transition-all group"
                                onClick={() => onStudentClick(student)}
                            >
                                <div className="col-span-5 md:col-span-3">
                                    <div className="text-sm md:text-base font-semibold text-gray-900">{student.name}</div>
                                    <div className="text-xs text-gray-500">{student.id}</div>
                                </div>
                                <div className="hidden md:block md:col-span-2 text-sm text-gray-700">{student.attendance}%</div>
                                <div className="hidden md:block md:col-span-2 text-sm text-gray-700">{student.avgGrade}%</div>
                                <div className="col-span-3 md:col-span-2 text-sm font-bold text-gray-900">{(student.riskScore * 100).toFixed(1)}%</div>
                                <div className="col-span-3 md:col-span-2 flex justify-start">
                                    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold border whitespace-nowrap ${getRiskBadgeClass(student.riskScore)}`}>
                                        {getRiskLabel(student.riskScore)}
                                    </span>
                                </div>
                                <div className="col-span-1 md:col-span-1 flex justify-end">
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-violet-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <p className="text-sm text-gray-500">
                            Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length}
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={safeCurrentPage === 1}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium text-gray-700 px-2">
                                {safeCurrentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={safeCurrentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictionsTab;
