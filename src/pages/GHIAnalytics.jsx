import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  Download,
  Gauge,
  Layers,
  Maximize2,
  RotateCcw,
  Sun,
  Target,
  Zap,
} from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ✅ CORRECTED PATHS FOR pages DIRECTORY
import ghiData, { monthlySolarTrend, potentialOrder } from "../data/indiaGhiData";
import GHIHeatmap from "../components/heatmap/GHIHeatmap";

const cardMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Math.round(value));
}

function potentialColor(potential) {
  return {
    Low: "#60a5fa",
    Moderate: "#22c55e",
    High: "#f97316",
    "Very High": "#ea580c",
  }[potential];
}

function KpiCard({ title, value, suffix = "", decimals = 0, icon: Icon, accent, helper }) {
  return (
    <motion.div
      variants={cardMotion}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-xl bg-gradient-to-br ${accent} p-3 text-white shadow-sm`}>
          <Icon size={20} />
        </div>
        <ArrowUpRight className="text-slate-300 transition group-hover:text-slate-500" size={18} />
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
        {typeof value === "number" ? (
          <CountUp end={value} decimals={decimals} duration={1.1} separator="," />
        ) : (
          value
        )}
        <span className="text-lg text-slate-500">{suffix}</span>
      </p>
      {helper && <p className="mt-2 text-xs leading-5 text-slate-500">{helper}</p>}
    </motion.div>
  );
}

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 ${className}`} />;
}

function ChartCard({ title, subtitle, children }) {
  return (
    <motion.section
      variants={cardMotion}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <div className="h-[320px]">{children}</div>
    </motion.section>
  );
}

function InsightPanel({ selected, topStates, lowStates, trendData }) {
  const readinessScore = Math.round((selected.readiness + selected.adoption) / 2);
  const expansionZones = topStates
    .filter((state) => state.state !== selected.state)
    .slice(0, 4);

  return (
    <motion.aside
      variants={cardMotion}
      className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Insight panel
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            National Solar Signal
          </h2>
        </div>
        <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
          {readinessScore}/100
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
        <p className="text-sm font-semibold text-slate-950">{selected.state}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {selected.ghi.toFixed(2)} kWh/m2/day with {selected.potential.toLowerCase()} solar
          potential and {formatNumber(selected.generation)} MW tracked generation.
        </p>
      </div>

      <div className="mt-5 grid gap-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Top Performing States</h3>
          <div className="mt-3 space-y-3">
            {topStates.slice(0, 5).map((item) => (
              <div key={item.state} className="flex items-center gap-3">
                <span className="w-28 truncate text-sm text-slate-600">{item.state}</span>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{ width: `${Math.min(100, (item.ghi / 6.5) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700">{item.ghi.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Lowest Performing States</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {lowStates.slice(0, 5).map((item) => (
              <span
                key={item.state}
                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {item.state} {item.ghi.toFixed(1)}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Recommended Solar Expansion Zones
          </h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {expansionZones.map((item) => (
              <div
                key={item.state}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-800">{item.state}</span>
                  <span className="text-xs font-semibold text-orange-600">{item.potential}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">GHI Trend</h3>
          <div className="mt-3 h-32">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={trendData}>
                <Line type="monotone" dataKey="ghi" stroke="#2563eb" strokeWidth={3} dot={false} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Renewable Readiness Score</h3>
            <span className="text-sm font-bold text-slate-950">{readinessScore}%</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default function GHIAnalytics() {
  const [selectedState, setSelectedState] = useState("Rajasthan");
  const [hoveredState, setHoveredState] = useState(null);
  const [potentialFilter, setPotentialFilter] = useState("All");
  const [enterpriseView, setEnterpriseView] = useState(false);
  const [mapApi, setMapApi] = useState(null);
  const sectionRef = useRef(null);

  const sortedData = useMemo(() => [...ghiData].sort((a, b) => b.ghi - a.ghi), []);
  const selected = useMemo(
    () => ghiData.find((item) => item.state === selectedState) || sortedData[0],
    [selectedState, sortedData]
  );

  // ✅ Filter data based on potential filter
  const filteredData = useMemo(() => {
    if (potentialFilter === "All") return sortedData;
    return sortedData.filter((item) => item.potential === potentialFilter);
  }, [potentialFilter, sortedData]);

  // ✅ Create filtered potentials array
  const filteredPotentials = useMemo(() => {
    if (potentialFilter === "All") return [];
    return [potentialFilter];
  }, [potentialFilter]);

  const averageGhi = useMemo(
    () => ghiData.reduce((sum, item) => sum + item.ghi, 0) / ghiData.length,
    []
  );
  const totalGeneration = useMemo(
    () => ghiData.reduce((sum, item) => sum + item.generation, 0),
    []
  );
  const topState = sortedData[0];
  const lowStates = useMemo(() => [...ghiData].sort((a, b) => a.ghi - b.ghi), []);
  const solarPotentialIndex = Math.round((averageGhi / 6.5) * 100);

  const distributionData = potentialOrder.map((potential) => ({
    potential,
    count: ghiData.filter((item) => item.potential === potential).length,
    avgGhi:
      ghiData
        .filter((item) => item.potential === potential)
        .reduce((sum, item) => sum + item.ghi, 0) /
      (ghiData.filter((item) => item.potential === potential).length || 1),
  }));

  const radarData = [
    { subject: "GHI", value: Math.round((selected.ghi / 6.5) * 100) },
    { subject: "Grid", value: selected.readiness },
    { subject: "Adoption", value: selected.adoption },
    { subject: "Scale", value: Math.min(100, Math.round((selected.generation / topState.generation) * 100)) },
    { subject: "Policy", value: selected.potential === "Very High" ? 92 : selected.potential === "High" ? 84 : selected.potential === "Moderate" ? 68 : 48 },
  ];

  function resetView() {
    setSelectedState("Rajasthan");
    setPotentialFilter("All");
    mapApi?.reset?.();
  }

  function exportPng() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#f5f7fb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 38px Arial";
    ctx.fillText("India Solar Intelligence Heatmap", 64, 86);
    ctx.font = "18px Arial";
    ctx.fillStyle = "#475569";
    ctx.fillText("State-level GHI analytics export", 64, 120);

    const rows = sortedData.slice(0, 10);
    rows.forEach((item, index) => {
      const y = 185 + index * 44;
      ctx.fillStyle = potentialColor(item.potential);
      ctx.fillRect(64, y - 22, item.ghi * 120, 24);
      ctx.fillStyle = "#0f172a";
      ctx.font = "600 18px Arial";
      ctx.fillText(item.state, 64, y + 24);
      ctx.fillStyle = "#475569";
      ctx.font = "16px Arial";
      ctx.fillText(`${item.ghi.toFixed(2)} kWh/m2/day`, 360, y + 24);
    });

    ctx.fillStyle = "#0f172a";
    ctx.font = "700 24px Arial";
    ctx.fillText(`Selected: ${selected.state}`, 760, 190);
    ctx.font = "18px Arial";
    ctx.fillStyle = "#475569";
    ctx.fillText(`GHI: ${selected.ghi.toFixed(2)} kWh/m2/day`, 760, 230);
    ctx.fillText(`Generation: ${formatNumber(selected.generation)} MW`, 760, 266);
    ctx.fillText(`Potential: ${selected.potential}`, 760, 302);
    ctx.fillText(`Readiness: ${Math.round((selected.readiness + selected.adoption) / 2)} / 100`, 760, 338);

    const link = document.createElement("a");
    link.download = "india-solar-ghi-heatmap.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function toggleFullscreen() {
    if (!sectionRef.current) return;
    if (!document.fullscreenElement) {
      sectionRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  return (
    <motion.div
      ref={sectionRef}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.07 }}
      className="mx-auto max-w-[1560px] space-y-6 bg-[#f5f7fb] p-0 text-slate-950"
    >
      <motion.header
        variants={cardMotion}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-orange-600">
              <Sun size={18} />
              Solar irradiance analytics
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 lg:text-4xl">
              India Solar Intelligence Heatmap
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 lg:text-base">
              State-level Global Horizontal Irradiance analytics and renewable energy insights.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportPng}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
            >
              <Download size={17} />
              Export
            </button>
            <button
              onClick={() => setEnterpriseView((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${
                enterpriseView
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
              }`}
            >
              <Building2 size={17} />
              Enterprise View
            </button>
            <button
              onClick={resetView}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <RotateCcw size={17} />
              Reset
            </button>
          </div>
        </div>
      </motion.header>

      <motion.section
        variants={cardMotion}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"
      >
        <KpiCard title="Average GHI" value={averageGhi} suffix=" kWh/m2" decimals={2} icon={Gauge} accent="from-blue-500 to-blue-700" helper="National daily mean" />
        <KpiCard title="Top State" value={topState.state} icon={Sun} accent="from-orange-400 to-orange-600" helper={`${topState.ghi.toFixed(2)} kWh/m2/day`} />
        <KpiCard title="Solar Potential Index" value={solarPotentialIndex} suffix="%" icon={Target} accent="from-emerald-500 to-emerald-700" helper="Weighted GHI signal" />
        <KpiCard title="Total Generation" value={totalGeneration} suffix=" MW" icon={Zap} accent="from-amber-400 to-orange-600" helper="Tracked installed base" />
        <KpiCard title="States Covered" value={ghiData.length} icon={Layers} accent="from-sky-500 to-cyan-600" helper="States and union territories" />
        <KpiCard title="Selected State" value={selected.state} icon={Activity} accent="from-slate-700 to-slate-950" helper={`${selected.potential} potential`} />
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
        <motion.div
          variants={cardMotion}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Advanced India GHI Heatmap</h2>
              <p className="mt-1 text-sm text-slate-500">
                GeoJSON state boundaries colored by solar irradiance intensity.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={potentialFilter}
                onChange={(event) => setPotentialFilter(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option>All</option>
                {potentialOrder.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button
                onClick={() => mapApi?.reset?.()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-blue-200"
              >
                <RotateCcw size={16} />
                Reset View
              </button>
              <button
                onClick={exportPng}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-blue-200"
              >
                <Download size={16} />
                Export PNG
              </button>
              <button
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-blue-200"
              >
                <Maximize2 size={16} />
                Fullscreen
              </button>
            </div>
          </div>

          {hoveredState && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"
            >
              Hover signal: <span className="font-semibold">{hoveredState.state}</span>
              {hoveredState.ghi ? `, ${hoveredState.ghi.toFixed(2)} kWh/m2/day` : ""}
            </motion.div>
          )}

          {/* ✅ KEY FIX: PASS ALL REQUIRED PROPS TO GHIHeatmap */}
          <div className="overflow-hidden rounded-2xl">
            <GHIHeatmap
              data={ghiData}
              selectedState={selectedState}
              onSelectState={setSelectedState}
              onHoverState={setHoveredState}
              filteredPotentials={filteredPotentials}
              setMapApi={setMapApi}
            />
          </div>
        </motion.div>

        <InsightPanel
          selected={selected}
          topStates={sortedData}
          lowStates={lowStates}
          trendData={monthlySolarTrend}
        />
      </section>

      <motion.section
        variants={cardMotion}
        className="grid gap-6 xl:grid-cols-2"
      >
        <ChartCard title="Top States Bar Chart" subtitle="Highest GHI states in the active potential filter.">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={filteredData.slice(0, 10)} margin={{ top: 8, right: 12, left: 0, bottom: 20 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="state" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={64} />
              <YAxis tick={{ fontSize: 12 }} domain={[4, 7]} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
              <Bar dataKey="ghi" radius={[8, 8, 0, 0]}>
                {filteredData.slice(0, 10).map((entry) => (
                  <Cell key={entry.state} fill={potentialColor(entry.potential)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="GHI Distribution Area Chart" subtitle="Potential bucket count and average irradiance profile.">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <ComposedChart data={distributionData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="ghiDistribution" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="potential" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
              <Area type="monotone" dataKey="avgGhi" stroke="#16a34a" fill="url(#ghiDistribution)" strokeWidth={3} />
              <Bar dataKey="count" fill="#93c5fd" radius={[6, 6, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Solar Potential Trend" subtitle="National monthly irradiance and potential index.">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={monthlySolarTrend} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} domain={[4, 7]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
              <Line yAxisId="left" type="monotone" dataKey="ghi" stroke="#f97316" strokeWidth={3} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="potential" stroke="#2563eb" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Renewable Adoption Radar Chart" subtitle={`Readiness profile for ${selected.state}.`}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#475569" }} />
              <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.22} strokeWidth={3} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.section>

      {enterpriseView && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <BarChart3 className="mt-1 text-blue-600" size={22} />
            <div>
              <h3 className="text-base font-semibold text-slate-950">Enterprise View Active</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Portfolio prioritization is weighted toward high-GHI regions with stronger
                readiness and adoption scores. Current priority: {topState.state}, Gujarat,
                Tamil Nadu, Karnataka, and Ladakh.
              </p>
            </div>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}