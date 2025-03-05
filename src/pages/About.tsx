
import { Navbar } from '@/components/Navbar';
import { Users, Award, Heart, CheckSquare, Briefcase, Github, Linkedin, Twitter } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Our Mission & Story
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're building TaskMaster to help people manage their tasks efficiently and achieve more in their personal and professional lives.
            </p>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="w-full h-[400px] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  <CheckSquare className="h-32 w-32 text-indigo-500 opacity-50" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl opacity-70"></div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">The Story Behind TaskMaster</h2>
              <p className="text-lg text-gray-600 mb-4">
                TaskMaster was born from a simple observation: people spend too much time managing their tasks instead of completing them. We set out to create a solution that would simplify task management and boost productivity.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 2023 by a team of productivity enthusiasts, TaskMaster has quickly grown from a simple task list app to a comprehensive productivity platform used by thousands of individuals and teams worldwide.
              </p>
              <p className="text-lg text-gray-600">
                Our mission is to help people focus on what truly matters by providing tools that make task management intuitive, efficient, and even enjoyable.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Core Values</h2>
            <p className="text-lg text-gray-600">
              These principles guide everything we do at TaskMaster, from product development to customer support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">User-Centered Design</h3>
              <p className="text-gray-600">
                We believe that great products start with understanding user needs. We continuously gather feedback and iterate to make TaskMaster better for you.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Excellence in Simplicity</h3>
              <p className="text-gray-600">
                We strive for the perfect balance between powerful features and intuitive design. Complexity should be hidden, not eliminated.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Passionate About Productivity</h3>
              <p className="text-gray-600">
                We're deeply committed to helping people achieve more. Your success is our success, and we're constantly working to help you reach your goals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              We're a diverse group of passionate individuals dedicated to making productivity tools that people love.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Alex Morgan</h3>
              <p className="text-purple-600 mb-4">Founder & CEO</p>
              <p className="text-gray-600 mb-6">
                Productivity enthusiast with a background in UX design and software development.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Jamie Chen</h3>
              <p className="text-purple-600 mb-4">Lead Developer</p>
              <p className="text-gray-600 mb-6">
                Full-stack developer with expertise in building scalable web applications and user-friendly interfaces.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-gray-900">Taylor Wilson</h3>
              <p className="text-purple-600 mb-4">UX/UI Designer</p>
              <p className="text-gray-600 mb-6">
                Creative designer passionate about creating intuitive user experiences that make complex tasks simple.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <a href="mailto:contact@taskmaster.com" className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 hover:bg-gray-100 font-medium rounded-lg transition-all">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
