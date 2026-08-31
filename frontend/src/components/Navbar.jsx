import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic2, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Mic2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                VoiceTask
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
