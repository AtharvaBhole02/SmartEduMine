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
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Assigned Counselor</p>
          <p className="text-slate-900 font-bold text-sm">
            {assignedCounselor ? assignedCounselor.name : 'Not assigned'}
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors flex items-center space-x-1.5 text-xs"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>{assignedCounselor ? 'Change' : 'Assign'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-slate-200 shadow-xl z-50 max-h-64 overflow-y-auto ring-1 ring-slate-900/5">
          <div className="p-2 space-y-1">
            {counselors.map((counselor) => (
              <button
                key={counselor.id}
                onClick={() => setSelectedCounselor(counselor)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between group ${selectedCounselor?.id === counselor.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-slate-50 text-slate-700'
                  }`}
              >
                <div>
                  <p className="font-semibold text-sm">{counselor.name}</p>
                  <p className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">{counselor.email}</p>
                </div>
                {selectedCounselor?.id === counselor.id && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-slate-100 flex space-x-2">
            <button
              onClick={handleAssign}
              className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-sm font-medium transition-colors"
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
