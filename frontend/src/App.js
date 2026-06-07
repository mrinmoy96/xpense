import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider }         from './context/ThemeContext';

import AuthPage       from './components/auth/AuthPage';
import AppLayout      from './components/layout/AppLayout';
import DashboardPage  from './components/dashboard/DashboardPage';
import ExpensesPage   from './components/expenses/ExpensesPage';
import HistoryPage    from './components/expenses/HistoryPage';
import ProfilePage    from './components/profile/ProfilePage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/"         element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><ExpensesPage  /></ProtectedRoute>} />
      <Route path="/history"  element={<ProtectedRoute><HistoryPage   /></ProtectedRoute>} />
      <Route path="/profile"  element={<ProtectedRoute><ProfilePage   /></ProtectedRoute>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background  : 'var(--bg2)',
                color       : 'var(--text)',
                border      : '1px solid var(--border2)',
                fontFamily  : 'Inter, sans-serif',
                fontSize    : '13px',
              },
              success : { iconTheme: { primary: '#22c97a', secondary: '#fff' } },
              error   : { iconTheme: { primary: '#f25c5c', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
