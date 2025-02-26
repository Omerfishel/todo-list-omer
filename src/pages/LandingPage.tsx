
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Globe, Rocket, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
      {/* Navbar */}
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Organize Your Life with TaskMaster
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The smart way to manage your tasks, collaborate with others, and achieve your goals.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/auth/signup">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-8 w-8 text-primary" />,
                title: "Access Anywhere",
                description: "Access your tasks from any device, anywhere in the world.",
              },
              {
                icon: <Shield className="h-8 w-8 text-primary" />,
                title: "Secure & Private",
                description: "Your data is encrypted and protected with enterprise-grade security.",
              },
              {
                icon: <Rocket className="h-8 w-8 text-primary" />,
                title: "Boost Productivity",
                description: "Smart features to help you get more done in less time.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="animate-on-scroll p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 w-full bg-gradient-to-r from-primary/5 to-purple-600/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 animate-on-scroll">
            Why Choose TaskMaster?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Smart task categorization",
              "Location-based reminders",
              "Calendar integration",
              "Collaborative features",
              "Real-time updates",
              "Beautiful interface",
              "Custom notifications",
              "Priority management",
              "Task analytics"
            ].map((benefit, index) => (
              <div
                key={index}
                className="animate-on-scroll flex items-center gap-4 p-6 rounded-xl bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 transform hover:-translate-y-1"
              >
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-purple-600/10">
        <div className="max-w-7xl mx-auto text-center space-y-8 animate-on-scroll">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who are already managing their tasks more effectively.
          </p>
          <Link to="/auth/signup">
            <Button size="lg" className="animate-pulse">
              Start Organizing Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
