
import { Navbar } from '@/components/Navbar';
import { List, Calendar, Tag, Target, BellRing, CheckCircle, Users, FilePieChart, Clock, Gift } from 'lucide-react';

export function Features() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Feature-Rich Task Management
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover all the powerful tools and features that make TaskMaster the perfect solution for your productivity needs.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <List className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Intuitive Task Management</h3>
              <p className="text-gray-600">
                Create, organize, and track your tasks with an easy-to-use interface. Add details, set priorities, and manage your workflow effortlessly.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Calendar Integration</h3>
              <p className="text-gray-600">
                View your tasks on a calendar to get a clear overview of your schedule. Plan ahead and manage your time effectively.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Tag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Categories & Tags</h3>
              <p className="text-gray-600">
                Organize tasks with custom categories and tags. Filter and sort to find exactly what you need when you need it.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Priority Levels</h3>
              <p className="text-gray-600">
                Set task priorities to focus on what matters most. Easily identify high-priority items that need immediate attention.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <BellRing className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Reminders</h3>
              <p className="text-gray-600">
                Never miss a deadline with customizable reminders. Get notifications about upcoming and overdue tasks.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Progress Tracking</h3>
              <p className="text-gray-600">
                Track your productivity with visual progress indicators. See how much you've accomplished and stay motivated.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Collaboration Tools</h3>
              <p className="text-gray-600">
                Share tasks and projects with team members. Assign responsibilities and track progress together.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <FilePieChart className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Visualize your productivity patterns with easy-to-understand charts and graphs. Identify trends and optimize your workflow.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Time Tracking</h3>
              <p className="text-gray-600">
                Keep track of how much time you spend on each task. Improve time management and increase efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have revolutionized how they manage tasks and achieve their goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/auth/signup" className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 hover:bg-gray-100 font-medium rounded-lg transition-all">
              Get Started — It's Free
              <Gift className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
