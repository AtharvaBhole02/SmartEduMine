import React, { useState } from 'react';
import { Calendar, Clock, Bell, Plus, Trash2, Check } from 'lucide-react';

const FollowUpScheduler = ({ studentId, followUps = [], onAdd, onComplete, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'meeting',
    reminderBefore: 24
  });

  const handleSubmit = () => {
    if (formData.title && formData.date && formData.time) {
      onAdd(studentId, {
        ...formData,
        timestamp: new Date(`${formData.date}T${formData.time}`).toISOString(),
        completed: false
      });
      setFormData({ title: '', description: '', date: '', time: '', type: 'meeting', reminderBefore: 24 });
      setIsAdding(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      meeting: 'bg-blue-100 text-blue-600',
      call: 'bg-emerald-100 text-emerald-600',
      email: 'bg-purple-100 text-purple-600',
      checkIn: 'bg-amber-100 text-amber-600'
    };
    return colors[type] || 'bg-slate-100 text-slate-600';
  };

  const sortedFollowUps = [...followUps].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-700">Scheduled Actions</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 shadow-inner">
          <input
            type="text"
            placeholder="Title (e.g., Follow-up meeting)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="meeting">Meeting</option>
            <option value="call">Phone Call</option>
            <option value="email">Email Follow-up</option>
            <option value="checkIn">Check-in</option>
          </select>
          <select
            value={formData.reminderBefore}
            onChange={(e) => setFormData({ ...formData, reminderBefore: parseInt(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value={1}>1 hour before</option>
            <option value={24}>1 day before</option>
            <option value={48}>2 days before</option>
            <option value={168}>1 week before</option>
          </select>
          <div className="flex space-x-2 pt-1">
            <button
              onClick={handleSubmit}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Schedule Task
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {sortedFollowUps.length === 0 && !isAdding && (
          <div className="text-center py-6 text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No scheduled follow-ups
          </div>
        )}
        {sortedFollowUps.map((followUp) => (
          <div
            key={followUp.id}
            className={`bg-white rounded-xl p-4 border transition-all ${followUp.completed
              ? 'border-slate-100 bg-slate-50 opacity-70'
              : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`${getTypeColor(followUp.type)} rounded-lg p-2 h-fit`}>
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm ${followUp.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {followUp.title}
                  </h4>
                  {followUp.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{followUp.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 font-medium">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(followUp.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(followUp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {followUp.reminderBefore > 0 && (
                      <div className="flex items-center space-x-1 text-blue-500/70">
                        <Bell className="h-3 w-3" />
                        <span>{followUp.reminderBefore}h before</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 ml-2">
                {!followUp.completed && (
                  <button
                    onClick={() => onComplete(studentId, followUp.id)}
                    className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Mark Complete"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(studentId, followUp.id)}
                  className="p-1.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(FollowUpScheduler);
