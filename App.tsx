import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import FlashcardsPage from './pages/FlashcardsPage';
import StudyPlanPage from './pages/StudyPlanPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Simple Auth Guard Mock
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('authToken');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AppContent = () => {
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected Routes wrapped in Layout */}
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="study-plan" element={<StudyPlanPage />} />
          <Route path="upload" element={<UploadPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;