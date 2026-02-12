# Where to Find Each Feature

## 🎯 Feature Locations in the Dashboard

### **Overview Tab** (Default view when you open dashboard)

#### ✅ Visible Features:
1. **Bulk Import/Export** - Large section with 3 cards:
   - "Import CSV" button (left card)
   - "Export CSV" button (middle card)  
   - "Download Template" button (right card)

2. **Statistics Cards** (Top row):
   - Total Students
   - High Risk Students
   - Average Attendance
   - Intervention Alerts

3. **Charts**:
   - Dropout Trends & Predictions (line chart)
   - Risk Distribution (pie chart)

4. **Quick Actions** (Bottom):
   - Add New Student
   - Export Report
   - Bulk Messages

---

### **Students Tab** (Click "Students" in top navigation)

#### ✅ Visible Features:
1. **Search Bar** - Search students by name or ID

2. **Filter Dropdown** - Filter by risk level (All/Low/Medium/High)

3. **Compare Button** - Shows when you select students
   - Click the ⚖️ icon on student cards to select
   - Select 2-4 students
   - Click "Compare (X)" button that appears

4. **Add Student Button** - Green button on the right

5. **Student Cards** - Grid of student cards
   - Each card shows: Name, ID, Attendance, Grade, Behavioral Score, Risk Score
   - **Click any card to open detailed modal** ⬅️ THIS IS WHERE MOST NEW FEATURES ARE!

---

### **Student Detail Modal** (Click any student card)

This modal contains ALL the collaboration and communication features:

#### Section 1: Personal Information (Top Left)
- Name, ID, Email, Phone

#### Section 2: Academic Performance (Top Right)
- Attendance, Grade, Behavioral Score, Risk Score

#### Section 3: 👨‍🏫 **Counselor Assignment** ⭐ NEW
- Shows assigned counselor or "Not assigned"
- Click "Assign" or "Change" button
- Select from dropdown list
- Shows counselor workload

#### Section 4: 👨‍👩‍👧 **Parent/Guardian Information** ⭐ NEW
- Click "Add" button to add guardian
- Enter: Name, Relationship, Email, Phone
- Mark as "Primary Contact"
- Edit or Delete existing guardians

#### Section 5: 📧 **Send Communication** ⭐ NEW
- Toggle between Email and SMS tabs
- Select template from dropdown:
  - High Risk
  - Medium Risk  
  - Low Risk
  - Parent Alert
  - Reminder (SMS only)
- Customize message
- Click "Send" button
- Copy to clipboard option

#### Section 6: 📅 **Follow-ups & Reminders** ⭐ NEW
- Click "Schedule" button
- Fill in:
  - Title (e.g., "Follow-up meeting")
  - Description
  - Date and Time
  - Type (Meeting/Call/Email/Check-in)
  - Reminder time (1 hour to 1 week before)
- View all scheduled follow-ups
- Mark as complete ✓
- Delete follow-ups

#### Section 7: 📝 **Notes & Comments** ⭐ NEW
- Type note in text field
- Click "Add" button
- View all notes with timestamps
- Edit existing notes (pencil icon)
- Delete notes (trash icon)
- Shows author name

#### Section 8: 📊 **Activity Timeline** ⭐ NEW (Bottom of modal)
- Chronological list of all interactions
- Shows: Emails, Calls, Meetings, Notes, Alerts
- Color-coded by activity type
- Timestamps and author info

#### Bottom Actions:
- "Send Message" button
- "Call Student" button

---

### **Analytics Tab** (Click "Analytics" in top navigation)

#### ✅ Visible Features:
1. **Student Performance Analytics** - Bar chart comparing all students
2. **DMSW Model Performance** - 4 metric cards showing model stats

---

### **Predictions Tab** (Click "Predictions" in top navigation)

#### ✅ Visible Features:
1. **Risk Prediction Results** - Table view of all students
   - Shows: Name, ID, Attendance, Grade, Risk Score, Status
   - Click any row to open student detail modal

---

### **Student Comparison Modal** ⭐ NEW

To access:
1. Go to Students tab
2. Click ⚖️ icon on 2-4 student cards (cards turn blue when selected)
3. Click "Compare (X)" button at top
4. Modal opens showing:
   - **Radar Chart** - Visual comparison of all metrics
   - **Side-by-Side Cards** - Each student in separate column
   - **Trend Indicators** - ↑ (best), ↓ (worst), - (average) for each metric

---

### **Toast Notifications** ⭐ NEW (Top-right corner)

Automatic notifications appear for:
- ⚠️ New high-risk students detected
- ✅ Student added successfully
- ✅ Note added
- ✅ Email/SMS sent
- ✅ Follow-up scheduled
- ✅ Counselor assigned
- ✅ Guardian added
- ℹ️ CSV imported/exported
- ⚠️ Comparison limit reached

---

## 🔍 How to Test Each Feature

### Test 1: Bulk Import
1. Go to Overview tab
2. Scroll to "Bulk Import/Export" section
3. Click "Download Template"
4. Open CSV, add a student row
5. Click "Import CSV" and select file
6. Check Students tab for new student

### Test 2: Student Comparison
1. Go to Students tab
2. Click ⚖️ on "John Doe" card
3. Click ⚖️ on "Jane Smith" card
4. Click "Compare (2)" button
5. View radar chart and metrics

### Test 3: Add Note
1. Go to Students tab
2. Click on any student card
3. Scroll to "Notes & Comments"
4. Type "Test note"
5. Click "Add"
6. See note appear with timestamp

### Test 4: Schedule Follow-up
1. Open student detail modal
2. Find "Follow-ups & Reminders"
3. Click "Schedule"
4. Fill in form
5. Click "Schedule"
6. See follow-up in list

### Test 5: Assign Counselor
1. Open student detail modal
2. Find "Assigned Counselor" section
3. Click "Assign" button
4. Select "Dr. Sarah Johnson"
5. Click "Assign"
6. See counselor name displayed

### Test 6: Add Guardian
1. Open student detail modal
2. Find "Parent/Guardian Information"
3. Click "Add"
4. Fill in guardian details
5. Check "Primary Contact"
6. Click "Save"
7. See guardian card appear

### Test 7: Send Email
1. Open student detail modal
2. Find "Send Communication"
3. Click "Email" tab
4. Select "High Risk" template
5. Customize message
6. Click "Send Email"
7. See success notification
8. Check Activity Timeline for logged email

### Test 8: View Activity Timeline
1. Open student detail modal
2. Scroll to bottom
3. See "Activity Timeline" section
4. View all logged activities

### Test 9: Export Data
1. Go to Overview tab
2. Find "Bulk Import/Export"
3. Click "Export CSV"
4. File downloads automatically

### Test 10: Mobile View
1. Resize browser to mobile width (< 768px)
2. Or open on mobile device
3. See responsive layout
4. Tabs scroll horizontally
5. Cards stack vertically

---

## ❓ Troubleshooting

### "I only see Import/Export"
**Solution**: You need to **click on a student card** to open the detail modal. That's where 80% of the new features are located!

### "I don't see the Compare button"
**Solution**: 
1. Go to Students tab
2. Click the ⚖️ icon on student cards first
3. The Compare button appears after selecting students

### "No notifications appearing"
**Solution**:
1. Add a new student with low attendance (< 30%)
2. Notification should appear automatically
3. Or perform any action (add note, send email, etc.)

### "Can't find counselor assignment"
**Solution**: Open student detail modal (click student card), it's near the top after personal info

### "Activity timeline is empty"
**Solution**: 
1. Add a note
2. Send an email/SMS
3. Schedule a follow-up
4. These actions automatically log to timeline

---

## 📱 Mobile-Specific Features

When viewing on mobile (< 768px width):

1. **Simplified Cards** - Less information shown
2. **Stacked Layouts** - Everything in single column
3. **Horizontal Scroll Tabs** - Swipe to see all tabs
4. **Larger Touch Targets** - Easier to tap
5. **Hidden Details** - Some secondary info hidden
6. **Full-Width Modals** - Better use of screen space

---

## 🎨 Visual Indicators

- **Blue Border** = Student selected for comparison
- **Red Badge** = High Risk status
- **Yellow Badge** = Medium Risk status
- **Green Badge** = Low Risk status
- **Blue Dot** = Primary guardian contact
- **Checkmark** = Completed follow-up
- **Color-coded Timeline** = Different activity types

---

## 💡 Pro Tip

**The student detail modal is the heart of the new features!**

To see everything:
1. Click any student card
2. Scroll through the entire modal
3. You'll find all 8 new feature sections

Most users miss features because they don't realize clicking the student card opens a comprehensive detail view with all the collaboration tools!
