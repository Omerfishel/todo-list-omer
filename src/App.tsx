
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { TodoList } from '@/components/TodoList';
import { TodoProvider } from '@/contexts/TodoContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SignIn } from '@/pages/auth/SignIn';
import { SignUp } from '@/pages/auth/SignUp';
import { Toaster } from '@/components/ui/toaster';
import { setupDefaultCategories } from '@/lib/setupDefaults';
import LandingPage from '@/pages/LandingPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  return <>{children}</>;
}

function AuthenticatedApp() {
  useEffect(() => {
    setupDefaultCategories();
  }, []);

  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-50">
        <TodoList />
      </div>
    </TodoProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AuthenticatedApp />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
