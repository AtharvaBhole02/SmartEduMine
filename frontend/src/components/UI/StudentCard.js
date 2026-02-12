import React from 'react';
import { Eye, Mail, Phone } from 'lucide-react';

const StudentCard = ({ student, onClick }) => {
  const getRiskColor = (riskScore) => {
    if (riskScore >= 0.5) return '#EF4444';
    if (riskScore >= 0.4) return '#F59E0B';
    return '#10B981';
  };

  return (
    <div
      onClick={() => onClick(student)}
      className="group glass-strong rounded-2xl shadow-xl p-6 cursor-pointer hover:bg-white/20 hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
      style={{
        borderLeft: `4px solid ${getRiskColor(student.riskScore)}`
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-white text-lg group-hover:text-gray-100">
            {student.name}
          </h3>
          <p className="text-sm text-gray-300">{student.id}</p>
          <p className="text-xs text-gray-400 mt-1">Last seen: {student.lastActivity}</p>
        </div>
        <div className="flex flex-col items-end">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg"
            style={{ backgroundColor: getRiskColor(student.riskScore) }}
          >
            {student.status}
          </span>
          <div className="flex space-x-1 mt-2">
            <button className="p-1 rounded-full bg-blue-500/30 hover:bg-blue-500/50 transition-colors">
              <Eye className="h-3 w-3 text-blue-300" />
            </button>
            <button className="p-1 rounded-full bg-green-500/30 hover:bg-green-500/50 transition-colors">
              <Mail className="h-3 w-3 text-green-300" />
            </button>
            <button className="p-1 rounded-full bg-purple-500/30 hover:bg-purple-500/50 transition-colors">
              <Phone className="h-3 w-3 text-purple-300" />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="glass rounded-xl p-3">
          <p className="text-gray-300 font-medium">Attendance</p>
          <p className="font-bold text-lg text-white">{student.attendance}%</p>
        </div>
        <div className="glass rounded-xl p-3">
          <p className="text-gray-300 font-medium">Avg Grade</p>
          <p className="font-bold text-lg text-white">{student.avgGrade}%</p>
        </div>
        <div className="glass rounded-xl p-3">
          <p className="text-gray-300 font-medium">Behavioral</p>
          <p className="font-bold text-lg text-white">{student.behavioralScore}/10</p>
        </div>
        <div className="glass rounded-xl p-3">
          <p className="text-gray-300 font-medium">Risk Score</p>
          <p className="font-bold text-lg text-white">{(student.riskScore * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;