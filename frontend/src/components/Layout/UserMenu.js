import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserMenu = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-xl glass-strong border border-white/20 shadow-lg py-1 z-10">
      <button
        onClick={() => {
          onClose();
          navigate('/profile');
        }}
        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 w-full text-left"
      >
        <User className="mr-3 h-5 w-5" />
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 w-full text-left"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Sign out
      </button>
    </div>
  );
};

export default UserMenu;