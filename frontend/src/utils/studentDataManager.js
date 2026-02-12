// Student Data Manager - handles all student-related data operations
export const studentDataManager = {
  // Notes management
  addNote: (studentId, noteText, author = 'Current User') => {
    const notes = JSON.parse(localStorage.getItem(`student_${studentId}_notes`) || '[]');
    const newNote = {
      id: Date.now(),
      text: noteText,
      author,
      timestamp: new Date().toISOString()
    };
    notes.push(newNote);
    localStorage.setItem(`student_${studentId}_notes`, JSON.stringify(notes));
    return newNote;
  },

  getNotes: (studentId) => {
    return JSON.parse(localStorage.getItem(`student_${studentId}_notes`) || '[]');
  },

  updateNote: (studentId, noteId, newText) => {
    const notes = JSON.parse(localStorage.getItem(`student_${studentId}_notes`) || '[]');
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, text: newText, edited: new Date().toISOString() } : note
    );
    localStorage.setItem(`student_${studentId}_notes`, JSON.stringify(updatedNotes));
  },

  deleteNote: (studentId, noteId) => {
    const notes = JSON.parse(localStorage.getItem(`student_${studentId}_notes`) || '[]');
    const filteredNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem(`student_${studentId}_notes`, JSON.stringify(filteredNotes));
  },

  // Activity timeline
  addActivity: (studentId, activity) => {
    const activities = JSON.parse(localStorage.getItem(`student_${studentId}_activities`) || '[]');
    activities.unshift({ ...activity, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem(`student_${studentId}_activities`, JSON.stringify(activities));
  },

  getActivities: (studentId) => {
    return JSON.parse(localStorage.getItem(`student_${studentId}_activities`) || '[]');
  },

  // Guardian management
  addGuardian: (studentId, guardian) => {
    const guardians = JSON.parse(localStorage.getItem(`student_${studentId}_guardians`) || '[]');
    guardians.push({ ...guardian, id: Date.now() });
    localStorage.setItem(`student_${studentId}_guardians`, JSON.stringify(guardians));
  },

  getGuardians: (studentId) => {
    return JSON.parse(localStorage.getItem(`student_${studentId}_guardians`) || '[]');
  },

  updateGuardian: (studentId, guardianId, updatedData) => {
    const guardians = JSON.parse(localStorage.getItem(`student_${studentId}_guardians`) || '[]');
    const updated = guardians.map(g => g.id === guardianId ? { ...g, ...updatedData } : g);
    localStorage.setItem(`student_${studentId}_guardians`, JSON.stringify(updated));
  },

  deleteGuardian: (studentId, guardianId) => {
    const guardians = JSON.parse(localStorage.getItem(`student_${studentId}_guardians`) || '[]');
    const filtered = guardians.filter(g => g.id !== guardianId);
    localStorage.setItem(`student_${studentId}_guardians`, JSON.stringify(filtered));
  },

  // Follow-ups
  addFollowUp: (studentId, followUp) => {
    const followUps = JSON.parse(localStorage.getItem(`student_${studentId}_followups`) || '[]');
    followUps.push({ ...followUp, id: Date.now() });
    localStorage.setItem(`student_${studentId}_followups`, JSON.stringify(followUps));
  },

  getFollowUps: (studentId) => {
    return JSON.parse(localStorage.getItem(`student_${studentId}_followups`) || '[]');
  },

  completeFollowUp: (studentId, followUpId) => {
    const followUps = JSON.parse(localStorage.getItem(`student_${studentId}_followups`) || '[]');
    const updated = followUps.map(f => f.id === followUpId ? { ...f, completed: true } : f);
    localStorage.setItem(`student_${studentId}_followups`, JSON.stringify(updated));
  },

  deleteFollowUp: (studentId, followUpId) => {
    const followUps = JSON.parse(localStorage.getItem(`student_${studentId}_followups`) || '[]');
    const filtered = followUps.filter(f => f.id !== followUpId);
    localStorage.setItem(`student_${studentId}_followups`, JSON.stringify(filtered));
  },

  // Counselor assignment
  assignCounselor: (studentId, counselor) => {
    localStorage.setItem(`student_${studentId}_counselor`, JSON.stringify(counselor));
  },

  getCounselor: (studentId) => {
    return JSON.parse(localStorage.getItem(`student_${studentId}_counselor`) || 'null');
  }
};

// Mock counselors data
export const mockCounselors = [
  { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.j@college.edu', assignedStudents: 12 },
  { id: 2, name: 'Prof. Michael Chen', email: 'michael.c@college.edu', assignedStudents: 15 },
  { id: 3, name: 'Dr. Emily Rodriguez', email: 'emily.r@college.edu', assignedStudents: 10 },
  { id: 4, name: 'Prof. David Kim', email: 'david.k@college.edu', assignedStudents: 14 }
];
