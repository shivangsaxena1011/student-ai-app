import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Zap, Calendar, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <span>🎓</span>
          <span>StudentAI</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
          <Link to="/signup" className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8">
          Your personal <span className="text-indigo-600">AI Tutor</span> <br /> & Study Coach.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Upload your notes, generate flashcards instantly, and organize your academic life with our all-in-one AI assistant.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1">
            Get Started Free
          </Link>
          <Link to="/login" className="px-8 py-4 bg-gray-50 text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all border border-gray-200">
            Try Demo
          </Link>
        </div>
        
        {/* Placeholder UI Shot */}
        <div className="mt-20 mx-auto max-w-4xl bg-gray-900 rounded-2xl p-2 shadow-2xl">
            <div className="bg-gray-800 rounded-xl overflow-hidden aspect-video relative">
                 <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <span className="text-lg">Dashboard Preview Image Placeholder</span>
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"/>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                    <div className="w-3 h-3 rounded-full bg-green-500"/>
                 </div>
            </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
            <Feature 
                icon={<Bot className="text-white" />} 
                title="AI Chat Coach" 
                desc="Ask questions about your uploaded PDFs and get instant, accurate explanations."
                color="bg-indigo-500"
            />
            <Feature 
                icon={<Zap className="text-white" />} 
                title="Smart Flashcards" 
                desc="Turn lecture notes into spaced-repetition flashcards in seconds."
                color="bg-orange-500"
            />
            <Feature 
                icon={<Calendar className="text-white" />} 
                title="Auto-Scheduler" 
                desc="Drag, drop, and let AI organize your study sessions for maximum retention."
                color="bg-green-500"
            />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc, color }: any) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;