import React, { useState } from 'react';
import { Plus, Edit2, Save, X, Mail, Phone, User } from 'lucide-react';

const ParentGuardianInfo = ({ studentId, guardians = [], onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    isPrimary: false
  });

  const handleSubmit = () => {
    if (formData.name && formData.email) {
      if (editingId) {
        onUpdate(studentId, editingId, formData);
        setEditingId(null);
      } else {
        onAdd(studentId, formData);
        setIsAdding(false);
      }
      setFormData({ name: '', relationship: '', email: '', phone: '', isPrimary: false });
    }
  };

  const handleEdit = (guardian) => {
    setEditingId(guardian.id);
    setFormData(guardian);
    setIsAdding(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Parent/Guardian Information</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Relationship (e.g., Father, Mother, Guardian)"
            value={formData.relationship}
            onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">Primary Contact</span>
          </label>
          <div className="flex space-x-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-1"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({ name: '', relationship: '', email: '', phone: '', isPrimary: false });
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {guardians.map((guardian) => (
          <div key={guardian.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">{guardian.name}</h4>
                  <p className="text-xs text-gray-400">{guardian.relationship}</p>
                </div>
              </div>
              {guardian.isPrimary && (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">Primary</span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>{guardian.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>{guardian.phone}</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => handleEdit(guardian)}
                className="text-xs px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(studentId, guardian.id)}
                className="text-xs px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ParentGuardianInfo);
