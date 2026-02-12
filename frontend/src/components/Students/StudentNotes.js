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
          className="flex-1 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {notes.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No notes yet
          </div>
        )}
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            {editingId === note.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(note.id)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm flex items-center space-x-1 font-medium"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm flex items-center space-x-1 font-medium"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-700 mb-2 text-sm leading-relaxed whitespace-pre-wrap">{note.text}</p>
                <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
                  <span>{note.author} • {new Date(note.timestamp).toLocaleString()}</span>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(note)}
                      className="p-1 px-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit Note"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(studentId, note.id)}
                      className="p-1 px-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
