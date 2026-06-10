import {
  Activity,
  Database,
  Info,
  LayoutDashboard,
  MessageSquareText,
  Settings,
  Sun,
  LogOut,
  Map as MapIcon,
  Building2,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const links = [
    {
      to: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/solar-resource-intelligence",
      label: "Solar Intelligence",
      icon: Sun,
    },
    {
      to: "/generation-dashboard",
      label: "Generation Data",
      icon: Database,
    },
    {
      to: "/aerosol-impact",
      label: "Aerosol Impact",
      icon: Activity,
    },
    {
      to: "/solar-map",
      label: "Solar Map",
      icon: MapIcon,
    },
    {
      to: "/solar-parks",
      label: "Solar Parks",
      icon: Building2,
    },
    {
      to: "/about",
      label: "About Us",
      icon: Info,
    },
    {
      to: "/feedback",
      label: "Feedback",
      icon: MessageSquareText,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-[#0B132B] px-4 py-5 text-white shadow-2xl transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:shrink-0 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20">
              <Sun size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">SolarVista</h1>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Intelligence</p>
            </div>
          </div>

          {/* Close button - Mobile only */}
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 md:hidden transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 night:border-[#3A3127] night:bg-[#2A241D] night:text-[#F5E6C8]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-300">
                <LogOut size={22} />
              </div>
              <div>
                <h2 id="logout-title" className="text-xl font-bold tracking-tight text-slate-950 dark:text-white night:text-[#F5E6C8]">
                  Logout
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 night:text-[#C8B89A]">
                  Are you sure you want to log out of SolarVista?
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 night:border-[#3A3127] night:bg-[#1E1A14] night:text-[#F5E6C8] night:hover:bg-[#2A241D]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
