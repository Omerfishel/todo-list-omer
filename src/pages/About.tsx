
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Users, Globe, Award, Sparkles, Heart, Target } from 'lucide-react';

// Create a reusable Team Member component
const TeamMember = ({ 
  name, 
  role, 
  description,
  delay = 0
}: { 
  name: string; 
  role: string; 
  description: string;
  delay?: number;
}) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 opacity-0 translate-y-10 scroll-hidden`} 
       style={{ transitionDelay: `${delay}ms` }}>
    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold mb-4">
      {name.charAt(0)}
    </div>
    <h3 className="text-xl font-semibold mb-1 leading-relaxed">{name}</h3>
    <p className="text-indigo-600 mb-3">{role}</p>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Create a ValueCard component
const ValueCard = ({ 
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
  <div className={`flex flex-col items-center text-center opacity-0 translate-y-10 scroll-hidden`}
       style={{ transitionDelay: `${delay}ms` }}>
    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
      <Icon className="h-8 w-8 text-indigo-600" />
    </div>
    <h3 className="text-xl font-semibold mb-2 leading-relaxed">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export function About() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient leading-tight">
              About TaskMaster
            </h1>
            <p className="text-xl text-gray-600 mb-8 opacity-0 translate-y-10 scroll-hidden leading-relaxed" style={{ transitionDelay: '100ms' }}>
              We're on a mission to help people and teams achieve more by staying organized and focused on what matters most.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto opacity-0 translate-y-10 scroll-hidden" style={{ transitionDelay: '200ms' }}></div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 aspect-video flex items-center justify-center text-white text-2xl opacity-0 translate-y-10 scroll-hidden">
                Our Story Visual
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-gradient leading-tight opacity-0 translate-y-10 scroll-hidden">
                Our Story
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 opacity-0 translate-y-10 scroll-hidden leading-relaxed" style={{ transitionDelay: '100ms' }}>
                  TaskMaster was founded in 2022 with a simple goal: to create a task management solution that's both powerful and intuitive. We noticed that existing tools were either too complex or too simplistic, leaving many users frustrated.
                </p>
                <p className="text-gray-600 opacity-0 translate-y-10 scroll-hidden leading-relaxed" style={{ transitionDelay: '200ms' }}>
                  Our team of designers and developers, who were themselves struggling with productivity, set out to build the perfect solution. After months of research, development, and testing, TaskMaster was born.
                </p>
                <p className="text-gray-600 opacity-0 translate-y-10 scroll-hidden leading-relaxed" style={{ transitionDelay: '300ms' }}>
                  Today, thousands of individuals and teams rely on TaskMaster to stay organized, meet deadlines, and achieve their goals. We continue to improve the platform based on user feedback and emerging productivity research.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gradient leading-tight opacity-0 translate-y-10 scroll-hidden">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 opacity-0 translate-y-10 scroll-hidden leading-relaxed" style={{ transitionDelay: '100ms' }}>
              These core principles guide everything we do at TaskMaster
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ValueCard 
              icon={Sparkles} 
              title="Simplicity" 
              description="We believe that the best tools get out of your way and let you focus on what matters."
              delay={200}
            />
            <ValueCard 
              icon={Heart} 
              title="User-Centered" 
              description="Every feature we build starts with understanding our users' needs and challenges."
              delay={300}
            />
            <ValueCard 
              icon={Target} 
              title="Effectiveness" 
              description="We measure our success by how much we help our users achieve their goals."
              delay={400}
            />
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gradient leading-tight opacity-0 translate-y-10 scroll-hidden">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 opacity-0 translate-y-10 scroll-hidden leading-relaxed" style={{ transitionDelay: '100ms' }}>
              The talented people behind TaskMaster
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember 
              name="Alex Johnson" 
              role="Founder & CEO" 
              description="Alex has over 15 years of experience in productivity software and is passionate about helping people work better."
              delay={200}
            />
            <TeamMember 
              name="Sophia Chen" 
              role="Head of Design" 
              description="Sophia leads our design team, ensuring TaskMaster is not just functional but delightful to use."
              delay={300}
            />
            <TeamMember 
              name="Marcus Williams" 
              role="Lead Developer" 
              description="Marcus oversees the technical architecture of TaskMaster, making sure it's fast, reliable, and secure."
              delay={400}
            />
            <TeamMember 
              name="Emma Rodriguez" 
              role="Product Manager" 
              description="Emma translates user feedback into product features, prioritizing what will make the biggest impact."
              delay={500}
            />
            <TeamMember 
              name="David Kim" 
              role="Customer Success" 
              description="David helps our users get the most out of TaskMaster through training and support."
              delay={600}
            />
            <TeamMember 
              name="Priya Patel" 
              role="Marketing Director" 
              description="Priya shares TaskMaster's story with the world and helps new users discover how it can transform their productivity."
              delay={700}
            />
          </div>
        </div>
      </section>
      
      {/* Join Us CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 translate-y-10 scroll-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white leading-relaxed pb-1">
            Join Our Mission
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            We're always looking for talented individuals who are passionate about productivity and building great products.
          </p>
          <a href="#" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 transform transition-transform hover:scale-105">
            View Open Positions
          </a>
        </div>
      </section>
    </div>
  );
}
