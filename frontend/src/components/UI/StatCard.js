import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtitle, onClick, trend }) => {
  return (
    <div 
      onClick={onClick}
      className="group glass-strong rounded-2xl shadow-xl p-6 cursor-pointer hover:bg-white/20 hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-200">{title}</p>
          <p className="text-3xl font-bold text-white group-hover:text-gray-100 transition-colors">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-300 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}30` }}>
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;