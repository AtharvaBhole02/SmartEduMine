import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Copy, Check } from 'lucide-react';

const EmailSMSTemplates = ({ student, onSend }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const templates = {
    highRisk: {
      subject: 'Academic Support - Immediate Attention Required',
      body: `Dear ${student?.name || '[Student Name]'},\n\nWe've noticed some concerning trends in your academic performance and would like to offer our support. Your current attendance is at ${student?.attendance || '[Attendance]'}% and we want to help you succeed.\n\nPlease schedule a meeting with your counselor at your earliest convenience.\n\nBest regards,\nAcademic Support Team`
    },
    mediumRisk: {
      subject: 'Check-in: Academic Progress Update',
      body: `Hi ${student?.name || '[Student Name]'},\n\nWe wanted to check in on your academic progress. We're here to support you and ensure you have the resources you need to succeed.\n\nIf you'd like to discuss your coursework or any challenges you're facing, please don't hesitate to reach out.\n\nBest,\nAcademic Support Team`
    },
    lowRisk: {
      subject: 'Great Work! Keep It Up',
      body: `Hi ${student?.name || '[Student Name]'},\n\nWe wanted to congratulate you on your excellent academic performance! Your ${student?.attendance || '[Attendance]'}% attendance and strong grades are commendable.\n\nKeep up the great work!\n\nBest regards,\nAcademic Support Team`
    },
    parentAlert: {
      subject: 'Student Progress Update - Action Required',
      body: `Dear Parent/Guardian,\n\nWe're reaching out regarding ${student?.name || '[Student Name]'}'s academic progress. We've observed some areas that require attention:\n\n- Attendance: ${student?.attendance || '[Attendance]'}%\n- Average Grade: ${student?.avgGrade || '[Grade]'}%\n\nWe'd like to schedule a meeting to discuss how we can work together to support your student's success.\n\nPlease contact us at your earliest convenience.\n\nSincerely,\nAcademic Support Team`
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomMessage(templates[template]?.body || '');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (customMessage.trim()) {
      onSend({
        type: 'email',
        template: selectedTemplate,
        message: customMessage,
        studentId: student?.id,
        timestamp: new Date().toISOString()
      });
      setCustomMessage('');
      setSelectedTemplate('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-slate-700 mb-2">
        <Mail className="h-4 w-4 text-blue-600" />
        <span className="font-semibold text-sm">Email Communication</span>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Select Template</label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">Choose a template...</option>
          {Object.keys(templates).map((key) => (
            <option key={key} value={key}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {selectedTemplate && (
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subject</label>
          <input
            type="text"
            value={templates[selectedTemplate]?.subject || ''}
            readOnly
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Message</label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={6}
          placeholder="Type your message or select a template..."
          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">
          {customMessage.length} characters
        </p>
      </div>

      <div className="flex space-x-2 pt-1">
        <button
          onClick={handleSend}
          disabled={!customMessage.trim()}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm font-medium"
        >
          <Send className="h-4 w-4" />
          <span>Send Email</span>
        </button>
        <button
          onClick={handleCopy}
          disabled={!customMessage.trim()}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="Copy to Clipboard"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default React.memo(EmailSMSTemplates);
