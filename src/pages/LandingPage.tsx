
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Globe, Rocket, Shield } from 'lucide-react';

const LandingPage = () => {
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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fadeIn">
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
                className="p-6 rounded-2xl bg-card border hover:shadow-lg transition-all duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-center">Why Choose TaskMaster?</h2>
            <div className="grid gap-6 max-w-2xl mx-auto">
              {[
                "Smart task categorization",
                "Location-based reminders",
                "Calendar integration",
                "Collaborative features",
                "Real-time updates",
                "Beautiful interface",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card/50 animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-purple-600/10">
        <div className="max-w-7xl mx-auto text-center space-y-8">
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
