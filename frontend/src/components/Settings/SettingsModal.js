import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Moon, Sun, Bell, Shield, Server, RefreshCw } from 'lucide-react';
import { mlIntegration } from '../../utils/realTimeMLIntegration';

const SettingsModal = ({ isOpen, onClose }) => {
    const [mlStatus, setMlStatus] = useState('checking'); // checking, connected, disconnected
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [autoPredict, setAutoPredict] = useState(true);

    useEffect(() => {
        if (isOpen) {
            checkMLStatus();
        }
    }, [isOpen]);

    const checkMLStatus = async () => {
        setMlStatus('checking');
        try {
            const isConnected = await mlIntegration.initialize();
            setMlStatus(isConnected ? 'connected' : 'disconnected');
        } catch (error) {
            setMlStatus('disconnected');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col transition-all duration-300 bg-white/95 backdrop-blur-xl">
            <div className="w-full max-w-3xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-200/10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">
                            Settings
                        </h2>
                        <p className="mt-1 text-slate-500">
                            Manage your application preferences and system status
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full transition-all duration-300 transform hover:rotate-90 bg-slate-100 hover:bg-slate-200 text-slate-900"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">

                    {/* System Status Section */}
                    <div className="p-6 rounded-2xl border bg-slate-50 border-slate-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-blue-600">
                            System Status
                        </h3>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-xl bg-white shadow-sm">
                                    <Server className={`w-6 h-6 ${mlStatus === 'connected' ? 'text-emerald-500' :
                                        mlStatus === 'disconnected' ? 'text-red-500' : 'text-amber-500'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-900">
                                        ML Model Service
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Dropout Prediction Engine (Port 5001)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                {mlStatus === 'checking' && (
                                    <div className="flex items-center space-x-2 text-amber-500">
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        <span className="font-medium">Checking...</span>
                                    </div>
                                )}
                                {mlStatus === 'connected' && (
                                    <span className="flex items-center text-sm font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Connected
                                    </span>
                                )}
                                {mlStatus === 'disconnected' && (
                                    <button
                                        onClick={checkMLStatus}
                                        className="flex items-center text-sm font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors border border-red-500/20"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Retry Connection
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-blue-600">
                            Preferences
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Theme Toggle Removed */}

                            {/* Notifications Toggle */}
                            <div className="p-4 rounded-xl border flex items-center justify-between bg-white border-slate-200">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-slate-100">
                                        <Bell className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Notifications</p>
                                        <p className="text-xs text-slate-500">Enable system alerts</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Auto Predict Toggle */}
                            <div className="p-4 rounded-xl border flex items-center justify-between bg-white border-slate-200">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-xl bg-slate-100">
                                        <Shield className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Auto-Prediction</p>
                                        <p className="text-xs text-slate-500">Run ML on data changes</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAutoPredict(!autoPredict)}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${autoPredict ? 'bg-emerald-500' : 'bg-slate-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${autoPredict ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 md:p-8 border-t border-slate-200/10">
                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 transition-all shadow-xl shadow-violet-500/20 transform hover:scale-[1.02]"
                    >
                        Save Changes & Close
                    </button>
                </div>            </div>
        </div>
    );
};

export default SettingsModal;
