import React from 'react';
import { Link } from 'react-router-dom';
import { Sun } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-yellow-400 p-1.5 rounded-lg">
              <Sun className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Solar<span className="text-orange-600">Vista</span>
            </span>
          </Link>

          {/* Right Section - Space for future authenticated actions */}
          <div className="flex items-center">
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
