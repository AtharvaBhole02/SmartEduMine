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
      high_risk: { color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
      medium_risk: { color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
      follow_up: { color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
      message: { color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100' },
      system: { color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' },
      success: { color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
      warning: { color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' }
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
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div className="absolute right-0 mt-3 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white border border-gray-200 shadow-xl z-50 max-h-[520px] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-sm">Notifications</h3>
                <p className="text-gray-500 text-xs">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/50">
          <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${filter === tab.key
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-gray-200/60 text-gray-500'
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
          <div className="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center">
            {unreadCount > 0 ? (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center space-x-1.5 text-xs text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark all as read</span>
              </button>
            ) : (
              <span className="text-xs text-gray-400">No unread notifications</span>
            )}
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                {filter === 'unread' ? (
                  <Sparkles className="h-7 w-7 text-emerald-400" />
                ) : (
                  <Bell className="h-7 w-7 text-gray-300" />
                )}
              </div>
              <h4 className="text-gray-900 font-medium mb-1">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : filter === 'read'
                    ? 'No read notifications'
                    : 'No notifications yet'}
              </h4>
              <p className="text-gray-400 text-sm">
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
                    className={`mx-2 my-1 px-3 py-3 rounded-xl cursor-pointer transition-all group
                      ${!notification.read
                        ? 'bg-indigo-50/50 border border-indigo-100'
                        : 'hover:bg-gray-50 border border-transparent'
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
                          <p className={`text-sm font-medium leading-tight ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-400 font-medium">
                            {getTimeAgo(notification.timestamp)}
                          </span>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(notification.id, e)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
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
