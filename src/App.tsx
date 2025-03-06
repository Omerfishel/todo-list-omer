
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TodoList } from '@/components/TodoList';
import { TodoProvider } from '@/contexts/TodoContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SignIn } from '@/pages/auth/SignIn';
import { SignUp } from '@/pages/auth/SignUp';
import { Landing } from '@/pages/Landing';
import { Features } from '@/pages/Features';
import { About } from '@/pages/About';
import { Toaster } from '@/components/ui/toaster';
import { setupDefaultCategories } from '@/lib/setupDefaults';
import { Navbar } from '@/components/Navbar';

// Wrap protected routes
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto bg-indigo-400 rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to signin page but save the location they were trying to access
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Dashboard component with setup
function AuthenticatedApp() {
  useEffect(() => {
    setupDefaultCategories();
  }, []);

  return (
    <TodoProvider>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <TodoList />
      </div>
    </TodoProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route
            path="/app/*"
            element={
              <PrivateRoute>
                <AuthenticatedApp />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
