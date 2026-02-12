import React, { useState } from 'react';
import { useToast } from '../Notifications/ToastContainer';

// Simple debug dashboard to test if features are working
const DebugDashboard = () => {
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-white mb-8">Feature Debug Dashboard</h1>

        {/* Test Toast Notifications */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">1. Toast Notifications</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => addToast('Success message!', 'success')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Test Success Toast
            </button>
            <button
              onClick={() => addToast('Error message!', 'error')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Test Error Toast
            </button>
            <button
              onClick={() => addToast('Warning message!', 'warning')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Test Warning Toast
            </button>
            <button
              onClick={() => addToast('Info message!', 'info')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Test Info Toast
            </button>
          </div>
          <p className="text-green-400 mt-3">✓ If toasts appear in top-right, this feature works!</p>
        </div>

        {/* Test Modal */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">2. Modal System</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Open Test Modal
          </button>
          <p className="text-green-400 mt-3">✓ If modal opens, student detail modals should work!</p>
        </div>

        {/* Feature Checklist */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">3. Feature Checklist</h2>
          <div className="space-y-2 text-white">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="f1" className="w-4 h-4" />
              <label htmlFor="f1">Toast notifications working (test above)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="f2" className="w-4 h-4" />
              <label htmlFor="f2">Modal opens (test above)</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="f3" className="w-4 h-4" />
              <label htmlFor="f3">Can see Bulk Import/Export on Overview tab</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="f4" className="w-4 h-4" />
              <label htmlFor="f4">Can click student cards in Students tab</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="f5" className="w-4 h-4" />
              <label htmlFor="f5">Student modal shows all sections</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="f6" className="w-4 h-4" />
              <label htmlFor="f6">Can select students for comparison</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="f7" className="w-4 h-4" />
              <label htmlFor="f7">Mobile responsive (resize browser)</label>
            </div>
          </div>
        </div>

        {/* Test Notifications */}
        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">4. Test Notification System</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => {
                const { notificationManager, createNotification } = require('../../utils/notificationManager');
                notificationManager.addNotification(
                  createNotification(
                    notificationManager.types.HIGH_RISK,
                    'High Risk Student Alert',
                    'Jane Smith (BBCO22120) has a risk score of 85%. Immediate attention required.',
                    { studentId: 'BBCO22120' }
                  )
                );
                addToast('High-risk notification added!', 'success');
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Add High-Risk Alert
            </button>
            <button
              onClick={() => {
                const { notificationManager, createNotification } = require('../../utils/notificationManager');
                notificationManager.addNotification(
                  createNotification(
                    notificationManager.types.FOLLOW_UP,
                    'Follow-up Reminder',
                    'Meeting with John Doe scheduled for tomorrow at 2:00 PM',
                    { studentId: 'BBCO22122' }
                  )
                );
                addToast('Follow-up notification added!', 'success');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Follow-up
            </button>
            <button
              onClick={() => {
                const { notificationManager, createNotification } = require('../../utils/notificationManager');
                notificationManager.addNotification(
                  createNotification(
                    notificationManager.types.MESSAGE,
                    'Email Sent',
                    'Communication sent to Sarah Wilson via email',
                    { studentId: 'BBCO22132' }
                  )
                );
                addToast('Message notification added!', 'success');
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Add Message
            </button>
          </div>
          <p className="text-green-400">✓ Check the bell icon in header (top-right) for notifications!</p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/50">
          <h2 className="text-2xl font-bold text-white mb-4">📋 How to Access Features</h2>
          <ol className="text-white space-y-2 list-decimal list-inside">
            <li>Go back to main dashboard (refresh page)</li>
            <li><strong>Check the bell icon</strong> in top-right header for notifications</li>
            <li>Click "Students" tab in top navigation</li>
            <li><strong>Click on any student card</strong> (this is the key!)</li>
            <li>Modal opens with ALL new features:
              <ul className="ml-8 mt-2 space-y-1 list-disc">
                <li>Counselor Assignment</li>
                <li>Parent/Guardian Info</li>
                <li>Email/SMS Templates</li>
                <li>Follow-up Scheduler</li>
                <li>Notes & Comments</li>
                <li>Activity Timeline</li>
              </ul>
            </li>
          </ol>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <a
            href="/dashboard"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            ← Back to Main Dashboard
          </a>
        </div>
      </div>

      {/* Test Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-slate-800 rounded-3xl shadow-2xl border border-slate-600 p-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:bg-white/20 rounded-full w-8 h-8"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Test Modal</h2>
            <p className="text-white mb-4">
              ✓ Modal system is working! This means student detail modals should also work.
            </p>
            <p className="text-gray-300 mb-6">
              In the main dashboard, click any student card to open their detail modal with all the new features.
            </p>
            <button
              onClick={() => setModalOpen(false)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugDashboard;
