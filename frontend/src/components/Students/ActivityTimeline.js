import React from 'react';
import { Mail, Phone, MessageCircle, Calendar, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

const ActivityTimeline = ({ activities = [] }) => {
  const getIcon = (type) => {
    const icons = {
      email: Mail,
      call: Phone,
      message: MessageCircle,
      meeting: Calendar,
      alert: AlertTriangle,
      intervention: CheckCircle,
      note: FileText
    };
    return icons[type] || FileText;
  };

  const getColor = (type) => {
    const colors = {
      email: 'bg-blue-500',
      call: 'bg-green-500',
      message: 'bg-purple-500',
      meeting: 'bg-yellow-500',
      alert: 'bg-red-500',
      intervention: 'bg-emerald-500',
      note: 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/20"></div>
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const colorClass = getColor(activity.type);

            return (
              <div key={index} className="relative flex items-start space-x-4">
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{activity.title}</h4>
                    <span className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-300">{activity.description}</p>
                  {activity.author && (
                    <p className="text-xs text-gray-400 mt-2">By {activity.author}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ActivityTimeline);
