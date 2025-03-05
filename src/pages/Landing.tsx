
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Clock, Calendar, Tag, List, Target, BellRing, CheckSquare } from 'lucide-react';

export function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                Stay organized, achieve more
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                TaskMaster helps you manage your tasks efficiently, so you can focus on what really matters. Simple, intuitive, and powerful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
            <div className="md:w-1/2">
              <div className="rounded-xl bg-white shadow-xl border border-gray-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-bl-full opacity-30"></div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">Complete project proposal</span>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">Team meeting at 2:00 PM</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">Dentist appointment on Friday</span>
                  </div>
                  <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                    <Tag className="h-6 w-6 text-pink-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-800">Buy groceries for dinner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="features">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TaskMaster comes packed with all the tools you need to manage your tasks efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <List className="h-12 w-12 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Simple Task Management</h3>
              <p className="text-gray-600">
                Create, organize, and track your tasks with ease. Intuitive interface makes task management a breeze.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Calendar className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Calendar Integration</h3>
              <p className="text-gray-600">
                Schedule tasks and set reminders. Never miss an important deadline again.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Tag className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Categories & Tags</h3>
              <p className="text-gray-600">
                Organize tasks with custom categories and tags for better organization and filtering.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Target className="h-12 w-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Priority Levels</h3>
              <p className="text-gray-600">
                Set task priorities to focus on what's most important and urgent.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <BellRing className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Reminders</h3>
              <p className="text-gray-600">
                Get notified about upcoming deadlines and important tasks.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Progress Tracking</h3>
              <p className="text-gray-600">
                Track your productivity and see completed tasks at a glance.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600">
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
              <Link to="/auth/signup">Get Started for Free</Link>
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
                <CheckSquare className="h-8 w-8 text-indigo-400" />
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
