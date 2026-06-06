import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "solarvista-settings";

const defaultSettings = {
  appearance: "system",
  animations: true,
  compactLayout: false,
  welcomeBanner: true,
  autoRefresh: false,
  autoRefreshIntervalMs: 300000,
};

const SettingsContext = createContext(null);

function readStoredSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch (error) {
    console.warn("SolarVista settings could not be restored.", error);
    return defaultSettings;
  }
}

function applyTheme(appearance) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldUseNight = appearance === "night";
  const shouldUseDark = appearance === "dark" || (appearance === "system" && systemDark);

  document.documentElement.classList.toggle("night", shouldUseNight);
  document.documentElement.classList.toggle("dark", shouldUseDark);
  document.body.classList.remove("light", "dark", "night");
  document.body.classList.add(shouldUseNight ? "night" : shouldUseDark ? "dark" : "light");
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readStoredSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    applyTheme(settings.appearance);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (settings.appearance === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", handleSystemThemeChange);
    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, [settings.appearance]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const setAppearance = (appearance) => updateSetting("appearance", appearance);

  const togglePreference = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const value = useMemo(
    () => ({
      settings,
      setAppearance,
      togglePreference,
      updateSetting,
    }),
    [settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}
