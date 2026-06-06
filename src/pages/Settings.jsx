import {
  Bell,
  Info,
  LayoutGrid,
  Mail,
  Monitor,
  Moon,
  RefreshCw,
  Settings as SettingsIcon,
  Sun,
  Sunrise,
  ToggleLeft,
  User,
  Zap,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const appearanceOptions = [
  { value: "light", label: "Light Mode", icon: Sun },
  { value: "dark", label: "Dark Mode", icon: Moon },
  { value: "system", label: "System Default", icon: Monitor },
];

const preferenceOptions = [
  { key: "animations", label: "Enable Animations", icon: Zap },
  { key: "compactLayout", label: "Compact Layout", icon: LayoutGrid },
  { key: "welcomeBanner", label: "Show Welcome Banner", icon: Bell },
  { key: "autoRefresh", label: "Auto Refresh Data", icon: RefreshCw },
];

function SettingsSection({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-300">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
        checked ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { settings, setAppearance, togglePreference } = useSettings();

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12 text-slate-900 dark:text-slate-100">
      <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
              <SettingsIcon size={14} />
              Platform settings
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Settings
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Adjust SolarVista appearance and dashboard preferences while keeping the platform focused on renewable energy and climate intelligence.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-amber-300 dark:bg-white dark:text-slate-950 shadow-lg">
            <ToggleLeft size={24} />
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <SettingsSection eyebrow="Appearance" title="Theme Preference">
            <div className="grid gap-3 sm:grid-cols-3">
              {appearanceOptions.map((option) => {
                const Icon = option.icon;
                const active = settings.appearance === option.value;

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border p-6 text-center transition-all hover:shadow-md ${
                      active
                        ? "border-amber-400 bg-amber-50/50 text-slate-950 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-white"
                        : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="appearance"
                      value={option.value}
                      checked={active}
                      onChange={() => setAppearance(option.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl ${active ? "bg-white text-amber-600" : "bg-slate-50 text-slate-400 dark:bg-slate-900"}`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-sm font-black tracking-tight">{option.label}</span>
                  </label>
                );
              })}
            </div>
          </SettingsSection>

          <SettingsSection eyebrow="Dashboard Preferences" title="Workspace Controls">
            <div className="grid gap-3 sm:grid-cols-2">
              {preferenceOptions.map((option) => {
                const Icon = option.icon;
                const checked = settings[option.key];

                return (
                  <div
                    key={option.key}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/70"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-amber-300 dark:ring-slate-700">
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-black tracking-tight text-slate-700 dark:text-slate-200">
                        {option.label}
                      </span>
                    </div>
                    <ToggleSwitch
                      checked={checked}
                      onChange={() => togglePreference(option.key)}
                      label={option.label}
                    />
                  </div>
                );
              })}
            </div>
          </SettingsSection>
        </div>

        <div className="space-y-6">
          <SettingsSection eyebrow="Platform Information" title="SolarVista Details">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700 shadow-sm">
                <span className="flex items-center gap-3 text-sm font-black tracking-tight text-slate-700 dark:text-slate-200">
                  <Info size={18} className="text-amber-600 dark:text-amber-300" />
                  SolarVista Version
                </span>
                <span className="text-sm font-black text-slate-950 dark:text-white">v0.1.0</span>
              </div>
              <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 dark:bg-slate-800/70 dark:ring-slate-700 shadow-sm">
                <span className="flex items-center gap-3 text-sm font-black tracking-tight text-slate-700 dark:text-slate-200">
                  <User size={18} className="text-amber-600 dark:text-amber-300" />
                  Developer Information
                </span>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  Ayushman Prakhar, B.Tech Electrical & Electronics Engineering
                </p>
              </div>
              <a
                href="mailto:ayushmanprakhar@gmail.com"
                className="flex items-center justify-between gap-3 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-amber-400 hover:text-slate-950 dark:bg-white dark:text-slate-950 dark:hover:bg-amber-300 shadow-lg"
              >
                <span className="flex items-center gap-3 tracking-tight">
                  <Mail size={18} />
                  Support Contact
                </span>
                <span className="hidden text-xs font-black sm:inline">
                  ayushmanprakhar@gmail.com
                </span>
              </a>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
