import React from 'react';

const ThemeWrapper = ({ children, className = '' }) => {
  const baseClasses = 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900';

  return (
    <div className={`min-h-screen ${baseClasses} ${className} transition-colors duration-300`}>
      {children}
    </div>
  );
};

export default ThemeWrapper;
