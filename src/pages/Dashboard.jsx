import { useEffect, useMemo, useState } from "react";
import { Activity, Database, Factory, MapPinned, Trophy, CloudSun, User, Calendar, Mail, Zap, TrendingUp, ShieldCheck, Building2, Thermometer, ArrowUpRight, Sun } from "lucide-react";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import indiaFullData from "../data/indiaFullData";
import solarGeneration from "../data/solar_generation.json";
import { solarParksData } from "../data/solarParksData";
import WeatherMetrics from "../components/dashboard/WeatherMetrics";
import WeatherWidget from "../components/WeatherWidget";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

function useCountUp(value, duration = 800, enabled = true, refreshKey = 0) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setDisplayValue(value);
      return undefined;
    }

    let frameId;
    const startedAt = performance.now();

    function tick(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [value, duration, enabled, refreshKey]);

  return displayValue;
}

function KpiCard({ icon, label, value, detail, accent, compact }) {
  return (
    <div className={`rounded-xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <div className={`rounded-lg p-3 ${accent}`}>{icon}</div>
      </div>
    </div>
  );
}

function InsightCard({ title, value, description, icon, badge }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-50 rounded-xl dark:bg-slate-800">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{badge}</span>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-tight mb-1">{title}</h4>
        <p className="text-2xl font-black text-[#0B132B] dark:text-white mb-3">{value}</p>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

const ProfileCard = ({ user }) => {
  const date = new Date(user.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="rounded-xl bg-white p-6 text-slate-900 shadow-sm border border-slate-200 relative overflow-hidden dark:bg-slate-900 dark:border-slate-800 dark:text-white">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#F97316]/5 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#F97316] p-3 rounded-full shadow-lg shadow-orange-500/20">
            <User size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">{user.fullname}</h3>
            <p className="text-[#F59E0B] text-xs font-semibold uppercase tracking-wider">Premium Member</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <Mail size={16} className="text-slate-400" />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <Calendar size={16} className="text-slate-400" />
            <span className="text-sm">Joined {date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!settings.autoRefresh) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setRefreshKey((current) => current + 1);
      window.dispatchEvent(new CustomEvent("solarvista:data-refresh"));
    }, settings.autoRefreshIntervalMs);

    return () => window.clearInterval(interval);
  }, [settings.autoRefresh, settings.autoRefreshIntervalMs]);
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const stats = useMemo(() => {
    const stateTotals = solarGeneration.reduce((totals, record) => {
      totals[record.state] = (totals[record.state] || 0) + record.generation_mu;
      return totals;
    }, {});

    const [topState, topGeneration] = Object.entries(stateTotals).sort(
      ([, a], [, b]) => b - a
    )[0];

    const totalGeneration = solarGeneration.reduce(
      (sum, record) => sum + record.generation_mu,
      0
    );

    const bestGhiLocation = indiaFullData.reduce((best, item) =>
      item[4] > best[4] ? item : best
    );

    return {
      totalGeneration,
      statesCovered: Object.keys(stateTotals).length,
      topState,
      topGeneration,
      records: solarGeneration.length,
      bestCity: bestGhiLocation[1],
      bestGhi: bestGhiLocation[4],
      monitoredLocations: indiaFullData.length,
    };
  }, [refreshKey]);

  const animatedGeneration = useCountUp(stats.totalGeneration, 800, settings.animations, refreshKey);
  const animatedStates = useCountUp(stats.statesCovered, 800, settings.animations, refreshKey);
  const animatedRecords = useCountUp(stats.records, 800, settings.animations, refreshKey);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      <WeatherWidget />

      {settings.welcomeBanner && (
      <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between px-1">
        <motion.div 
          initial={settings.animations ? { opacity: 0, x: -20 } : false}
          animate={settings.animations ? { opacity: 1, x: 0 } : false}
          className="flex-1"
        >
          <p className="text-xs md:text-sm font-semibold uppercase tracking-wide text-[#F97316]">
            Welcome Back, {user?.fullname.split(' ')[0]} 👋
          </p>
            <h2 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            {greeting}, {user?.fullname.split(' ')[0]}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Real-time solar generation analytics coupled with live weather intelligence for optimized renewable energy monitoring.
          </p>
        </motion.div>
        
        {user && (
          <motion.div 
            initial={settings.animations ? { opacity: 0, scale: 0.95 } : false}
            animate={settings.animations ? { opacity: 1, scale: 1 } : false}
            className="w-full lg:w-80"
          >
            <ProfileCard user={user} />
          </motion.div>
        )}
      </header>
      )}

      {/* Weather Intelligence Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <CloudSun className="text-[#F97316]" size={20} />
          <h3 className="text-lg font-bold">Real-time Weather Signals</h3>
        </div>
        <WeatherMetrics />
      </section>

      {/* Solar Generation Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Activity className="text-amber-600" size={20} />
          <h3 className="text-lg font-bold">Solar Generation Overview</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <KpiCard
            icon={<Factory size={22} className="text-amber-700" />}
            label="Total Generation"
            value={`${animatedGeneration.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })} MU`}
            detail="Across available monthly records"
            accent="bg-amber-100"
            compact={settings.compactLayout}
          />
          <KpiCard
            icon={<MapPinned size={22} className="text-sky-700" />}
            label="States Covered"
            value={Math.round(animatedStates)}
            detail={`${stats.monitoredLocations} GHI monitoring points`}
            accent="bg-sky-100"
            compact={settings.compactLayout}
          />
          <KpiCard
            icon={<Trophy size={22} className="text-emerald-700" />}
            label="Top State"
            value={stats.topState}
            detail={`${stats.topGeneration.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })} MU recorded`}
            accent="bg-emerald-100"
            compact={settings.compactLayout}
          />
        </div>
      </section>

      {/* New Section: Executive Insights */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
          <Zap className="text-blue-500" size={20} />
          <h3 className="text-lg font-bold">Executive Insights</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InsightCard 
            title="Highest Solar Potential"
            value={stats.bestCity}
            description={`With a GHI of ${stats.bestGhi.toFixed(2)} kWh/m², this region represents the peak of India's solar irradiance potential.`}
            icon={<Sun className="text-amber-500" />}
            badge="Solar Intelligence"
          />
          <InsightCard 
            title="Generation Leader"
            value={stats.topState}
            description={`${stats.topState} continues to lead the national portfolio with over ${stats.topGeneration.toLocaleString()} MU of recorded generation.`}
            icon={<TrendingUp className="text-emerald-500" />}
            badge="Generation Data"
          />
          <InsightCard 
            title="Aerosol Risk Profile"
            value="Moderate"
            description="National average aerosol attenuation is stable. High-risk zones in the North require increased O&M cleaning cadence."
            icon={<ShieldCheck className="text-rose-500" />}
            badge="Aerosol Impact"
          />
          <InsightCard 
            title="Geographic Coverage"
            value={`${stats.statesCovered} States`}
            description="Data monitoring is currently active across all primary solar-producing states in the Indian subcontinent."
            icon={<MapPinned className="text-blue-500" />}
            badge="Solar Map"
          />
          <InsightCard 
            title="Climate Observation"
            value="Peak Summer"
            description="Operational temperatures are trending 2.4°C above annual means, slightly impacting panel efficiency in desert regions."
            icon={<Thermometer className="text-orange-500" />}
            badge="Weather Data"
          />
          <InsightCard 
            title="Infrastructure Scale"
            value={`${solarParksData.length} Mega Parks`}
            description="Tracking world-class utility-scale solar parks that form the backbone of India's renewable energy infrastructure."
            icon={<Building2 className="text-amber-500" />}
            badge="Solar Parks"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-3">
              <Activity size={22} className="text-amber-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Summary Focus
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Key signals without drilling into the analytics pages.
              </p>
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {stats.topState} leads generation in the current dataset, while{" "}
            {stats.bestCity} shows the strongest GHI reading at{" "}
            {stats.bestGhi.toFixed(1)} kWh/m2. Use the dedicated analytics and
            heatmap pages for deeper chart and geographic analysis.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 text-slate-900 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 dark:text-white">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#F59E0B]">
            Coverage Snapshot
          </p>
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">Generation states</span>
              <span className="text-lg font-bold">{stats.statesCovered}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">GHI locations</span>
              <span className="text-lg font-bold">{stats.monitoredLocations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">Best GHI city</span>
              <span className="text-lg font-bold text-[#F59E0B]">{stats.bestCity}</span>
            </div>
          </div>
        </div>
      </section>

      {/* New Overview Section: Solar Parks of India */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Building2 className="text-amber-500" size={20} />
            <h3 className="text-lg font-bold">Solar Parks of India</h3>
          </div>
          <Link 
            to="/solar-parks" 
            className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 group"
          >
            View Infrastructure Hub
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Rank</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Solar Park</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">State</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Capacity</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {solarParksData.slice(0, 5).map((park) => (
                  <tr key={park.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-400">#{park.rank}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">{park.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">{park.state}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-slate-900 dark:text-white">{park.capacity_mw} MW</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-100 dark:ring-emerald-500/20">
                        {park.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center">
             <p className="text-xs text-slate-500 font-medium italic">
               Displaying top 5 operational mega-parks. Access the Solar Parks hub for deep technical profiles.
             </p>
          </div>
        </div>
      </section>
    </div>
  );
}
