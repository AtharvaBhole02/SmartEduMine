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
      email: 'bg-blue-100 text-blue-600',
      call: 'bg-emerald-100 text-emerald-600',
      message: 'bg-purple-100 text-purple-600',
      meeting: 'bg-amber-100 text-amber-600',
      alert: 'bg-red-100 text-red-600',
      intervention: 'bg-emerald-100 text-emerald-600',
      note: 'bg-slate-100 text-slate-600'
    };
    return colors[type] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">Activity Timeline</h3>
      <div className="relative pl-2">
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-200"></div>
        <div className="space-y-6">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const colorClass = getColor(activity.type);

            return (
              <div key={index} className="relative flex items-start space-x-4">
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full shadow-sm ring-4 ring-white ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 bg-white rounded-xl p-3 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-slate-900">{activity.title}</h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{new Date(activity.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-600">{activity.description}</p>
                  {activity.author && (
                    <p className="text-xs text-slate-400 mt-2 font-medium">By {activity.author}</p>
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
