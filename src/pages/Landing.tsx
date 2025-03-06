
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Clock, Calendar, Tag, List, Target, BellRing, Star, ChevronRight, LucideIcon } from 'lucide-react';

// Create animation effect for scrolling
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
          entry.target.classList.remove('opacity-0');
          entry.target.classList.remove('translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.scroll-hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

// Animated feature card component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  className = "" 
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string; 
  className?: string;
}) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
    <Icon className="h-12 w-12 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Testimonial component
const Testimonial = ({ 
  quote, 
  author, 
  role, 
  className = "" 
}: { 
  quote: string; 
  author: string; 
  role: string; 
  className?: string;
}) => (
  <div className={`bg-white p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-bl-full opacity-20"></div>
    <div className="text-xl text-gray-700 italic mb-6">"{quote}"</div>
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
        {author.charAt(0)}
      </div>
      <div className="ml-3">
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </div>
  </div>
);

export function Landing() {
  const { user } = useAuth();
  useScrollAnimation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 pt-16">
      <Navbar />
      
      {/* Hero Section with Animation */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-100">
                Stay organized, <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">achieve more</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-200">
                TaskMaster helps you manage your tasks efficiently, so you can focus on what really matters. Simple, intuitive, and powerful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-300">
                {user ? (
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all text-white px-8 py-6 h-auto text-lg"
                    asChild
                  >
                    <Link to="/app">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all text-white px-8 py-6 h-auto text-lg"
                      asChild
                    >
                      <Link to="/auth/signup">Get Started</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-8 py-6 h-auto text-lg"
                      asChild
                    >
                      <Link to="/auth/signin">Sign In</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-400">
              <div className="rounded-xl bg-white shadow-2xl border border-gray-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-bl-full opacity-30"></div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-indigo-50 rounded-lg transform transition-transform hover:scale-105 duration-300">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">Complete project proposal</span>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg transform transition-transform hover:scale-105 duration-300">
                    <Clock className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">Team meeting at 2:00 PM</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg transform transition-transform hover:scale-105 duration-300">
                    <Calendar className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">Dentist appointment on Friday</span>
                  </div>
                  <div className="flex items-center p-3 bg-pink-50 rounded-lg transform transition-transform hover:scale-105 duration-300">
                    <Tag className="h-6 w-6 text-pink-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">Buy groceries for dinner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* App Demo GIF Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white opacity-0 translate-y-10 scroll-hidden transition-all duration-700">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            See TaskMaster in action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Streamline your workflow with our intuitive interface and powerful features
          </p>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 bg-gray-800 flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="flex-1 text-gray-400 text-sm ml-2">TaskMaster Dashboard</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-2">
              <img 
                src="/lovable-uploads/cf50abd6-a33c-4713-bbc6-1ace7702b810.png" 
                alt="TaskMaster App Interface" 
                className="w-full h-auto rounded-md shadow-md transform hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with Animation */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="features">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 opacity-0 translate-y-10 scroll-hidden transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TaskMaster comes packed with all the tools you need to manage your tasks efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={List} 
              title="Simple Task Management" 
              description="Create, organize, and track your tasks with ease. Intuitive interface makes task management a breeze."
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-100"
            />
            
            <FeatureCard 
              icon={Calendar} 
              title="Calendar Integration" 
              description="Schedule tasks and set reminders. Never miss an important deadline again."
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-200"
            />
            
            <FeatureCard 
              icon={Tag} 
              title="Categories & Tags" 
              description="Organize tasks with custom categories and tags for better organization and filtering."
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-300"
            />
            
            <FeatureCard 
              icon={Target} 
              title="Priority Levels" 
              description="Set task priorities to focus on what's most important and urgent."
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-400"
            />
            
            <FeatureCard 
              icon={BellRing} 
              title="Reminders" 
              description="Get notified about upcoming deadlines and important tasks."
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-500"
            />
            
            <FeatureCard 
              icon={CheckCircle} 
              title="Progress Tracking" 
              description="Track your productivity and see completed tasks at a glance."
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-600"
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white opacity-0 translate-y-10 scroll-hidden transition-all duration-700">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              What our users say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity with TaskMaster
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              quote="TaskMaster has completely changed how I manage my daily tasks. I'm more productive than ever!"
              author="Sarah Johnson"
              role="Marketing Manager"
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-100"
            />
            
            <Testimonial 
              quote="The interface is so intuitive. I was able to get my entire team onboard in just a day."
              author="Michael Chen"
              role="Product Lead"
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-200"
            />
            
            <Testimonial 
              quote="I've tried many task managers, but TaskMaster stands out with its simplicity and powerful features."
              author="Emma Rodriguez"
              role="Freelance Designer"
              className="opacity-0 translate-y-10 scroll-hidden transition-all duration-700 delay-300"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section with Animation */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 translate-y-10 scroll-hidden transition-all duration-700">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to get organized?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with TaskMaster.
          </p>
          {user ? (
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 h-auto text-lg"
              asChild
            >
              <Link to="/app">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 h-auto text-lg group"
              asChild
            >
              <Link to="/auth/signup">
                Get Started for Free
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-white">
                  TaskMaster
                </span>
              </div>
              <p className="mt-4 max-w-xs text-gray-400">
                The simple and effective way to organize your tasks and boost productivity.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
                <ul className="space-y-2">
                  <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                  <li><Link to="#" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                  <li><Link to="#" className="hover:text-indigo-400 transition-colors">Testimonials</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                <ul className="space-y-2">
                  <li><Link to="#" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
                  <li><Link to="#" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
                  <li><Link to="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                  <li><Link to="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                  <li><Link to="#" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="#" className="hover:text-indigo-400 transition-colors">
                Twitter
              </Link>
              <Link to="#" className="hover:text-indigo-400 transition-colors">
                Facebook
              </Link>
              <Link to="#" className="hover:text-indigo-400 transition-colors">
                Instagram
              </Link>
              <Link to="#" className="hover:text-indigo-400 transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
