import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import NotificationDropdown from '../Notifications/NotificationDropdown';
import { notificationManager } from '../../utils/notificationManager';

const Header = ({ interventionAlerts, selectedTab, onTabChange }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user')) || null;

  // Update unread count
  useEffect(() => {
    const updateCount = () => {
      setUnreadCount(notificationManager.getUnreadCount());
    };
    
    updateCount();
    
    // Update count every 5 seconds
    const interval = setInterval(updateCount, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (notification) => {
    // Handle notification click - could navigate to relevant section
    if (notification.data?.studentId) {
      // Navigate to student detail
      setShowNotifications(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 glass-strong border-b border-white/20 shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-1">
            <img 
              src="/logo.png" 
              alt="SmartEduMine Logo" 
              className="h-20 w-20 object-contain"
            />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg text-shadow">
              SmartEduMine
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadCount(notificationManager.getUnreadCount());
                }} 
                className="relative p-3 rounded-xl glass hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
              >
                <Bell className="h-6 w-6 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Enhanced Notifications Dropdown */}
              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => {
                  setShowNotifications(false);
                  setUnreadCount(notificationManager.getUnreadCount());
                }}
                onNotificationClick={handleNotificationClick}
              />
            </div>

            {/* Settings */}
            <button className="p-3 rounded-xl glass hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
              <Settings className="h-6 w-6 text-white" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <div 
                className="flex items-center space-x-3 glass rounded-xl px-4 py-2 cursor-pointer"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{user?.name || 'User'}</p>
                  <p className="text-white/70 text-sm capitalize">{user?.role || 'Guest'}</p>
                </div>
              </div>
              
              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-strong border border-white/20 shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/profile');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 w-full text-left"
                  >
                    <User className="mr-3 h-5 w-5" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      navigate('/signin');
                    }}
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 w-full text-left"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Tabs removed from header — tabs will be rendered in Dashboard as a separate floating section */}
        </div>
      </div>
    </header>
  );
};

export default Header;