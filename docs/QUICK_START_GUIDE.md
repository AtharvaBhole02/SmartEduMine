# Quick Start Guide - Enhanced Dashboard Features

## 🚀 Getting Started

### Run the Application
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📱 Feature Walkthrough

### 1. **View Dashboard Overview**
- Login to access the dashboard
- See 4 key metrics at the top (Total Students, High Risk, Avg Attendance, Alerts)
- Click any metric card to navigate to relevant section

### 2. **Import Students in Bulk**
```
Overview Tab → Bulk Import/Export Section
1. Click "Download Template" to get CSV format
2. Fill in student data:
   - name, email, phone, attendance, avgGrade, behavioralScore
3. Click "Import CSV" and select your file
4. Students are automatically added with risk calculations
```

### 3. **Add Individual Student**
```
Students Tab → Click "Add Student" button
- Fill in: Name, Email, Phone, Attendance %, Grade %, Behavioral Score
- Risk score is calculated automatically
- Click "Add Student"
```

### 4. **Compare Students**
```
Students Tab
1. Click the compare icon (⚖️) on 2-4 student cards
2. Selected students show blue border
3. Click "Compare (X)" button at top
4. View radar chart and side-by-side metrics
5. See trend indicators (↑ best, ↓ worst, - average)
```

### 5. **Manage Student Details**
```
Click any student card to open detailed view:

📋 Personal Information
- View/edit basic details

👨‍🏫 Assign Counselor
- Click "Assign" button
- Select from available counselors
- View counselor workload

👨‍👩‍👧 Add Parent/Guardian
- Click "Add" in Parent/Guardian section
- Enter name, relationship, email, phone
- Mark as primary contact
- Save

📝 Add Notes
- Type note in text field
- Click "Add"
- Edit/delete existing notes

📧 Send Communication
- Choose Email or SMS tab
- Select template (High Risk, Medium Risk, Low Risk, Parent Alert)
- Customize message
- Click "Send"

📅 Schedule Follow-up
- Click "Schedule" in Follow-ups section
- Enter title, description, date, time
- Choose type (Meeting, Call, Email, Check-in)
- Set reminder time
- Click "Schedule"

📊 View Activity Timeline
- Scroll to bottom of student modal
- See all interactions chronologically
- Activities auto-logged from notes, emails, etc.
```

### 6. **Export Data**
```
Overview Tab → Bulk Import/Export Section
- Click "Export CSV"
- File downloads with all student data
- Opens in Excel/Google Sheets
```

### 7. **Monitor Notifications**
```
Top-right corner of screen
- Automatic alerts for high-risk students
- Success confirmations for actions
- Warning messages for limits
- Auto-dismiss after 5 seconds
```

### 8. **Mobile Usage**
```
On mobile devices:
- Tabs scroll horizontally
- Cards stack vertically
- Simplified views hide non-essential info
- Touch-friendly buttons
- Swipe to scroll tables
```

## 🎯 Common Workflows

### Workflow 1: Onboarding New Students
1. Download CSV template
2. Fill in student data
3. Import CSV
4. Review imported students in Students tab
5. Assign counselors to high-risk students
6. Add parent/guardian contacts

### Workflow 2: Managing High-Risk Student
1. Receive notification about high-risk student
2. Click notification or find student in Predictions tab
3. Open student detail modal
4. Review academic performance
5. Add note about concerns
6. Send email using "High Risk" template
7. Schedule follow-up meeting
8. Assign counselor if not already assigned
9. Add parent contact and send parent alert

### Workflow 3: Regular Check-ins
1. Go to Students tab
2. Filter by "Medium Risk"
3. Open each student
4. Review activity timeline
5. Add check-in note
6. Send "Check-in" SMS
7. Schedule next follow-up

### Workflow 4: Comparing Student Progress
1. Go to Students tab
2. Select 2-4 students with compare icon
3. Click "Compare" button
4. Analyze radar chart for patterns
5. Review side-by-side metrics
6. Identify students needing intervention

### Workflow 5: End-of-Month Reporting
1. Go to Analytics tab
2. Review performance charts
3. Go to Overview tab
4. Export all student data to CSV
5. Use CSV for external reporting

## 💡 Pro Tips

1. **Quick Navigation**: Click stat cards on Overview to jump to relevant sections
2. **Bulk Actions**: Use CSV import for adding multiple students at once
3. **Templates**: Customize email/SMS templates for your institution
4. **Notes**: Add detailed notes for better tracking and handoffs
5. **Timeline**: Check activity timeline before contacting students
6. **Comparison**: Compare similar-risk students to identify patterns
7. **Mobile**: Use mobile view for quick checks on-the-go
8. **Counselor Load**: Balance counselor assignments by checking workload

## 🔍 Troubleshooting

### Students not showing after import
- Check CSV format matches template
- Ensure all required fields are filled
- Refresh the page

### Notifications not appearing
- Check browser notification permissions
- Clear localStorage and re-add students
- Refresh the page

### Data disappeared
- Data is stored in browser localStorage
- Clearing browser cache removes data
- Export CSV regularly as backup

### Mobile view issues
- Rotate device to landscape for better table views
- Use pinch-to-zoom if needed
- Some features simplified on mobile

### Comparison not working
- Maximum 4 students can be compared
- Deselect a student before adding another
- Refresh if comparison modal doesn't open

## 📊 Data Format Reference

### CSV Import Format
```csv
name,email,phone,attendance,avgGrade,behavioralScore
John Doe,john@example.com,+1234567890,85,78,8
Jane Smith,jane@example.com,+1234567891,92,88,9
```

### Risk Score Calculation
- Attendance: 40% weight
- Grade: 35% weight
- Behavioral: 25% weight
- High Risk: ≥70%
- Medium Risk: 40-69%
- Low Risk: <40%

## 🎨 Keyboard Shortcuts (Future Enhancement)
Currently not implemented, but planned:
- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + N`: Add new student
- `Ctrl/Cmd + E`: Export data
- `Esc`: Close modals

## 📞 Need Help?
- Check FEATURES_ADDED.md for detailed feature documentation
- Review component files for technical details
- Check browser console for error messages
