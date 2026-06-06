import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Moon, Sun, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Platform", href: "#features" },
  { label: "Network", href: "#map" },
  { label: "EPC", href: "#epc" },
  { label: "Preview", href: "#dashboard-preview" },
];

export default function Navbar({ theme, onThemeToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="pointer-events-auto mx-auto max-w-6xl">
        <div className="rounded-full border border-white/70 bg-white/72 px-4 py-3 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/62 dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-4">
            <a href="#top" className="flex min-w-fit items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-amber-300 dark:bg-white dark:text-emerald-700">
                <span className="absolute inset-0 rounded-full bg-emerald-400/25 blur-md" />
                <Zap size={18} className="relative" />
              </span>
              <span className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
                SolarVista
              </span>
            </a>

            <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/55 p-1 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 transition hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={onThemeToggle}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <Link
                to="/"
                className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-100"
              >
                Dashboard
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 lg:hidden dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-100"
              aria-label="Open navigation"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="mt-3 rounded-3xl border border-white/70 bg-white/88 p-3 shadow-2xl backdrop-blur-2xl lg:hidden dark:border-white/10 dark:bg-slate-950/88">
            <nav className="grid gap-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onThemeToggle}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200"
              >
                {isDark ? "Light" : "Dark"}
              </button>
              <Link to="/" className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
