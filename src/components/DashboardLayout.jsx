import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSettings } from '../context/SettingsContext';

const DashboardLayout = () => {
  const { settings } = useSettings();

  return (
    <div
      className={`flex flex-col min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 ${
        settings.animations ? "" : "solarvista-no-animations"
      } ${settings.compactLayout ? "solarvista-compact" : ""}`}
    >
      {/* Reused Navbar from Landing Page */}
      <Navbar />

      <div className="flex flex-1 pt-20 overflow-hidden">
        {/* Persistent Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className={`flex-1 overflow-y-auto overflow-x-hidden ${settings.compactLayout ? "p-3 md:p-5" : "p-4 md:p-8"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
