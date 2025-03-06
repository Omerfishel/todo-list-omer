
import { Navbar } from '@/components/Navbar';

export function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">About Us</h1>
        <p className="text-xl text-gray-600 text-center mb-8">
          This page is under construction. Check back soon to learn more about our team and mission!
        </p>
      </div>
    </div>
  );
}
