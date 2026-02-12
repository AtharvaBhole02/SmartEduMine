import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Calendar, Mail, CheckCircle, Info, Trash2, CheckCheck, Sparkles } from 'lucide-react';
import { notificationManager } from '../../utils/notificationManager';

const NotificationDropdown = ({ isOpen, onClose, onNotificationClick, onUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = () => {
    const allNotifications = notificationManager.getNotifications();
    setNotifications(allNotifications);
  };

  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation();
    notificationManager.markAsRead(notificationId);
    loadNotifications();
    if (onUpdate) onUpdate();
  };

  const handleMarkAllAsRead = () => {
    notificationManager.markAllAsRead();
    loadNotifications();
    if (onUpdate) onUpdate();
  };

  const handleDelete = (notificationId, e) => {
    e.stopPropagation();
    notificationManager.deleteNotification(notificationId);
    loadNotifications();
    if (onUpdate) onUpdate();
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    notificationManager.clearAll();
    loadNotifications();
    if (onUpdate) onUpdate();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      notificationManager.markAsRead(notification.id);
      loadNotifications();
      if (onUpdate) onUpdate();
    }
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const getIcon = (type) => {
    const icons = {
      high_risk: AlertTriangle,
      medium_risk: AlertTriangle,
      follow_up: Calendar,
      message: Mail,
      system: Info,
      success: CheckCircle,
      warning: AlertTriangle
    };
    return icons[type] || Bell;
  };

  const getIconStyles = (type) => {
    const styles = {
      high_risk: { color: 'text-red-400', bg: 'bg-gradient-to-br from-red-500/20 to-red-600/30', border: 'border-red-500/30' },
      medium_risk: { color: 'text-amber-400', bg: 'bg-gradient-to-br from-amber-500/20 to-amber-600/30', border: 'border-amber-500/30' },
      follow_up: { color: 'text-blue-400', bg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/30', border: 'border-blue-500/30' },
      message: { color: 'text-purple-400', bg: 'bg-gradient-to-br from-purple-500/20 to-purple-600/30', border: 'border-purple-500/30' },
      system: { color: 'text-slate-400', bg: 'bg-gradient-to-br from-slate-500/20 to-slate-600/30', border: 'border-slate-500/30' },
      success: { color: 'text-emerald-400', bg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/30', border: 'border-emerald-500/30' },
      warning: { color: 'text-orange-400', bg: 'bg-gradient-to-br from-orange-500/20 to-orange-600/30', border: 'border-orange-500/30' }
    };
    return styles[type] || styles.system;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute right-0 mt-3 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl bg-slate-900 border border-slate-700/50 shadow-2xl shadow-black/50 z-50 max-h-[520px] flex flex-col overflow-hidden">

        {/* Header with gradient */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-800 to-slate-800/50 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
                <p className="text-slate-400 text-xs">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group"
            >
              <X className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-3 py-2 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex space-x-1 p-1 bg-slate-800/50 rounded-xl">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${filter === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${filter === tab.key
                    ? 'bg-white/20'
                    : 'bg-slate-700/50'
                  }`}>
                  {tab.key === 'all' ? notifications.length
                    : tab.key === 'unread' ? unreadCount
                      : notifications.length - unreadCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {notifications.length > 0 && (
          <div className="px-4 py-2.5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
            {unreadCount > 0 ? (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors group"
              >
                <CheckCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <span>Mark all as read</span>
              </button>
            ) : (
              <span className="text-xs text-slate-500">No unread notifications</span>
            )}
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors group"
            >
              <Trash2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                {filter === 'unread' ? (
                  <Sparkles className="h-7 w-7 text-emerald-400" />
                ) : (
                  <Bell className="h-7 w-7 text-slate-500" />
                )}
              </div>
              <h4 className="text-white font-medium mb-1">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : filter === 'read'
                    ? 'No read notifications'
                    : 'No notifications yet'}
              </h4>
              <p className="text-slate-500 text-sm">
                {filter === 'unread'
                  ? 'Great job staying on top of things'
                  : 'New notifications will appear here'}
              </p>
            </div>
          ) : (
            <div className="py-1">
              {filteredNotifications.map((notification, index) => {
                const Icon = getIcon(notification.type);
                const styles = getIconStyles(notification.type);

                return (
                  <div
                    key={`${notification.id}-${index}`}
                    onClick={() => handleNotificationClick(notification)}
                    className={`mx-2 my-1 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group
                      ${!notification.read
                        ? 'bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-l-blue-500'
                        : 'hover:bg-slate-800/50 border-l-2 border-l-transparent'
                      }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${styles.bg} border ${styles.border} flex items-center justify-center`}>
                        <Icon className={`h-4 w-4 ${styles.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-medium leading-tight ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {getTimeAgo(notification.timestamp)}
                          </span>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="p-1.5 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(notification.id, e)}
                              className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(NotificationDropdown);
