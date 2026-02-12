import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, Calendar, Mail, CheckCircle, Info, Trash2, Bell, CheckCheck } from 'lucide-react';
import { notificationManager } from '../../utils/notificationManager';

const NotificationPanel = ({ isOpen, onClose, onNotificationClick, onUpdate }) => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    const loadNotifications = () => {
        setNotifications(notificationManager.getNotifications());
    };

    const handleMarkAsRead = (notificationId, e) => {
        e.stopPropagation();
        notificationManager.markAsRead(notificationId);
        loadNotifications();
        onUpdate?.();
    };

    const handleMarkAllAsRead = () => {
        notificationManager.markAllAsRead();
        loadNotifications();
        onUpdate?.();
    };

    const handleDelete = (notificationId, e) => {
        e.stopPropagation();
        notificationManager.deleteNotification(notificationId);
        loadNotifications();
        onUpdate?.();
    };

    const handleClearAll = (e) => {
        e.stopPropagation();
        notificationManager.clearAll();
        loadNotifications();
        onUpdate?.();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return AlertTriangle;
            case 'info': return Info;
            case 'schedule': return Calendar;
            case 'email': return Mail;
            case 'success': return CheckCircle;
            default: return Bell;
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'alert': return 'text-red-400';
            case 'info': return 'text-blue-400';
            case 'schedule': return 'text-purple-400';
            case 'email': return 'text-green-400';
            case 'success': return 'text-emerald-400';
            default: return 'text-gray-400';
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const diff = now - new Date(timestamp);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
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
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-blue-400" />
                        <h2 className="text-lg font-semibold text-white">Notifications</h2>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex border-b border-slate-700">
                    {['all', 'unread', 'read'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${filter === tab
                                    ? 'text-blue-400 border-b-2 border-blue-400'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="p-3 border-b border-slate-700 flex space-x-2">
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                    >
                        <CheckCheck className="h-4 w-4" />
                        <span>Mark all read</span>
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-red-500/20 rounded-lg text-sm text-slate-300 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Clear all</span>
                    </button>
                </div>

                {/* Notifications list */}
                <div className="flex-1 overflow-y-auto">
                    {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Bell className="h-8 w-8 text-slate-500" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
                            <p className="text-slate-400 text-sm">
                                {filter === 'unread'
                                    ? "You're all caught up!"
                                    : filter === 'read'
                                        ? "No read notifications yet."
                                        : "Notifications will appear here."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-700/50">
                            {filteredNotifications.map((notification) => {
                                const Icon = getIcon(notification.type);
                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => {
                                            if (!notification.read) {
                                                notificationManager.markAsRead(notification.id);
                                                loadNotifications();
                                                onUpdate?.();
                                            }
                                            onNotificationClick?.(notification);
                                        }}
                                        className={`p-4 hover:bg-slate-800/50 cursor-pointer transition-colors ${!notification.read ? 'bg-slate-800/30' : ''
                                            }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            {/* Icon */}
                                            <div className={`p-2 rounded-lg bg-slate-800 ${getIconColor(notification.type)}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <h4 className={`font-medium text-sm ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    {getTimeAgo(notification.timestamp)}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-1">
                                                {!notification.read && (
                                                    <button
                                                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                        className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4 text-slate-400 hover:text-green-400" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(notification.id, e)}
                                                    className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-400" />
                                                </button>
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

export default React.memo(NotificationPanel);
