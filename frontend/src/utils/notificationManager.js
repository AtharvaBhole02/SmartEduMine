// Notification Manager - handles persistent notifications
export const notificationManager = {
  // Get all notifications
  getNotifications: () => {
    return JSON.parse(localStorage.getItem('notifications') || '[]');
  },

  // Add a new notification
  addNotification: (notification) => {
    const notifications = notificationManager.getNotifications();
    const newNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    notifications.unshift(newNotification);
    // Keep only last 50 notifications
    const trimmed = notifications.slice(0, 50);
    localStorage.setItem('notifications', JSON.stringify(trimmed));
    return newNotification;
  },

  // Mark notification as read
  markAsRead: (notificationId) => {
    const notifications = notificationManager.getNotifications();
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
  },

  // Mark all as read
  markAllAsRead: () => {
    const notifications = notificationManager.getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updated));
  },

  // Delete notification
  deleteNotification: (notificationId) => {
    const notifications = notificationManager.getNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(filtered));
  },

  // Clear all notifications
  clearAll: () => {
    localStorage.setItem('notifications', '[]');
  },

  // Get unread count
  getUnreadCount: () => {
    const notifications = notificationManager.getNotifications();
    return notifications.filter(n => !n.read).length;
  },

  // Notification types
  types: {
    HIGH_RISK: 'high_risk',
    MEDIUM_RISK: 'medium_risk',
    FOLLOW_UP: 'follow_up',
    MESSAGE: 'message',
    SYSTEM: 'system',
    SUCCESS: 'success',
    WARNING: 'warning'
  }
};

// Helper to create notification objects
export const createNotification = (type, title, message, data = {}) => {
  return {
    type,
    title,
    message,
    data,
    priority: type === notificationManager.types.HIGH_RISK ? 'high' : 'normal'
  };
};
