import React from 'react';
import { Plus, Loader2 } from 'lucide-react';

const AddStudentModal = ({
    newStudent,
    setNewStudent,
    onClose,
    onSubmit,
    isSubmitting = false
}) => {
    const handleSubmit = () => {
        if (!isSubmitting) onSubmit();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="relative max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                <div className="p-5 md:p-6 border-b border-gray-100">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Add New Student</h2>
                </div>
                <div className="p-5 md:p-6 space-y-5 md:space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label htmlFor="add-name" className="block text-xs font-medium text-gray-600 mb-1">Student Name <span className="text-red-500">*</span></label>
                                <input id="add-name" type="text" placeholder="e.g. John Doe" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="glass-input" />
                            </div>
                            <div>
                                <label htmlFor="add-email" className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                <input id="add-email" type="email" placeholder="e.g. john@example.com" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="glass-input" />
                            </div>
                            <div>
                                <label htmlFor="add-phone" className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                                <input id="add-phone" type="tel" placeholder="e.g. +1234567890" value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} className="glass-input" />
                            </div>
                            <div>
                                <label htmlFor="add-age" className="block text-xs font-medium text-gray-600 mb-1">Age</label>
                                <input
                                    id="add-age"
                                    type="number"
                                    placeholder="e.g. 20"
                                    min="0"
                                    value={newStudent.age}
                                    onChange={(e) => setNewStudent({ ...newStudent, age: Math.max(0, parseInt(e.target.value) || 0) })}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="add-gender" className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                                <select id="add-gender" value={newStudent.gender} onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })} className="glass-select">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Academic Performance */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Academic Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            <div>
                                <label htmlFor="add-attendance" className="block text-xs font-medium text-gray-600 mb-1">Attendance % <span className="text-red-500">*</span></label>
                                <input
                                    id="add-attendance"
                                    type="number"
                                    placeholder="0–100"
                                    min="0"
                                    max="100"
                                    value={newStudent.attendance}
                                    onChange={(e) => setNewStudent({ ...newStudent, attendance: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="add-grade" className="block text-xs font-medium text-gray-600 mb-1">Avg Grade % <span className="text-red-500">*</span></label>
                                <input
                                    id="add-grade"
                                    type="number"
                                    placeholder="0–100"
                                    min="0"
                                    max="100"
                                    value={newStudent.avgGrade}
                                    onChange={(e) => setNewStudent({ ...newStudent, avgGrade: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="add-behavioral" className="block text-xs font-medium text-gray-600 mb-1">Behavioral Score <span className="text-red-500">*</span></label>
                                <input
                                    id="add-behavioral"
                                    type="number"
                                    placeholder="1–10"
                                    min="1"
                                    max="10"
                                    value={newStudent.behavioralScore}
                                    onChange={(e) => setNewStudent({ ...newStudent, behavioralScore: Math.min(10, Math.max(1, parseInt(e.target.value) || 0)) })}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="add-enrolled" className="block text-xs font-medium text-gray-600 mb-1">Courses Enrolled</label>
                                <input
                                    id="add-enrolled"
                                    type="number"
                                    placeholder="e.g. 5"
                                    min="0"
                                    value={newStudent.coursesEnrolled}
                                    onChange={(e) => setNewStudent({ ...newStudent, coursesEnrolled: Math.max(0, parseInt(e.target.value) || 0) })}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="add-passed" className="block text-xs font-medium text-gray-600 mb-1">Courses Passed</label>
                                <input
                                    id="add-passed"
                                    type="number"
                                    placeholder="e.g. 4"
                                    min="0"
                                    value={newStudent.coursesPassed}
                                    onChange={(e) => setNewStudent({ ...newStudent, coursesPassed: Math.max(0, parseInt(e.target.value) || 0) })}
                                    className="glass-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Status */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Financial Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            <div>
                                <label htmlFor="add-scholarship" className="block text-xs font-medium text-gray-600 mb-1">Scholarship</label>
                                <select id="add-scholarship" value={newStudent.scholarship} onChange={(e) => setNewStudent({ ...newStudent, scholarship: e.target.value })} className="glass-select">
                                    <option value="0">No Scholarship</option>
                                    <option value="1">Scholarship Holder</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="add-debtor" className="block text-xs font-medium text-gray-600 mb-1">Debt Status</label>
                                <select id="add-debtor" value={newStudent.debtor} onChange={(e) => setNewStudent({ ...newStudent, debtor: e.target.value })} className="glass-select">
                                    <option value="0">No Outstanding Debt</option>
                                    <option value="1">Has Outstanding Debt</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="add-tuition" className="block text-xs font-medium text-gray-600 mb-1">Tuition Status</label>
                                <select id="add-tuition" value={newStudent.tuitionUpToDate} onChange={(e) => setNewStudent({ ...newStudent, tuitionUpToDate: e.target.value })} className="glass-select">
                                    <option value="1">Tuition Up to Date</option>
                                    <option value="0">Tuition Not Paid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500">Fields marked with <span className="text-red-500">*</span> are required</p>

                    <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4 pt-2">
                        <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    <span>Add Student</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStudentModal;
