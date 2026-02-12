import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtitle, trend, trendDirection, onClick }) => {
    // Determine trend icon and color based on direction
    const getTrendIcon = () => {
        if (trendDirection === 'down') {
            return <TrendingDown className="h-3 w-3 text-red-500 mr-1" />;
        }
        if (trendDirection === 'neutral') {
            return <Minus className="h-3 w-3 text-gray-400 mr-1" />;
        }
        // Default: up
        return <TrendingUp className="h-3 w-3 text-green-500 mr-1" />;
    };

    const getTrendColor = () => {
        if (trendDirection === 'down') return 'text-red-600';
        if (trendDirection === 'neutral') return 'text-gray-500';
        return 'text-green-600';
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg p-5 cursor-pointer hover:shadow-sm transition-all border border-gray-200"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-semibold mt-1 text-gray-900">{value}</p>
                    {subtitle && <p className="text-xs mt-1 text-gray-500">{subtitle}</p>}
                    {trend && (
                        <div className="flex items-center mt-2">
                            {getTrendIcon()}
                            <span className={`text-xs ${getTrendColor()}`}>{trend}</span>
                        </div>
                    )}
                </div>
                <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${color}10` }}
                >
                    <Icon className="h-6 w-6" style={{ color }} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
