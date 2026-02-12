import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, BookOpen, Calendar, ArrowLeft, Edit2, Shield, MapPin } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('user')) || {};
  const user = {
    ...localUser,
    bio: localUser.bio || "Computer Science student with a focus on Machine Learning and Data Science. Passionate about building accessible tech.",
    location: "San Francisco, CA",
    studentId: "STU-2024-001"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-violet-50 via-white to-indigo-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center p-1.5 shadow-sm">
                <img src="/logo.png" alt="SmartEduMine" className="h-full w-full object-contain" />
              </div>
              <div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-xl">SmartEdu</span>
                <span className="text-gray-900 font-bold text-xl">Mine</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pb-12">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white text-gray-600 border border-gray-200 bg-white shadow-sm transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
            <Edit2 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: ID Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-4">
                  <span className="text-4xl font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center mb-1">{user.name || 'User Name'}</h2>
                <p className="text-sm font-medium text-indigo-600 mb-4">
                  {user.role || 'Student'}
                </p>

                <div className="w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 mb-6 bg-gray-50 border border-gray-100">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span className="font-mono text-sm text-gray-700">{user.studentId}</span>
                </div>

                <div className="w-full space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    {user.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                    Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Nov 2024'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-500" />
                About Me
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {user.bio}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-gray-50 border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium text-gray-900 truncate">{user.email || 'user@example.com'}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-gray-50 border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium text-gray-900">{user.phone || '+1 (555) 123-4567'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;