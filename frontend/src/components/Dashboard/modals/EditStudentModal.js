import React from 'react';
import { X, Users, TrendingUp, Calendar, Loader2 } from 'lucide-react';

const EditStudentModal = ({
    editingStudent,
    setEditingStudent,
    onClose,
    onSubmit,
    isSubmitting = false
}) => {
    if (!editingStudent) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Edit Student</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{editingStudent.name} • {editingStudent.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close edit modal">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                            <Users className="h-4 w-4 mr-2 text-violet-500" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    value={editingStudent.name}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={editingStudent.email || ''}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    placeholder="e.g. john@university.edu"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    value={editingStudent.phone || ''}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    placeholder="e.g. +1 234 567 8900"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Age</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editingStudent.age || ''}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, age: Math.max(0, parseInt(e.target.value) || 0) })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                        placeholder="e.g. 20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Gender</label>
                                    <select
                                        value={editingStudent.gender}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Performance */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
                            Academic Performance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Attendance % *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editingStudent.attendance}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, attendance: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    placeholder="0-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Average Grade % *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editingStudent.avgGrade}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, avgGrade: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    placeholder="0-100"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    Behavioral Score *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={editingStudent.behavioralScore}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, behavioralScore: Math.min(10, Math.max(1, parseInt(e.target.value) || 0)) })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    placeholder="1-10"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Courses Enrolled</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editingStudent.coursesEnrolled || ''}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, coursesEnrolled: Math.max(0, parseInt(e.target.value) || 0) })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    placeholder="e.g. 5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Courses Passed</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={editingStudent.coursesPassed || ''}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, coursesPassed: Math.max(0, parseInt(e.target.value) || 0) })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                    placeholder="e.g. 4"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Status */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                            Financial Status
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Scholarship</label>
                                <select
                                    value={editingStudent.scholarship}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, scholarship: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                >
                                    <option value="0">No Scholarship</option>
                                    <option value="1">Scholarship Holder</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Debt Status</label>
                                <select
                                    value={editingStudent.debtor}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, debtor: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                >
                                    <option value="0">No Outstanding Debt</option>
                                    <option value="1">Has Outstanding Debt</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Tuition Payment</label>
                                <select
                                    value={editingStudent.tuitionUpToDate}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, tuitionUpToDate: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 text-sm"
                                >
                                    <option value="1">Tuition Up to Date</option>
                                    <option value="0">Tuition Not Paid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500">* Required fields for risk score calculation</p>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => !isSubmitting && onSubmit()}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-all shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditStudentModal;
