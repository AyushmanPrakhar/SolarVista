import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSettings } from '../context/SettingsContext';

const DashboardLayout = () => {
  const { settings } = useSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div
      className={`flex flex-col min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 ${
        settings.animations ? "" : "solarvista-no-animations"
      } ${settings.compactLayout ? "solarvista-compact" : ""}`}
    >
      {/* Reused Navbar with Hamburger toggle */}
      <Navbar onMenuClick={toggleSidebar} />

      <div className="flex flex-1 pt-20 overflow-hidden relative">
        {/* Persistent Sidebar with Mobile Responsive behavior */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto overflow-x-hidden ${settings.compactLayout ? "p-3 md:p-5" : "p-4 md:p-8"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
