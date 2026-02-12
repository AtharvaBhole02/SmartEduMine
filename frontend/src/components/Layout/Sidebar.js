import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, AlertTriangle, Settings, LogOut, Menu, X } from 'lucide-react';

const Sidebar = ({ selectedTab, onTabChange }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user')) || null;

    const navItems = [
        { key: 'overview', label: 'Dashboards', icon: LayoutDashboard },
        { key: 'students', label: 'Students', icon: Users },
        { key: 'analytics', label: 'Analytics', icon: TrendingUp },
        { key: 'predictions', label: 'Predictions', icon: AlertTriangle },
    ];

    const handleNavClick = (key) => {
        onTabChange(key);
        setIsOpen(false); // Close sidebar on mobile after selection
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="SmartEduMine" className="w-8 h-8 object-contain" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400 font-bold">SmartEdu</span>
                    <span className="text-white font-bold">Mine</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 text-white hover:bg-white/10 rounded-lg"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 h-full z-50 bg-slate-900 transition-transform duration-300 ease-in-out
        w-64 md:w-60 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static
      `}>
                {/* Logo - hidden on mobile (shown in mobile header) */}
                <div className="hidden md:block px-5 py-5">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="SmartEduMine Logo" className="w-10 h-10 object-contain" />
                        <div>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-teal-400 font-bold text-lg">SmartEdu</span>
                            <span className="text-white font-bold text-lg">Mine</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-16 md:mt-4 px-3">
                    {navItems.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => handleNavClick(key)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all mb-1
                ${selectedTab === key
                                    ? 'bg-indigo-500/20 text-white border-l-3 border-indigo-500'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-4">
                    <button
                        onClick={() => { navigate('/settings'); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-4 py-3 mt-2 border-t border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-medium">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                                {user?.role || 'Guest'}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                navigate('/signin');
                            }}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
