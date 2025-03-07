
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, CheckSquare, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/app' && location.pathname.startsWith('/app')) return true;
    if (path !== '/' && path !== '/app' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-white/90 backdrop-blur-md shadow-sm" 
        : "bg-transparent",
      location.pathname.startsWith('/app') 
        ? "bg-white/90 backdrop-blur-md shadow-sm" 
        : ""
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <CheckSquare className={cn(
                "h-8 w-8 transition-colors",
                scrolled ? "text-indigo-600" : "text-indigo-500"
              )} />
              <span className={cn(
                "ml-2 text-xl font-bold transition-all",
                scrolled 
                  ? "bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent" 
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
              )}>
                TaskMaster
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive('/') 
                    ? "bg-indigo-50 text-indigo-700 font-semibold" 
                    : scrolled ? "text-gray-800 hover:text-indigo-700" : "text-gray-700 hover:text-indigo-600",
                  "hover:bg-gray-50/80"
                )}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive('/features') 
                    ? "bg-indigo-50 text-indigo-700 font-semibold" 
                    : scrolled ? "text-gray-800 hover:text-indigo-700" : "text-gray-700 hover:text-indigo-600",
                  "hover:bg-gray-50/80"
                )}
              >
                Features
              </Link>
              <Link 
                to="/about" 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive('/about') 
                    ? "bg-indigo-50 text-indigo-700 font-semibold" 
                    : scrolled ? "text-gray-800 hover:text-indigo-700" : "text-gray-700 hover:text-indigo-600",
                  "hover:bg-gray-50/80"
                )}
              >
                About
              </Link>
              
              {user ? (
                <>
                  <Button 
                    variant={isActive('/app') ? "default" : "secondary"}
                    size="sm" 
                    className={cn(
                      "ml-2",
                      isActive('/app') && "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                    )}
                    asChild
                  >
                    <Link to="/app">
                      Dashboard
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center gap-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all"
                  asChild
                >
                  <Link to="/auth/signin">
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className={cn(
                "inline-flex items-center justify-center p-2 rounded-md transition-colors",
                scrolled ? "text-gray-800 hover:text-indigo-700" : "text-gray-700 hover:text-indigo-600",
                "hover:bg-gray-50/80"
              )}
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fadeIn absolute w-full bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive('/') 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              )}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive('/features') 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              )}
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive('/about') 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              )}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/app" 
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    isActive('/app') 
                      ? "bg-indigo-100 text-indigo-700" 
                      : "text-indigo-600 hover:bg-gray-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/auth/signin" 
                className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
