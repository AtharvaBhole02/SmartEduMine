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
      meeting: 'bg-blue-500',
      call: 'bg-green-500',
      email: 'bg-purple-500',
      checkIn: 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const sortedFollowUps = [...followUps].sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Follow-ups & Reminders</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
          <input
            type="text"
            placeholder="Title (e.g., Follow-up meeting)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="meeting">Meeting</option>
            <option value="call">Phone Call</option>
            <option value="email">Email Follow-up</option>
            <option value="checkIn">Check-in</option>
          </select>
          <select
            value={formData.reminderBefore}
            onChange={(e) => setFormData({ ...formData, reminderBefore: parseInt(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>1 hour before</option>
            <option value={24}>1 day before</option>
            <option value={48}>2 days before</option>
            <option value={168}>1 week before</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Schedule
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedFollowUps.map((followUp) => (
          <div
            key={followUp.id}
            className={`bg-white/5 rounded-lg p-4 border border-white/10 ${followUp.completed ? 'opacity-50' : ''
              }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`${getTypeColor(followUp.type)} rounded-full p-2`}>
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${followUp.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    {followUp.title}
                  </h4>
                  {followUp.description && (
                    <p className="text-sm text-gray-400 mt-1">{followUp.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(followUp.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(followUp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bell className="h-3 w-3" />
                      <span>{followUp.reminderBefore}h before</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {!followUp.completed && (
                  <button
                    onClick={() => onComplete(studentId, followUp.id)}
                    className="p-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(studentId, followUp.id)}
                  className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors"
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
