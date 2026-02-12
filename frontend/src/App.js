import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EnhancedDashboard from './components/Dashboard/EnhancedDashboard.js';
import DebugDashboard from './components/Dashboard/DebugDashboard.js';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Profile from './components/Profile/Profile';
import SettingsPage from './components/Settings/SettingsPage';
import { ToastProvider } from './components/Notifications/ToastContainer';
import './App.css';

function App() {
  const [, setUser] = React.useState(JSON.parse(localStorage.getItem('user')));

  // Check if user is authenticated
  const isAuthenticated = () => {
    // For development: allow direct access to dashboard
    // Comment out the next line in production
    return true;
    // return localStorage.getItem('token') !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  // Update user state when localStorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user')));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ToastProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/debug" element={<DebugDashboard />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <EnhancedDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;