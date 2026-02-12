import React, { useState, useMemo } from 'react';
import { Sparkles, AlertCircle, BookOpen, Heart, Users, Calendar, ChevronDown, ChevronUp, CheckCircle, Clock, ArrowRight, Target } from 'lucide-react';
import { aiRecommendationEngine } from '../../utils/aiRecommendations';

// --- Sub-Components (Human Engineered) ---

const UrgencyBadge = ({ level }) => {
  const styles = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-blue-500 text-white',
    CRITICAL: 'bg-red-500/10 text-red-500 border-red-200',
    HIGH: 'bg-orange-500/10 text-orange-500 border-orange-200',
    MEDIUM: 'bg-yellow-500/10 text-yellow-500 border-yellow-200',
    LOW: 'bg-blue-500/10 text-blue-500 border-blue-200',
  };
  const style = styles[level] || styles[level.toLowerCase()] || 'bg-gray-500 text-white';
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${style}`}>
      {level}
    </span>
  );
};

const ActionCard = ({ action }) => {
  const borderColors = {
    critical: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-blue-500'
  };
  const borderClass = borderColors[action.urgency] || 'border-l-gray-300';

  return (
    <div className={`p-3 sm:p-4 rounded-xl border-l-4 ${borderClass} bg-slate-50 hover:bg-slate-100 transition-colors`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <h5 className="font-semibold text-sm sm:text-base text-slate-900 leading-snug">
          {action.action}
        </h5>
        <UrgencyBadge level={action.urgency} />
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-3">{action.details || action.reason}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
          <Clock className="w-3 h-3 mr-1" />
          {action.timeframe}
        </span>
        <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          {action.impact} Impact
        </span>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, count, isOpen, onClick, colorClass = "text-slate-600", bgClass = "bg-slate-100" }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all group shadow-sm"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${bgClass} group-hover:scale-110 transition-transform`}>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </div>
      <div className="text-left">
        <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{title}</h4>
        {count !== undefined && (
          <p className="text-xs text-slate-500">{count} recommendation{count !== 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
    <div className={`p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors`}>
      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </div>
  </button>
);

const AIRecommendations = ({ student }) => {
  const [expandedSections, setExpandedSections] = useState({
    immediate: true,
    interventions: false,
    counseling: false,
    courses: false,
    support: false,
    parent: false
  });

  const { recommendations, interventions } = useMemo(() => ({
    recommendations: aiRecommendationEngine.generateRecommendations(student),
    interventions: aiRecommendationEngine.getTargetedIntervention(student)
  }), [student]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-white">
      {/* Professional Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Intervention Recommendations</h3>
              <p className="text-sm text-slate-500">Personalized action plan for {student.name}</p>
            </div>
          </div>
          <div className={`hidden sm:block px-3 py-1.5 rounded-lg text-xs font-semibold border ${recommendations.priority.level === 'CRITICAL' ? 'bg-red-50 text-red-600 border-red-100' :
            recommendations.priority.level === 'HIGH' ? 'bg-orange-50 text-orange-600 border-orange-100' :
              'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
            {recommendations.priority.level} PRIORITY
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">

        {/* Immediate Actions Section */}
        {recommendations.immediateActions.length > 0 && (
          <div className="space-y-3">
            <SectionHeader
              icon={AlertCircle}
              title="Immediate Actions"
              count={recommendations.immediateActions.length}
              isOpen={expandedSections.immediate}
              onClick={() => toggleSection('immediate')}
              colorClass="text-red-500"
              bgClass="bg-red-50"
            />
            {expandedSections.immediate && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {recommendations.immediateActions.map((action, index) => (
                  <ActionCard key={index} action={action} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Targeted Interventions Section */}
        {interventions.length > 0 && (
          <div className="space-y-3">
            <SectionHeader
              icon={CheckCircle}
              title="Targeted Intervention Plans"
              count={interventions.length}
              isOpen={expandedSections.interventions}
              onClick={() => toggleSection('interventions')}
              colorClass="text-emerald-500"
              bgClass="bg-emerald-50"
            />
            {expandedSections.interventions && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {interventions.map((intervention, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{intervention.icon}</span>
                      <div>
                        <h5 className="font-semibold text-slate-900 text-sm">{intervention.title}</h5>
                        <span className="text-xs font-medium text-emerald-600">{intervention.type}</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Action Steps</p>
                      <div className="space-y-2">
                        {intervention.steps.map((step, i) => (
                          <div key={i} className="flex gap-2">
                            <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                            <p className="text-xs text-slate-600">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Counseling Strategies */}
        {recommendations.counselingStrategies.length > 0 && (
          <div className="space-y-3">
            <SectionHeader
              icon={Heart}
              title="Counseling Strategies"
              count={recommendations.counselingStrategies.length}
              isOpen={expandedSections.counseling}
              onClick={() => toggleSection('counseling')}
              colorClass="text-pink-500"
              bgClass="bg-pink-50"
            />
            {expandedSections.counseling && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {recommendations.counselingStrategies.map((strategy, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex gap-3">
                      <span className="text-xl">{strategy.icon}</span>
                      <div>
                        <h5 className="font-semibold text-sm text-slate-900">{strategy.strategy}</h5>
                        <p className="text-xs text-slate-500 line-clamp-2 my-1">{strategy.description}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          {strategy.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Support Strategies */}
        <div className="space-y-3">
          <SectionHeader
            icon={Sparkles}
            title="General Support"
            isOpen={expandedSections.support}
            onClick={() => toggleSection('support')}
            colorClass="text-rose-500"
            bgClass="bg-rose-50"
          />
          {expandedSections.support && (
            <div className="grid grid-cols-1 gap-2 p-1">
              {recommendations.supportServices.map((service, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="mt-1"><Sparkles className="h-4 w-4 text-rose-400" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{service.service}</p>
                    <p className="text-xs text-slate-600">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Academic Plan */}
        <div className="space-y-3">
          <SectionHeader
            icon={BookOpen}
            title="Academic Plan"
            isOpen={expandedSections.courses}
            onClick={() => toggleSection('courses')}
            colorClass="text-blue-500"
            bgClass="bg-blue-50"
          />
          {expandedSections.courses && (
            <div className="space-y-3 p-1">
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <h5 className="font-semibold text-blue-900 text-sm mb-2">Recommended Courses & Workshops</h5>
                <ul className="space-y-2">
                  {recommendations.courseRecommendations.map((course, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-blue-400 shrink-0" />
                      <div>
                        <span className="font-medium">{course.course}:</span> {course.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Parent Communication */}
        <div className="space-y-3">
          <SectionHeader
            icon={Users}
            title="Parent Communication"
            isOpen={expandedSections.parent}
            onClick={() => toggleSection('parent')}
            colorClass="text-purple-500"
            bgClass="bg-purple-50"
          />
          {expandedSections.parent && (
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3 text-purple-700 font-medium text-sm">
                <Users className="h-4 w-4" />
                <span>Suggested Actions</span>
              </div>
              <ul className="space-y-2">
                {recommendations.parentEngagement.map((engagement, i) => (
                  <li key={i} className="text-sm text-slate-600 pl-4 border-l-2 border-purple-100">
                    <span className="font-semibold text-purple-900">{engagement.action}:</span> {engagement.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Timeline (Always visible at bottom) */}
        <div className="rounded-xl p-5 bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <h4 className="font-semibold text-slate-900">Recommended Timeline</h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(recommendations.timeline).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-white border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default React.memo(AIRecommendations);
