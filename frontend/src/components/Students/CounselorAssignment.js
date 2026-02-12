import React, { useState } from 'react';
import { UserPlus, X, Check } from 'lucide-react';

const CounselorAssignment = ({ studentId, assignedCounselor, counselors = [], onAssign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(assignedCounselor);

  const handleAssign = () => {
    if (selectedCounselor) {
      onAssign(studentId, selectedCounselor);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
        <div>
          <p className="text-sm text-gray-300 mb-1">Assigned Counselor</p>
          <p className="text-white font-medium">
            {assignedCounselor ? assignedCounselor.name : 'Not assigned'}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>{assignedCounselor ? 'Change' : 'Assign'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg border border-white/20 shadow-2xl z-50 max-h-64 overflow-y-auto">
          <div className="p-2 space-y-1">
            {counselors.map((counselor) => (
              <button
                key={counselor.id}
                onClick={() => setSelectedCounselor(counselor)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${selectedCounselor?.id === counselor.id
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-white/5 text-white'
                  }`}
              >
                <div>
                  <p className="font-medium">{counselor.name}</p>
                  <p className="text-xs opacity-70">{counselor.email}</p>
                  <p className="text-xs opacity-70">{counselor.assignedStudents || 0} students</p>
                </div>
                {selectedCounselor?.id === counselor.id && (
                  <Check className="h-5 w-5" />
                )}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-white/10 flex space-x-2">
            <button
              onClick={handleAssign}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Assign
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CounselorAssignment);
