import React from 'react';
import { X, TrendingUp, TrendingDown, Minus, Award, Target } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

const StudentComparison = ({ students, onClose }) => {
  if (!students || students.length === 0) return null;

  const getComparisonData = () => {
    return [
      { metric: 'Attendance', ...students.reduce((acc, s, i) => ({ ...acc, [`student${i}`]: s.attendance }), {}) },
      { metric: 'Grades', ...students.reduce((acc, s, i) => ({ ...acc, [`student${i}`]: s.avgGrade }), {}) },
      { metric: 'Behavioral', ...students.reduce((acc, s, i) => ({ ...acc, [`student${i}`]: s.behavioralScore * 10 }), {}) },
      { metric: 'Risk (Inv)', ...students.reduce((acc, s, i) => ({ ...acc, [`student${i}`]: (1 - s.riskScore) * 100 }), {}) }
    ];
  };

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const compareMetric = (metric) => {
    const values = students.map(s => s[metric]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return values.map(v => v === max ? 'up' : v === min ? 'down' : 'same');
  };

  const getBestStudent = (metric) => {
    let bestIdx = 0;
    let bestVal = students[0][metric];
    students.forEach((s, i) => {
      if (metric === 'riskScore') {
        if (s[metric] < bestVal) { bestVal = s[metric]; bestIdx = i; }
      } else {
        if (s[metric] > bestVal) { bestVal = s[metric]; bestIdx = i; }
      }
    });
    return bestIdx;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80">
      <div className="relative w-full max-w-6xl bg-slate-900 sm:rounded-3xl shadow-2xl border-x sm:border border-slate-700 h-full sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-slate-900 p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 ml-2 sm:ml-0 bg-blue-500/10 rounded-xl">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">Compare Students</h2>
              <p className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wider">
                {students.length} students selected
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 sm:p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all text-white shadow-lg">
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide">
          {/* Radar Chart */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={getComparisonData()}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                {students.map((student, i) => (
                  <Radar
                    key={student.id}
                    name={student.name}
                    dataKey={`student${i}`}
                    stroke={colors[i]}
                    fill={colors[i]}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ color: 'white' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student, index) => {
              const isBest = {
                attendance: getBestStudent('attendance') === index,
                avgGrade: getBestStudent('avgGrade') === index,
                behavioralScore: getBestStudent('behavioralScore') === index,
                riskScore: getBestStudent('riskScore') === index,
              };

              return (
                <div
                  key={student.id}
                  className="bg-slate-800/50 rounded-2xl p-5 border-2 transition-all hover:bg-slate-800/70"
                  style={{ borderColor: colors[index] }}
                >
                  {/* Student Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white text-lg">{student.name}</h3>
                      <p className="text-xs text-slate-400">{student.id}</p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: colors[index] }}
                    >
                      {student.status}
                    </span>
                  </div>

                  {/* Metrics with Progress Bars */}
                  <div className="space-y-4">
                    {[
                      { label: 'Attendance', value: student.attendance, max: 100, key: 'attendance' },
                      { label: 'Avg Grade', value: student.avgGrade, max: 100, key: 'avgGrade' },
                      { label: 'Behavioral', value: student.behavioralScore * 10, max: 100, key: 'behavioralScore' },
                    ].map(({ label, value, max, key }) => {
                      const comparison = compareMetric(key);
                      const Icon = comparison[index] === 'up' ? TrendingUp : comparison[index] === 'down' ? TrendingDown : Minus;
                      const iconColor = comparison[index] === 'up' ? 'text-green-400' : comparison[index] === 'down' ? 'text-red-400' : 'text-slate-400';

                      return (
                        <div key={label}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-slate-300">{label}</span>
                              {isBest[key] && <Award className="h-3 w-3 text-yellow-400" />}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-sm">{key === 'behavioralScore' ? `${student.behavioralScore}/10` : `${value}%`}</span>
                              <Icon className={`h-4 w-4 ${iconColor}`} />
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(value / max) * 100}%`,
                                backgroundColor: colors[index]
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {/* Risk Score (special - lower is better) */}
                    <div className="pt-3 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-300">Risk Score</span>
                          {isBest.riskScore && <Award className="h-3 w-3 text-yellow-400" />}
                        </div>
                        <span className={`font-bold text-sm ${student.riskScore >= 0.5 ? 'text-red-400' : student.riskScore >= 0.4 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {(student.riskScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StudentComparison);
