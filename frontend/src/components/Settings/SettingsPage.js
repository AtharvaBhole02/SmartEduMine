import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, CheckCircle, XCircle, Bell, Server, RefreshCw,
    Lock, Mail, MessageSquare, ShieldCheck, HelpCircle, Trash2
} from 'lucide-react';
import { mlIntegration } from '../../utils/realTimeMLIntegration';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [mlStatus, setMlStatus] = useState({ connected: false, lastCheck: null });
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
    });
    const [security, setSecurity] = useState({
        twoFactor: false,
        sessionTimeout: '30',
    });
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');

    const checkMLStatus = async () => {
        try {
            const isConnected = await mlIntegration.initialize();
            setMlStatus({ connected: isConnected, lastCheck: new Date().toLocaleTimeString() });
        } catch (error) {
            setMlStatus({ connected: false, lastCheck: new Date().toLocaleTimeString() });
        }
    };

    const handleDeleteAllStudents = async () => {
        if (deleteConfirm !== 'DELETE') return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/students/delete-all`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                alert('All student data has been deleted.');
                setDeleteConfirm('');
            }
        } catch (error) {
            alert('Error deleting students: ' + error.message);
        }
        setIsDeleting(false);
    };

    useEffect(() => {
        checkMLStatus();
        const interval = setInterval(checkMLStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const Toggle = ({ checked, onChange }) => (
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-300'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    const Section = ({ title, icon: Icon, children }) => (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Icon className="h-5 w-5 mr-3 text-indigo-500" />
                {title}
            </h3>
            <div className="space-y-4">{children}</div>
        </div>
    );

    const SettingItem = ({ title, description, action }) => (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            {action}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-violet-50 via-white to-indigo-50 border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center p-1.5 shadow-sm">
                                <img src="/logo.png" alt="SmartEduMine" className="h-full w-full object-contain" />
                            </div>
                            <div>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-xl">SmartEdu</span>
                                <span className="text-gray-900 font-bold text-xl">Mine</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-12">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white text-gray-600 border border-gray-200 bg-white shadow-sm transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

                <div className="space-y-6">
                    {/* ML Service Status */}
                    <Section title="ML Service Status" icon={Server}>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                            <div className="flex items-center space-x-3">
                                {mlStatus.connected ? (
                                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                                ) : (
                                    <XCircle className="h-6 w-6 text-red-500" />
                                )}
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {mlStatus.connected ? 'Connected' : 'Disconnected'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Last checked: {mlStatus.lastCheck || 'Never'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={checkMLStatus}
                                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </Section>

                    {/* Notifications */}
                    <Section title="Notifications" icon={Bell}>
                        <SettingItem
                            title="Email Notifications"
                            description="Receive alerts via email"
                            action={
                                <Toggle
                                    checked={notifications.email}
                                    onChange={(val) => setNotifications({ ...notifications, email: val })}
                                />
                            }
                        />
                        <SettingItem
                            title="Push Notifications"
                            description="Browser push notifications"
                            action={
                                <Toggle
                                    checked={notifications.push}
                                    onChange={(val) => setNotifications({ ...notifications, push: val })}
                                />
                            }
                        />
                        <SettingItem
                            title="SMS Notifications"
                            description="Text message alerts"
                            action={
                                <Toggle
                                    checked={notifications.sms}
                                    onChange={(val) => setNotifications({ ...notifications, sms: val })}
                                />
                            }
                        />
                    </Section>

                    {/* Security */}
                    <Section title="Security" icon={Lock}>
                        <SettingItem
                            title="Two-Factor Authentication"
                            description="Add extra security to your account"
                            action={
                                <Toggle
                                    checked={security.twoFactor}
                                    onChange={(val) => setSecurity({ ...security, twoFactor: val })}
                                />
                            }
                        />
                        <SettingItem
                            title="Session Timeout"
                            description="Auto logout after inactivity"
                            action={
                                <select
                                    value={security.sessionTimeout}
                                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="never">Never</option>
                                </select>
                            }
                        />
                    </Section>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-red-600 mb-6 flex items-center">
                            <Trash2 className="h-5 w-5 mr-3" />
                            Danger Zone
                        </h3>
                        <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                            <p className="font-medium text-gray-900 mb-2">Delete All Student Data</p>
                            <p className="text-sm text-gray-500 mb-4">
                                This action cannot be undone. Type DELETE to confirm.
                            </p>
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    value={deleteConfirm}
                                    onChange={(e) => setDeleteConfirm(e.target.value)}
                                    placeholder="Type DELETE"
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                                />
                                <button
                                    onClick={handleDeleteAllStudents}
                                    disabled={deleteConfirm !== 'DELETE' || isDeleting}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete All'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
