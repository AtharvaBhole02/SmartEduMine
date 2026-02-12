# Notification System Guide

## 🔔 Overview

The dashboard now has a comprehensive notification system integrated into the bell icon in the header. Notifications are persistent and stored in localStorage.

## 📍 Location

**Bell Icon** - Top right corner of the header, next to Settings and User Menu

## ✨ Features

### 1. **Notification Badge**
- Red badge shows unread notification count
- Animates with pulse effect
- Shows "99+" for counts over 99
- Updates in real-time

### 2. **Notification Dropdown**
- Click bell icon to open
- Beautiful glassmorphism design
- Scrollable list of notifications
- Backdrop blur when open

### 3. **Filter Tabs**
- **All** - Shows all notifications
- **Unread** - Shows only unread notifications
- **Read** - Shows only read notifications
- Each tab shows count in parentheses

### 4. **Notification Actions**
- **Mark as Read** - Click checkmark icon on individual notification
- **Mark All as Read** - Button at top of dropdown
- **Delete** - Click trash icon on individual notification
- **Clear All** - Button at top (with confirmation)

### 5. **Notification Types**

Each type has a unique icon and color:

| Type | Icon | Color | When Triggered |
|------|------|-------|----------------|
| **High Risk** | ⚠️ | Red | Student risk score ≥ 70% |
| **Medium Risk** | ⚠️ | Yellow | Student risk score 40-69% |
| **Follow-up** | 📅 | Blue | Follow-up scheduled |
| **Message** | 📧 | Purple | Email/SMS sent |
| **System** | ℹ️ | Gray | System events (import, export, etc.) |
| **Success** | ✅ | Green | Successful actions |
| **Warning** | ⚠️ | Orange | Warning messages |

### 6. **Notification Details**
Each notification shows:
- Icon with colored background
- Title (bold)
- Message (2 lines max, truncated)
- Time ago (e.g., "5m ago", "2h ago", "3d ago")
- Blue dot indicator for unread
- Action buttons (mark read, delete)

## 🎯 Automatic Notifications

Notifications are automatically created for:

### High Priority Events:
1. **High-Risk Student Detected**
   - When student risk score reaches ≥70%
   - Shows student name, ID, and risk percentage
   - Marked as high priority

2. **Bulk Import Completed**
   - After CSV import
   - Shows number of students imported
   - Alerts if high-risk students detected

### User Actions:
3. **Student Added**
   - When new student is added manually
   - Shows student name and risk status

4. **Counselor Assigned**
   - When counselor is assigned to student
   - Shows counselor and student names

5. **Email/SMS Sent**
   - When communication is sent
   - Shows recipient and communication type

6. **Follow-up Scheduled**
   - When follow-up is created
   - Shows title, student, and date

## 💡 Usage Examples

### Example 1: Check Notifications
1. Click bell icon in header
2. See list of all notifications
3. Click "Unread" tab to see only new ones
4. Click any notification to mark as read

### Example 2: Respond to High-Risk Alert
1. Notification appears: "High Risk Student Alert"
2. Click notification to mark as read
3. Message shows: "Jane Smith (BBCO22120) has a risk score of 85%"
4. Go to Students tab
5. Find Jane Smith
6. Open student detail modal
7. Take action (assign counselor, schedule follow-up, etc.)

### Example 3: Manage Notifications
1. Open notification dropdown
2. Click "Mark all as read" to clear unread badge
3. Or click trash icon on individual notifications to delete
4. Click "Clear all" to remove all notifications

### Example 4: Filter Notifications
1. Open dropdown
2. Click "Unread" to see only new notifications
3. Click "Read" to see notification history
4. Click "All" to see everything

## 🔄 Real-Time Updates

- Unread count updates every 5 seconds
- Badge animates when new notifications arrive
- Notifications persist across page refreshes
- Stored in browser localStorage

## 📊 Notification Data

Each notification contains:
```javascript
{
  id: 1234567890,
  type: 'high_risk',
  title: 'High Risk Student Alert',
  message: 'Jane Smith has a risk score of 85%',
  timestamp: '2024-01-15T10:30:00.000Z',
  read: false,
  priority: 'high',
  data: {
    studentId: 'BBCO22120',
    studentName: 'Jane Smith',
    riskScore: 0.85
  }
}
```

## 🎨 Visual Design

- **Glassmorphism** - Frosted glass effect
- **Color-coded** - Each type has unique color
- **Animations** - Smooth transitions and hover effects
- **Responsive** - Works on mobile and desktop
- **Accessible** - Clear visual hierarchy

## 🔧 Technical Details

### Storage
- Notifications stored in `localStorage` under key `notifications`
- Maximum 50 notifications kept (oldest auto-deleted)
- Persists across browser sessions

### Components
- `NotificationDropdown.js` - Main dropdown component
- `notificationManager.js` - Utility for managing notifications
- Integrated in `Header.js`

### API
```javascript
// Add notification
notificationManager.addNotification({
  type: 'high_risk',
  title: 'Alert',
  message: 'Student at risk',
  data: { studentId: '123' }
});

// Get all notifications
const notifications = notificationManager.getNotifications();

// Get unread count
const count = notificationManager.getUnreadCount();

// Mark as read
notificationManager.markAsRead(notificationId);

// Delete notification
notificationManager.deleteNotification(notificationId);
```

## 📱 Mobile Experience

On mobile devices:
- Dropdown width adjusts to screen
- Touch-friendly buttons
- Swipe to scroll notifications
- Backdrop prevents accidental clicks

## 🎯 Best Practices

1. **Check regularly** - Look for red badge on bell icon
2. **Act on high-priority** - Respond to high-risk alerts quickly
3. **Keep clean** - Delete old notifications periodically
4. **Use filters** - Focus on unread notifications
5. **Mark as read** - Keep track of what you've seen

## 🔮 Future Enhancements (Optional)

- Push notifications (browser API)
- Email notifications
- SMS notifications
- Notification preferences/settings
- Snooze notifications
- Notification categories
- Search notifications
- Export notification history

## 🐛 Troubleshooting

### Badge not updating
- Refresh the page
- Check browser console for errors
- Clear localStorage and reload

### Notifications not appearing
- Check if actions are being performed
- Verify localStorage is enabled
- Check browser console

### Dropdown not opening
- Click bell icon again
- Check for JavaScript errors
- Refresh the page

## 📞 Integration Points

Notifications are triggered from:
- `EnhancedDashboard.js` - Main dashboard actions
- `studentDataManager.js` - Student data operations
- Any component can add notifications using `notificationManager`

## 🎓 Example Workflow

**Daily Routine:**
1. Login to dashboard
2. Check notification bell (red badge = new notifications)
3. Click bell to open dropdown
4. Review high-risk alerts first (red icons)
5. Click notifications to mark as read
6. Take action on important items
7. Delete or clear old notifications
8. Continue with regular tasks

**When High-Risk Alert Appears:**
1. Notification: "High Risk Student Alert"
2. Click to view details
3. Note student name and risk score
4. Navigate to Students tab
5. Find and click student card
6. Review academic performance
7. Assign counselor
8. Schedule follow-up
9. Send communication
10. Add notes about intervention

This notification system ensures you never miss important student alerts and can track all actions taken in the dashboard!
