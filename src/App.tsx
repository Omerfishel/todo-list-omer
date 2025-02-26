
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TodoList } from '@/components/TodoList';
import { TodoProvider } from '@/contexts/TodoContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SignIn } from '@/pages/auth/SignIn';
import { SignUp } from '@/pages/auth/SignUp';
import { Toaster } from '@/components/ui/toaster';
import { setupDefaultCategories } from '@/lib/setupDefaults';
import LandingPage from '@/pages/LandingPage';
import { toast } from '@/hooks/use-toast';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/auth/signin" />;
  }

  return <>{children}</>;
}

function AuthenticatedApp() {
  useEffect(() => {
    const setup = async () => {
      try {
        await setupDefaultCategories();
      } catch (error) {
        console.error('Error setting up defaults:', error);
        toast({
          title: "Setup Error",
          description: "There was an error setting up your account. Please try again.",
          variant: "destructive",
        });
      }
    };
    setup();
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
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/auth/signin" element={user ? <Navigate to="/dashboard" /> : <SignIn />} />
      <Route path="/auth/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
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
