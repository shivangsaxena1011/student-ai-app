import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Layers, 
  Calendar, 
  UploadCloud, 
  LogOut, 
  Menu, 
  X,
  Settings
} from 'lucide-react';

const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/chat', icon: <MessageSquare size={20} />, label: 'AI Coach' },
    { to: '/flashcards', icon: <Layers size={20} />, label: 'Flashcards' },
    { to: '/study-plan', icon: <Calendar size={20} />, label: 'Study Plan' },
    { to: '/upload', icon: <UploadCloud size={20} />, label: 'Upload Notes' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <span>🎓</span>
            <span>StudentAI</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
            <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                <Settings size={20} />
                <span>Settings</span>
            </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-20">
        <span className="font-bold text-lg text-indigo-600">StudentAI</span>
        <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-10 pt-20 px-4 md:hidden">
            <nav className="space-y-2">
            {navItems.map((item) => (
                <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-4 rounded-xl transition-colors ${
                    isActive
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                }
                >
                {item.icon}
                <span>{item.label}</span>
                </NavLink>
            ))}
            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-4 w-full text-left text-red-600 hover:bg-red-50 rounded-xl mt-4"
            >
                <LogOut size={20} />
                <span>Sign Out</span>
            </button>
            </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-8 p-4 pt-20 md:pt-8">
        <div className="max-w-6xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;