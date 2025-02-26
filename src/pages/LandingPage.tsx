
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                TaskMaster
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 px-4 py-[11px] md:text-6xl">Organize Your Life with TaskMaster</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simplify your day, achieve more, and never miss a deadline with our intuitive task management platform.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="text-base bg-slate-700 hover:bg-slate-600">Go To Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
