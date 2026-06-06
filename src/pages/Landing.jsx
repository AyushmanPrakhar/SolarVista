import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-yellow-200">
      <Navbar />
      <main>
        <Hero />
      </main>
      
      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 SolarVista Intelligence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
