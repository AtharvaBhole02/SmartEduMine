# How to Test High-Risk Student Notifications

## 🎯 Quick Test (Easiest Method)

### Method 1: Use the "Generate Alerts" Button

1. **Go to Dashboard** - http://localhost:3001/dashboard
2. **Look at Overview tab** (default view)
3. **Scroll down** to "Quick Actions" section
4. **Click "Generate Alerts"** button (red button with bell icon)
5. **Success toast appears** - "X high-risk notifications created!"
6. **Look at bell icon** in header (top-right)
7. **Red badge appears** with number of notifications
8. **Click bell icon** to see notifications

### Method 2: Use the High-Risk Alert Panel

1. **Go to Dashboard** - http://localhost:3001/dashboard
2. **Look for red alert panel** below the stat cards
3. Panel shows: "High Risk Students Alert - X students require immediate attention"
4. **See list of high-risk students** (Jane Smith 80%, Tom Brown 90%)
5. **Click "Send to Notifications"** button
6. **Check bell icon** in header - badge appears
7. **Click bell icon** to view notifications

### Method 3: Use Debug Page

1. **Go to Debug Page** - http://localhost:3001/debug
2. **Scroll to "Test Notification System"** section
3. **Click "Add High-Risk Alert"** button
4. **Toast appears** - "High-risk notification added!"
5. **Go back to dashboard** - http://localhost:3001/dashboard
6. **Check bell icon** - badge shows "1"
7. **Click bell icon** to see notification

## 📋 What You Should See

### In the Notification Dropdown:

```
🔔 Notifications                                    ✕
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All (2)  |  Unread (2)  |  Read (0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mark all as read                          Clear all
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  High Risk Student Alert                    • (blue dot)
    Jane Smith (BBCO22120) has a risk score 
    of 80.0%. Immediate attention required.
    Just now                                  ✓  🗑️

⚠️  High Risk Student Alert                    • (blue dot)
    Tom Brown (BBCO22135) has a risk score 
    of 90.0%. Immediate attention required.
    Just now                                  ✓  🗑️
```

### Visual Indicators:

- **Red Badge** on bell icon with number (e.g., "2")
- **Red Icon** (⚠️) for high-risk notifications
- **Blue Dot** (•) next to unread notifications
- **Red Background** on notification icon area
- **Time Stamp** showing "Just now" or "5m ago"

## 🔍 Troubleshooting

### Problem: No notifications appearing

**Solution 1: Clear notification flags**
```javascript
// Open browser console (F12)
// Run this command:
localStorage.removeItem('notified_BBCO22120');
localStorage.removeItem('notified_BBCO22135');
// Refresh page
```

**Solution 2: Use the Generate Alerts button**
- The button creates notifications regardless of flags
- Located in Overview tab → Quick Actions section

**Solution 3: Add a new high-risk student**
1. Click "Add Student" button
2. Enter:
   - Name: Test Student
   - Email: test@example.com
   - Phone: +1234567890
   - Attendance: 30 (low!)
   - Grade: 40 (low!)
   - Behavioral: 3 (low!)
3. Click "Add Student"
4. Notification should appear automatically

### Problem: Badge not showing

**Check:**
1. Refresh the page
2. Click bell icon to open dropdown
3. Check if notifications exist in "All" tab
4. Badge updates every 5 seconds

**Fix:**
```javascript
// Open browser console
// Check notification count:
const { notificationManager } = require('./utils/notificationManager');
console.log('Unread:', notificationManager.getUnreadCount());
console.log('All:', notificationManager.getNotifications());
```

### Problem: Notifications disappear

**Reason:** Notifications are stored in localStorage
- Clearing browser cache removes them
- Incognito mode doesn't persist them

**Solution:**
- Use normal browser mode
- Don't clear cache while testing
- Use "Generate Alerts" button to recreate

## 🎓 Step-by-Step Testing Guide

### Complete Test Flow:

```
Step 1: Open Dashboard
→ http://localhost:3001/dashboard

Step 2: Check Current State
→ Look at bell icon (should be gray, no badge)
→ Look at "High Risk" stat card (shows "2")

Step 3: View High-Risk Students
→ Scroll down to red alert panel
→ See: Jane Smith (80%) and Tom Brown (90%)

Step 4: Generate Notifications
→ Click "Send to Notifications" button in red panel
→ OR click "Generate Alerts" in Quick Actions

Step 5: Verify Toast
→ Green toast appears: "2 high-risk notifications created!"

Step 6: Check Bell Icon
→ Red badge appears with "2"
→ Badge pulses/animates

Step 7: Open Notifications
→ Click bell icon
→ Dropdown opens

Step 8: View Notifications
→ See 2 red notifications
→ Each shows student name, ID, risk score
→ Blue dot indicates unread

Step 9: Interact with Notifications
→ Click a notification (marks as read, blue dot disappears)
→ Click ✓ icon (marks as read)
→ Click 🗑️ icon (deletes notification)
→ Click "Mark all as read" (clears all blue dots)

Step 10: Verify Badge Updates
→ Badge count decreases as you mark as read
→ Badge disappears when all read

Step 11: Test Filters
→ Click "Unread" tab (shows only unread)
→ Click "Read" tab (shows only read)
→ Click "All" tab (shows everything)

Step 12: Clean Up
→ Click "Clear all" button
→ Confirm deletion
→ Notifications cleared
```

## 📊 Expected Results

### After Clicking "Generate Alerts":

| Location | What You See |
|----------|--------------|
| Toast | "2 high-risk notifications created!" |
| Bell Icon | Red badge with "2" |
| Dropdown | 2 notifications with red icons |
| Unread Tab | Shows "Unread (2)" |
| All Tab | Shows "All (2)" |

### After Marking as Read:

| Action | Result |
|--------|--------|
| Click notification | Blue dot disappears, badge -1 |
| Click ✓ icon | Same as above |
| Click "Mark all as read" | All blue dots gone, badge = 0 |

### After Deleting:

| Action | Result |
|--------|--------|
| Click 🗑️ icon | Notification removed, count -1 |
| Click "Clear all" | All notifications removed |

## 🎯 Quick Verification Checklist

- [ ] Bell icon visible in header (top-right)
- [ ] Red alert panel visible on Overview tab
- [ ] "Generate Alerts" button in Quick Actions
- [ ] Clicking button shows toast
- [ ] Badge appears on bell icon
- [ ] Badge shows correct number
- [ ] Clicking bell opens dropdown
- [ ] Notifications show red icons
- [ ] Blue dots on unread notifications
- [ ] Time stamps display correctly
- [ ] Filter tabs work (All/Unread/Read)
- [ ] Mark as read works
- [ ] Delete works
- [ ] Clear all works
- [ ] Badge updates in real-time

## 💡 Pro Tips

1. **Use the red alert panel** - Easiest way to see high-risk students
2. **Click "Send to Notifications"** - One-click to generate all alerts
3. **Check bell icon first** - Red badge = notifications waiting
4. **Use Unread filter** - Focus on new notifications
5. **Test with new student** - Add student with low scores to trigger auto-notification

## 🚀 Advanced Testing

### Test Auto-Notification on New Student:

1. Click "Add Student"
2. Enter low scores (attendance: 20, grade: 30, behavioral: 2)
3. Click "Add Student"
4. **Notification should appear automatically**
5. Check bell icon for badge

### Test Bulk Import Notification:

1. Download CSV template
2. Add student with low scores
3. Import CSV
4. **Notification should appear for import**
5. If high-risk students imported, additional alerts appear

### Test All Notification Types:

1. **High Risk** - Use "Generate Alerts" button
2. **Follow-up** - Schedule a follow-up in student modal
3. **Message** - Send email/SMS in student modal
4. **System** - Import CSV or add student
5. **Success** - Add student or assign counselor

## 📞 Still Not Working?

### Check Browser Console:

1. Press F12 to open DevTools
2. Go to Console tab
3. Look for errors (red text)
4. Check if notificationManager is loaded:
   ```javascript
   console.log(window.notificationManager);
   ```

### Check LocalStorage:

1. Press F12 to open DevTools
2. Go to Application tab
3. Click "Local Storage" → your domain
4. Look for "notifications" key
5. Should see JSON array of notifications

### Force Refresh:

1. Press Ctrl+Shift+R (Windows/Linux)
2. Or Cmd+Shift+R (Mac)
3. This clears cache and reloads

---

**The notification system is fully functional!** Use the "Generate Alerts" button or the red alert panel to easily test it. 🎉
