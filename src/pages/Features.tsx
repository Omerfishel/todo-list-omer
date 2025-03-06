
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Calendar, List, Tag, CheckCircle, Clock, BellRing, Target, Users, PanelLeftOpen, Sparkles, Smartphone, Database, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

// Feature component for the detailed features section
const FeatureDetail = ({ 
  icon: Icon, 
  title, 
  description, 
  imagePosition = 'right',
  delay = 0
}: { 
  icon: any; 
  title: string; 
  description: string; 
  imagePosition?: 'left' | 'right';
  delay?: number;
}) => (
  <div className={`flex flex-col ${imagePosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16 py-12 opacity-0 translate-y-10 scroll-hidden`}
       style={{ transitionDelay: `${delay}ms` }}>
    <div className="md:w-1/2">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-lg text-gray-600 mb-6">{description}</p>
      <div className="flex space-x-2">
        {[1, 2, 3].map((star) => (
          <Sparkles key={star} className="h-5 w-5 text-amber-400" />
        ))}
      </div>
    </div>
    <div className="md:w-1/2">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        <div className="p-2 bg-white border-b border-indigo-100 flex items-center space-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          <div className="flex-1"></div>
        </div>
        <div className="aspect-video flex items-center justify-center text-gray-400 p-8">
          Feature Screenshot/GIF Here
        </div>
      </div>
    </div>
  </div>
);

// Feature card for the overview section
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0
}: { 
  icon: any; 
  title: string; 
  description: string;
  delay?: number;
}) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 opacity-0 translate-y-10 scroll-hidden`}
       style={{ transitionDelay: `${delay}ms` }}>
    <Icon className="h-12 w-12 text-indigo-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export function Features() {
  const { user } = useAuth();
  
  // Animation on scroll effect
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 pt-16">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent opacity-0 translate-y-10 scroll-hidden">
              Powerful Features for Maximum Productivity
            </h1>
            <p className="text-xl text-gray-600 mb-8 opacity-0 translate-y-10 scroll-hidden" style={{ transitionDelay: '100ms' }}>
              TaskMaster provides all the tools you need to organize your tasks, collaborate with your team, and achieve your goals.
            </p>
            <div className="flex justify-center opacity-0 translate-y-10 scroll-hidden" style={{ transitionDelay: '200ms' }}>
              {user ? (
                <Button 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all text-white"
                  size="lg"
                  asChild
                >
                  <Link to="/app">Go to Dashboard</Link>
                </Button>
              ) : (
                <Button 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all text-white"
                  size="lg"
                  asChild
                >
                  <Link to="/auth/signup">Start Free Trial</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Overview */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 opacity-0 translate-y-10 scroll-hidden">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the essential features that make TaskMaster the perfect productivity solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={List} 
              title="Intuitive Task Management" 
              description="Create, organize, and track your tasks with our simple and powerful interface."
              delay={100}
            />
            
            <FeatureCard 
              icon={Calendar} 
              title="Calendar Integration" 
              description="View your tasks in a calendar view and never miss important deadlines."
              delay={200}
            />
            
            <FeatureCard 
              icon={Tag} 
              title="Categories & Tags" 
              description="Keep your tasks organized with custom categories and tags for easy filtering."
              delay={300}
            />
            
            <FeatureCard 
              icon={CheckCircle} 
              title="Progress Tracking" 
              description="Monitor your productivity with visual progress indicators and completion metrics."
              delay={400}
            />
            
            <FeatureCard 
              icon={BellRing} 
              title="Smart Reminders" 
              description="Get notified about upcoming deadlines and important tasks at the right time."
              delay={500}
            />
            
            <FeatureCard 
              icon={Target} 
              title="Priority Levels" 
              description="Focus on what's important by setting different priority levels for your tasks."
              delay={600}
            />
          </div>
        </div>
      </section>
      
      {/* Detailed Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 opacity-0 translate-y-10 scroll-hidden">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Explore Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deeper into TaskMaster's most powerful tools
            </p>
          </div>
          
          <div className="space-y-8 md:space-y-24">
            <FeatureDetail 
              icon={List} 
              title="Task Management Reimagined" 
              description="TaskMaster's core task management system is designed to be both simple for beginners and powerful for experts. Create tasks, set deadlines, add details, and track progress—all with an intuitive interface that adapts to your workflow."
              imagePosition="right"
              delay={100}
            />
            
            <FeatureDetail 
              icon={Calendar} 
              title="Smart Calendar Integration" 
              description="See your schedule at a glance with our interactive calendar view. Drag and drop tasks to reschedule, get a clear overview of your week or month, and synchronize with your favorite calendar apps."
              imagePosition="left"
              delay={200}
            />
            
            <FeatureDetail 
              icon={Users} 
              title="Seamless Team Collaboration" 
              description="Work better together with TaskMaster's collaboration features. Assign tasks to team members, share projects, communicate within tasks, and keep everyone aligned on goals and deadlines."
              imagePosition="right"
              delay={300}
            />
            
            <FeatureDetail 
              icon={PanelLeftOpen} 
              title="Customizable Dashboard" 
              description="Configure your workspace to match your unique workflow. Choose from different views, rearrange elements, set default filters, and create the perfect productivity environment for your needs."
              imagePosition="left"
              delay={400}
            />
          </div>
        </div>
      </section>
      
      {/* Mobile & Security Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="opacity-0 translate-y-10 scroll-hidden">
              <div className="flex items-center mb-4">
                <Smartphone className="h-8 w-8 text-indigo-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Available Everywhere</h3>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Access your tasks from any device with our responsive web app and native mobile applications. Start a task on your desktop and continue on your phone—your data syncs automatically.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-black text-white rounded-lg px-4 py-2 flex items-center">
                  <span className="mr-2">iOS</span>
                </div>
                <div className="bg-black text-white rounded-lg px-4 py-2 flex items-center">
                  <span className="mr-2">Android</span>
                </div>
                <div className="bg-black text-white rounded-lg px-4 py-2 flex items-center">
                  <span className="mr-2">Web</span>
                </div>
              </div>
            </div>
            
            <div className="opacity-0 translate-y-10 scroll-hidden" style={{ transitionDelay: '100ms' }}>
              <div className="flex items-center mb-4">
                <Lock className="h-8 w-8 text-indigo-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Security & Privacy</h3>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Your data is secure with TaskMaster. We use industry-standard encryption, regular security audits, and strict privacy controls to ensure your information is protected at all times.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>GDPR compliant</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>No data sharing with third parties</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 translate-y-10 scroll-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to experience TaskMaster?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with our powerful features.
          </p>
          {user ? (
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8"
              asChild
            >
              <Link to="/app">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8"
              asChild
            >
              <Link to="/auth/signup">Start Free Trial</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
