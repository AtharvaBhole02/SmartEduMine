import React, { useState, useMemo } from 'react';
import {
    X, Mail, Phone, Calendar,
    Clock, User, Shield,
    MessageSquare, FileText, Edit3, Trash2,
    ChevronDown, Sparkles, Users, CheckCircle, AlertTriangle
} from 'lucide-react';
import StudentNotes from './StudentNotes';
import ActivityTimeline from './ActivityTimeline';
import CounselorAssignment from './CounselorAssignment';
import ParentGuardianInfo from './ParentGuardianInfo';
import FollowUpScheduler from '../Communications/FollowUpScheduler';
import EmailSMSTemplates from '../Communications/EmailSMSTemplates';
import AIRecommendations from '../AI/AIRecommendations';
import { studentDataManager, mockCounselors } from '../../utils/studentDataManager';
import { useToast } from '../Notifications/ToastContainer';

/* ======================================================================
   Progressive Disclosure Student Profile Modal (Simplified)
   - Minimalist header (Avatar + Name + Risk only)
   - Groups related sections to reduce list length
   ====================================================================== */

const StudentProfileModal = ({ student, onClose, onEdit, onDelete }) => {
    const { addToast } = useToast();

    // Control which sections are expanded
    const [expanded, setExpanded] = useState(() => {
        // Only expand AI by default for high risk
        return { ai: student?.riskScore >= 0.5 };
    });

    if (!student) return null;

    const toggle = (key) =>
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

    // Risk styling
    const riskColor =
        student.riskScore >= 0.5 ? '#ef4444' :
            student.riskScore >= 0.3 ? '#f59e0b' : '#10b981';
    const riskLabel =
        student.riskScore >= 0.5 ? 'High Risk' :
            student.riskScore >= 0.3 ? 'Medium Risk' : 'Low Risk';
    const riskBg =
        student.riskScore >= 0.5 ? 'bg-red-50 text-red-700 border-red-200' :
            student.riskScore >= 0.3 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200';

    // Data getters
    const activities = studentDataManager.getActivities(student.id);
    const notes = studentDataManager.getNotes(student.id);
    const followUps = studentDataManager.getFollowUps(student.id);
    const counselor = studentDataManager.getCounselor(student.id);
    const guardians = studentDataManager.getGuardians(student.id);
    const pendingFollowUps = followUps.filter(f => !f.completed).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl h-[100dvh] sm:h-[85vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden bg-slate-50">

                {/* ──── MINIMALIST HEADER ──── */}
                <div className="flex-shrink-0 bg-white border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Avatar + Risk Ring */}
                            <div className="relative">
                                <div className="h-14 w-14 rounded-full flex items-center justify-center text-xl font-bold bg-slate-100 text-slate-700 border-4 border-white shadow-sm ring-1 ring-slate-200">
                                    {student.name.charAt(0)}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center ${student.riskScore >= 0.5 ? 'bg-red-500' : student.riskScore >= 0.3 ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                                    <span className="text-[10px] font-bold text-white">{(student.riskScore * 100).toFixed(0)}</span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                                    {student.name}
                                </h2>
                                <p className={`text-xs font-medium mt-0.5 ${student.riskScore >= 0.5 ? 'text-red-600' : student.riskScore >= 0.3 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {riskLabel} • {student.id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onEdit(student)}
                                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <Edit3 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ──── SCROLLABLE CONTENT ──── */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-5 space-y-3">

                        {/* 1. AI Insights (Primary) */}
                        <DisclosureSection
                            icon={Sparkles}
                            title="AI Insights & Recommendations"
                            summary={
                                student.riskScore >= 0.5 ?
                                    <Badge label="Critical Actions" color="red" /> :
                                    <Badge label="View Analysis" color="slate" />
                            }
                            accentColor={riskColor}
                            isOpen={expanded.ai}
                            onToggle={() => toggle('ai')}
                        >
                            <AIRecommendations student={student} />
                        </DisclosureSection>

                        {/* 2. Key Statistics & Detail View */}
                        <div className="grid grid-cols-3 gap-3 mb-2">
                            <StatCard label="Attendance" value={`${student.attendance}%`} color="blue" />
                            <StatCard label="Average Grade" value={`${student.avgGrade}%`} color={student.avgGrade < 50 ? 'red' : 'emerald'} />
                            <StatCard label="Behavioral" value={`${student.behavioralScore}/10`} color="purple" />
                        </div>

                        {/* 3. Support & Actions (Grouped) */}
                        <DisclosureSection
                            icon={Shield}
                            title="Support & Actions"
                            summary={
                                <div className="flex gap-2">
                                    {counselor && <Badge label="Counselor" color="blue" />}
                                    {pendingFollowUps > 0 && <Badge label={`${pendingFollowUps} tasks`} color="amber" />}
                                </div>
                            }
                            accentColor="#3b82f6"
                            isOpen={expanded.support}
                            onToggle={() => toggle('support')}
                        >
                            <div className="space-y-6">
                                {/* Sub-section: Counselor */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Counselor Assignment</h4>
                                    <CounselorAssignment
                                        studentId={student.id}
                                        assignedCounselor={counselor}
                                        counselors={mockCounselors}
                                        onAssign={(id, c) => {
                                            studentDataManager.assignCounselor(id, c);
                                            addToast(`${c.name} assigned`, 'success');
                                        }}
                                    />
                                </div>

                                {/* Sub-section: Follow-ups */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Follow-up Tasks</h4>
                                    <FollowUpScheduler
                                        studentId={student.id}
                                        followUps={followUps}
                                        onAdd={(id, f) => {
                                            studentDataManager.addFollowUp(id, f);
                                            addToast('Task scheduled', 'success');
                                        }}
                                        onComplete={(id, fid) => {
                                            studentDataManager.completeFollowUp(id, fid);
                                            addToast('Task completed', 'success');
                                        }}
                                        onDelete={(id, fid) => {
                                            studentDataManager.deleteFollowUp(id, fid);
                                            addToast('Task deleted', 'info');
                                        }}
                                    />
                                </div>

                                {/* Sub-section: Communication */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Send Communication</h4>
                                    <EmailSMSTemplates
                                        student={student}
                                        onSend={(data) => {
                                            studentDataManager.addActivity(student.id, {
                                                type: data.type,
                                                title: `${data.type} Sent`,
                                                description: data.message,
                                                author: 'User'
                                            });
                                            addToast('Message sent!', 'success');
                                        }}
                                    />
                                </div>
                            </div>
                        </DisclosureSection>

                        {/* 4. History (Activity + Notes) */}
                        <DisclosureSection
                            icon={Clock}
                            title="History & Notes"
                            summary={<span className="text-xs text-slate-500">{activities.length} activities • {notes.length} notes</span>}
                            accentColor="#6366f1"
                            isOpen={expanded.history}
                            onToggle={() => toggle('history')}
                        >
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Recent Activity</h4>
                                    <ActivityTimeline activities={activities} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Student Notes</h4>
                                    <StudentNotes
                                        studentId={student.id}
                                        notes={notes}
                                        onAddNote={(id, note) => {
                                            studentDataManager.addNote(id, note);
                                            addToast('Note added', 'success');
                                        }}
                                        onUpdateNote={(id, noteId, text) => {
                                            studentDataManager.updateNote(id, noteId, text);
                                            addToast('Note updated', 'success');
                                        }}
                                        onDeleteNote={(id, noteId) => {
                                            studentDataManager.deleteNote(id, noteId);
                                            addToast('Note deleted', 'info');
                                        }}
                                    />
                                </div>
                            </div>
                        </DisclosureSection>

                        {/* 5. Personal Details (Collapsed by default) */}
                        <DisclosureSection
                            icon={User}
                            title="Personal Details"
                            summary={<span className="text-xs text-slate-500">Contact & Guardians</span>}
                            accentColor="#cbd5e1"
                            isOpen={expanded.details}
                            onToggle={() => toggle('details')}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <InfoItem icon={Mail} label="Email" value={student.email || '—'} />
                                <InfoItem icon={Phone} label="Phone" value={student.phone || '—'} />
                                <InfoItem icon={Calendar} label="Age" value={student.age ? `${student.age} years` : '—'} />
                                <InfoItem icon={User} label="Gender" value={student.gender || '—'} />
                            </div>

                            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 border-t border-slate-100 pt-4">Parent / Guardian</h4>
                            <ParentGuardianInfo
                                studentId={student.id}
                                guardians={guardians}
                                onAdd={(id, g) => studentDataManager.addGuardian(id, g)}
                                onUpdate={(id, gid, d) => studentDataManager.updateGuardian(id, gid, d)}
                                onDelete={(id, gid) => studentDataManager.deleteGuardian(id, gid)}
                            />
                        </DisclosureSection>

                        <div className="pt-4 flex justify-center">
                            <button
                                onClick={() => onDelete(student.id)}
                                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete Student Record
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};


/* ──────────────────────────────────────────────────────────
   Helper Components
   ────────────────────────────────────────────────────────── */

const DisclosureSection = ({ icon: Icon, title, summary, accentColor, isOpen, onToggle, children }) => (
    <div
        className="rounded-xl bg-white border border-slate-200 overflow-hidden transition-all duration-300"
        style={{
            boxShadow: isOpen ? '0 4px 12px rgba(0,0,0,0.05)' : '0 1px 2px rgba(0,0,0,0.02)'
        }}
    >
        <button
            onClick={onToggle}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors group"
        >
            <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-slate-100' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                <Icon className="h-5 w-5" style={{ color: accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-800">{title}</h3>
                {!isOpen && <div className="mt-0.5">{summary}</div>}
            </div>
            <ChevronDown
                className={`h-5 w-5 text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>

        <div className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-4 pb-5 pt-1 border-t border-slate-50">
                {children}
            </div>
        </div>
    </div>
);

const Badge = ({ label, color }) => {
    const colors = {
        red: 'bg-red-100 text-red-700',
        amber: 'bg-amber-100 text-amber-700',
        blue: 'bg-blue-100 text-blue-700',
        emerald: 'bg-emerald-100 text-emerald-700',
        slate: 'bg-slate-100 text-slate-600',
    };
    return (
        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${colors[color] || colors.slate}`}>
            {label}
        </span>
    );
};

const StatCard = ({ label, value, color }) => {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        purple: 'text-purple-600 bg-purple-50 border-purple-100',
        red: 'text-red-600 bg-red-50 border-red-100',
    };
    return (
        <div className={`p-3 rounded-xl border ${colorClasses[color] || colorClasses.blue} flex flex-col items-center justify-center text-center`}>
            <span className="text-lg font-bold leading-none mb-1">{value}</span>
            <span className="text-[10px] font-bold uppercase opacity-70">{label}</span>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
        <Icon className="h-4 w-4 text-slate-400" />
        <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-400">{label}</p>
            <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
        </div>
    </div>
);

export default StudentProfileModal;
