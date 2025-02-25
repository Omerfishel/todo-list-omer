
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  console.log('PrivateRoute state:', { user: !!user, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to signin');
    return <Navigate to="/auth/signin" />;
  }

  return <>{children}</>;
}
