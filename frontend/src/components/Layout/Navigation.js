import React from 'react';
import { Users, UserCheck, TrendingUp, AlertTriangle } from 'lucide-react';

const Navigation = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { key: 'overview', label: 'Overview', icon: Users },
    { key: 'students', label: 'Students', icon: UserCheck },
    { key: 'analytics', label: 'Analytics', icon: TrendingUp },
    { key: 'predictions', label: 'Predictions', icon: AlertTriangle }
  ];

  return (
    <nav className="relative glass-strong border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedTab(key)}
              className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm rounded-t-xl transition-all duration-300 ${
                selectedTab === key
                  ? 'bg-white/20 text-white border-b-2 border-white transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;