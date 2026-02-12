import React from 'react';
import { Filter, GitCompare, Upload, Download, Plus, UserX } from 'lucide-react';
import { Search02Icon } from 'hugeicons-react';
import StudentCard from '../components/StudentCard';

const StudentsTab = ({
    students,
    filteredStudents,
    searchTerm,
    setSearchTerm,
    filterRisk,
    setFilterRisk,
    sortBy,
    setSortBy,
    compareStudents,
    onShowComparison,
    onImportCSV,
    onExport,
    onAddStudent,
    onStudentClick,
    onToggleCompare,
    getRiskColor
}) => {
    return (
        <div className="space-y-4 md:space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {students.length} students enrolled · {filteredStudents.length} shown
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4 flex-1">
                        <div className="relative flex-1 max-w-full md:max-w-md group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search02Icon className="h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="glass-input pl-14 py-3"
                                aria-label="Search students by name or ID"
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                            </div>
                            <select
                                value={filterRisk}
                                onChange={(e) => setFilterRisk(e.target.value)}
                                className="glass-select pl-14 py-3 w-full md:w-auto font-medium"
                                aria-label="Filter by risk level"
                            >
                                <option value="all">All Risk Levels</option>
                                <option value="low">Low Risk</option>
                                <option value="medium">Medium Risk</option>
                                <option value="high">High Risk</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="glass-select py-3 w-full md:w-auto font-medium"
                                aria-label="Sort students"
                            >
                                <option value="riskScore">Sort by Risk (High-Low)</option>
                                <option value="name">Sort by Name (A-Z)</option>
                                <option value="attendance">Sort by Attendance (Low-High)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        {compareStudents.length > 0 && (
                            <button
                                onClick={onShowComparison}
                                className="flex-1 md:flex-none px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-600 transition-all shadow-sm flex items-center justify-center space-x-2 text-sm"
                                aria-label={`Compare ${compareStudents.length} selected students`}
                            >
                                <GitCompare className="h-4 w-4" />
                                <span>Compare ({compareStudents.length})</span>
                            </button>
                        )}
                        <button onClick={onImportCSV} className="flex-1 md:flex-none px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-sm flex items-center justify-center space-x-2 text-sm" aria-label="Import students from CSV">
                            <Upload className="h-4 w-4" />
                            <span className="hidden md:inline">Import</span>
                        </button>
                        <button onClick={onExport} className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all shadow-sm flex items-center justify-center space-x-2 text-sm" aria-label="Export students as CSV">
                            <Download className="h-4 w-4" />
                            <span className="hidden md:inline">Export</span>
                        </button>
                        <button onClick={onAddStudent} className="flex-1 md:flex-none px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-all shadow-sm flex items-center justify-center space-x-2 text-sm" aria-label="Add new student">
                            <Plus className="h-4 w-4" />
                            <span className="hidden md:inline">Add</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty State when no students match filter */}
            {filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gray-100">
                        <UserX className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        No students found
                    </h3>
                    <p className="text-center max-w-md text-gray-500">
                        {searchTerm
                            ? `No students match "${searchTerm}". Try a different search term.`
                            : filterRisk !== 'all'
                                ? `No students in the "${filterRisk}" risk category.`
                                : 'No students have been added yet. Add your first student to get started.'
                        }
                    </p>
                    {students.length === 0 && (
                        <button
                            onClick={onAddStudent}
                            className="mt-6 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-all flex items-center space-x-2 shadow-sm"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add First Student</span>
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredStudents.map((student) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            onClick={onStudentClick}
                            isSelected={compareStudents.find(s => s.id === student.id)}
                            onToggleCompare={onToggleCompare}
                            getRiskColor={getRiskColor}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentsTab;
