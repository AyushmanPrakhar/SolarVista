import { useEffect, useState } from "react";
import EpcSection from "../components/landing/EpcSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import Footer from "../components/landing/Footer";
import HeroSection from "../components/landing/HeroSection";
import MapPreviewSection from "../components/landing/MapPreviewSection";
import Navbar from "../components/landing/Navbar";

export default function LandingPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    return () => document.documentElement.classList.remove("dark");
  }, [theme]);

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-950 antialiased selection:bg-emerald-300/40 transition-colors dark:bg-slate-950 dark:text-white"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}
    >
      <Navbar
        theme={theme}
        onThemeToggle={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
      />
      <main>
        <HeroSection />
        <FeaturesSection />
        <MapPreviewSection />
        <EpcSection />
      </main>
      <Footer />
    </div>
  );
}
