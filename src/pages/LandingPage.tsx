
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn', 'opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      element.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

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
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-block w-full max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Organize Your Life with TaskMaster
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simplify your day, achieve more, and never miss a deadline with our intuitive task management platform.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/auth/signin">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
