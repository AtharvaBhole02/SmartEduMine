import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const StudentNotes = ({ studentId, notes = [], onAddNote, onUpdateNote, onDeleteNote }) => {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    if (newNote.trim()) {
      onAddNote(studentId, newNote);
      setNewNote('');
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const handleSave = (noteId) => {
    if (editText.trim()) {
      onUpdateNote(studentId, noteId, editText);
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a note about this student..."
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
            {editingId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(note.id)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center space-x-1"
                  >
                    <Save className="h-3 w-3" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm flex items-center space-x-1"
                  >
                    <X className="h-3 w-3" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-white mb-2">{note.text}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{note.author} • {new Date(note.timestamp).toLocaleString()}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="hover:text-blue-400 transition-colors"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(studentId, note.id)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(StudentNotes);
