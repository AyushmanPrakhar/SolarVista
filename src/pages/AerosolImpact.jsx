import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Banknote,
  BatteryCharging,
  CloudSun,
  Factory,
  Filter,
  Gauge,
  Leaf,
  MapPinned,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import rows from "../data/indiaImpactData";
import indiaGeo from "../data/india-light.json";
import LeafletIndiaChoropleth from "../components/common/LeafletIndiaChoropleth";

const INR_PER_MWH = 4200;
const REFERENCE_CAPACITY_MW = 1000;
const GWH_FACTOR = 365 * 0.2 / 1000;
const CARD = "rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-md";

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
  color: "#0f172a",
  fontSize: 13,
};

function normalizeName(name = "") {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function mean(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function formatInr(value) {
  const amount = Math.abs(value || 0);
  const formatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

  if (amount >= 10000000) return `₹ ${formatter.format(value / 10000000)} Cr`;
  if (amount >= 100000) return `₹ ${formatter.format(value / 100000)} Lakh`;
  return `₹ ${formatter.format(value)}`;
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value || 0);
}

function riskCategory(impact = 0) {
  if (impact >= 40) return "High";
  if (impact >= 36) return "Moderate-High";
  if (impact >= 32) return "Moderate";
  return "Low";
}

function riskTone(category) {
  if (category === "High") return "bg-rose-50 text-rose-700 ring-rose-100";
  if (category === "Moderate-High") return "bg-orange-50 text-orange-700 ring-orange-100";
  if (category === "Moderate") return "bg-amber-50 text-amber-700 ring-amber-100";
  return "bg-emerald-50 text-emerald-700 ring-emerald-100";
}

function colorForImpact(value) {
  if (!Number.isFinite(value)) return "#f1f5f9";
  if (value >= 40) return "#dc2626";
  if (value >= 36) return "#f97316";
  if (value >= 32) return "#facc15";
  return "#16a34a";
}

function getMetricSummary(scopeRows) {
  const avgImpact = mean(scopeRows.map((row) => row.aerosolImpact));
  const avgGhi = mean(scopeRows.map((row) => row.ghi));
  const avgPotentialGhi = mean(scopeRows.map((row) => row.potentialGHI));
  const yieldRecoveryPct = Math.min(28, Math.max(8, avgImpact * 0.48));
  const recoverableGhi = Math.max(0, avgPotentialGhi - avgGhi) * (yieldRecoveryPct / 28);
  const energyLossGwh = REFERENCE_CAPACITY_MW * avgImpact * GWH_FACTOR;
  const revenueLoss = energyLossGwh * 1000 * INR_PER_MWH;
  const recoverableRevenue = revenueLoss * (yieldRecoveryPct / 100);
  const recoveryPct = revenueLoss > 0 ? (recoverableRevenue / revenueLoss) * 100 : 0;
  const carbonSavings = energyLossGwh * 1000 * 0.72 * (yieldRecoveryPct / 100);

  return {
    avgImpact,
    avgGhi,
    avgPotentialGhi,
    yieldRecoveryPct,
    recoverableGhi,
    energyLossGwh,
    revenueLoss,
    recoverableRevenue,
    recoveryPct,
    carbonSavings,
    category: riskCategory(avgImpact),
  };
}

function buildInsight(stateRow, scopeRows) {
  const summary = getMetricSummary(stateRow ? [stateRow] : scopeRows);
  const stateName = stateRow?.state || "India portfolio";
  const highSolar = summary.avgGhi >= 315;
  const category = summary.category;

  const observation =
    category === "High"
      ? `${stateName}: high aerosol loading detected with material attenuation risk.`
      : category === "Moderate-High"
        ? `${stateName}: elevated aerosol attenuation is reducing usable irradiance.`
        : category === "Moderate"
          ? `${stateName}: moderate aerosol attenuation with manageable recovery upside.`
          : `${stateName}: low aerosol impact and strong solar development fundamentals.`;

  const business =
    category === "High"
      ? "Treat forecast losses as bankability risk and include mitigation spend in project economics."
      : category === "Moderate-High"
        ? "Protect margins with conservative generation assumptions and targeted O&M interventions."
        : category === "Moderate"
          ? "Use measured site data to tune seasonal loss assumptions before final bid pricing."
          : highSolar
            ? "Excellent solar potential; prioritize capacity expansion and grid evacuation readiness."
            : "Aerosol risk is contained; focus business effort on scale, availability, and offtake quality.";

  const operational =
    category === "High"
      ? "Increase panel cleaning frequency, monitor PM2.5/AOD windows, and inspect underperforming blocks after pollution episodes."
      : category === "Moderate-High"
        ? "Improve O&M scheduling, validate pyranometer readings, and add soiling sensors on representative sites."
        : category === "Moderate"
          ? "Align cleaning cadence with seasonal dust and pollution cycles; monitor inverter variance weekly."
          : "Maintain standard cleaning cycles and focus on availability, curtailment, and capacity expansion readiness.";

  const commercial =
    category === "High"
      ? "Add aerosol buffers in P50/P90 cases and ring-fence recoverable revenue in O&M contracts."
      : category === "Moderate-High"
        ? "Quantify recoverable revenue and price intervention upside into portfolio planning."
        : category === "Moderate"
          ? "Use moderate attenuation assumptions and validate upside through pilot mitigation."
          : "Use standard commercial assumptions and prioritize new solar capacity in high-GHI zones.";

  return {
    stateName,
    category,
    observation,
    business,
    operational,
    commercial,
    recoverableYield: summary.yieldRecoveryPct,
    recoverableGhi: summary.recoverableGhi,
  };
}

export default function AerosolImpact({ selectedState: syncedSelectedState = "All" }) {
  const [selectedState, setSelectedState] = useState(syncedSelectedState);
  const [hoveredState, setHoveredState] = useState(null);

  useEffect(() => setSelectedState(syncedSelectedState), [syncedSelectedState]);

  const dataByName = useMemo(() => {
    const map = new Map();
    rows.forEach((row) => map.set(normalizeName(row.state), row));
    return map;
  }, []);

  const selectedRow = selectedState === "All" ? null : dataByName.get(normalizeName(selectedState));
  const activeRow = hoveredState || selectedRow;
  const scopedRows = useMemo(() => (selectedRow ? [selectedRow] : rows), [selectedRow]);
  const summary = useMemo(() => getMetricSummary(scopedRows), [scopedRows]);
  const insight = useMemo(() => buildInsight(activeRow, scopedRows), [activeRow, scopedRows]);

  const chartRows = useMemo(() => (selectedRow ? [selectedRow] : rows), [selectedRow]);
  const topSolar = useMemo(() => [...chartRows].sort((a, b) => b.ghi - a.ghi).slice(0, 10), [chartRows]);
  const topImpact = useMemo(() => [...chartRows].sort((a, b) => b.aerosolImpact - a.aerosolImpact).slice(0, 10), [chartRows]);
  const monthlyTrend = useMemo(() => buildMonthlyTrend(scopedRows), [scopedRows]);

  // Leaflet Tooltip Generator
  const getTooltipContent = (name, row) => {
    if (!row) return `<div class="p-2 font-sans"><div class="font-bold">${name}</div><div class="text-slate-500">No data</div></div>`;
    return `
      <div class="p-3 font-sans min-w-[180px]">
        <div class="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2 flex items-center justify-between gap-3">
          <span>${name}</span>
          <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500 ring-1 ring-slate-200">
            ${riskCategory(row.aerosolImpact)}
          </span>
        </div>
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">Aerosol Impact</span>
            <span class="font-bold text-rose-600">${row.aerosolImpact}%</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500 font-medium">GHI Index</span>
            <span class="font-bold text-emerald-600">${row.ghi} W/m²</span>
          </div>
          <div class="flex justify-between items-center text-xs pt-1 border-t border-slate-50 mt-1">
            <span class="text-slate-500 font-medium">Solar Loss %</span>
            <span class="font-bold text-orange-600">${Math.min(28, Math.max(8, row.aerosolImpact * 0.48)).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 text-slate-900">
      <header className={`${CARD} p-5 lg:p-6`}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
              <MapPinned size={14} />
              Renewable energy risk analytics
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">
              Aerosol Impact and Solar Revenue Intelligence
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 lg:text-base">
              State-level aerosol attenuation, recoverable GHI, INR revenue exposure, energy loss, and mitigation opportunity for utility-scale solar portfolios.
            </p>
          </div>

          <div className="min-w-[260px] rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Filter size={14} />
              State scope
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              value={selectedState}
              onChange={(event) => setSelectedState(event.target.value)}
            >
              <option value="All">All States</option>
              {rows.map((row) => (
                <option key={row.state} value={row.state}>{row.state}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <BusinessKpis summary={summary} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
        <div className={`${CARD} p-5`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">India geospatial intelligence</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">State-wise Aerosol Attenuation</h2>
              <p className="mt-1 text-sm text-slate-600">Stable React-Leaflet implementation. Click a state to filter insights.</p>
            </div>
            <MapLegend />
          </div>

          <div className="relative mt-4 aspect-[4/3] min-h-[440px] overflow-hidden rounded-2xl border border-slate-100 bg-white md:min-h-[560px] z-0">
            <LeafletIndiaChoropleth 
              geoData={indiaGeo}
              dataMap={dataByName}
              getColor={(row) => colorForImpact(row?.aerosolImpact)}
              getTooltipContent={getTooltipContent}
              onSelectState={setSelectedState}
              onHoverState={setHoveredState}
              selectedState={selectedState}
            />
          </div>
        </div>
        <StateInsights insight={insight} selectedState={selectedState} hoveredState={hoveredState} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <RankingChart
          title="Top 10 States by Solar Irradiance (GHI)"
          subtitle="Higher GHI indicates stronger solar resource quality."
          data={topSolar}
          dataKey="ghi"
          color="#16a34a"
          unit=" W/m2"
          axisTitle="Average GHI (W/m2)"
          legend="Solar Irradiance"
        />
        <RankingChart
          title="Top 10 States by Aerosol Attenuation"
          subtitle="Higher attenuation indicates greater aerosol-related yield risk."
          data={topImpact}
          dataKey="aerosolImpact"
          color="#dc2626"
          unit="%"
          axisTitle="Aerosol Attenuation (%)"
          legend="Aerosol Attenuation"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <RevenueImpactCard summary={summary} />
        <MonthlyTrendChart data={monthlyTrend} />
        <CarbonSavingsCard summary={summary} />
      </section>
    </div>
  );
}

function BusinessKpis({ summary }) {
  const items = [
    {
      label: "Average Aerosol Impact",
      value: `${summary.avgImpact.toFixed(1)}%`,
      detail: summary.category,
      icon: <ShieldAlert size={18} />,
      tone: riskTone(summary.category),
    },
    {
      label: "Revenue Loss",
      value: formatInr(summary.revenueLoss),
      detail: "Annual estimate",
      icon: <Banknote size={18} />,
      tone: "bg-rose-50 text-rose-700 ring-rose-100",
    },
    {
      label: "Recoverable Revenue",
      value: formatInr(summary.recoverableRevenue),
      detail: `${summary.recoveryPct.toFixed(1)}% recovery`,
      icon: <Sparkles size={18} />,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Yield Recovery Potential",
      value: `${summary.yieldRecoveryPct.toFixed(1)}%`,
      detail: `${summary.recoverableGhi.toFixed(0)} W/m2 recoverable`,
      icon: <CloudSun size={18} />,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Energy Loss",
      value: `${summary.energyLossGwh.toFixed(1)} GWh`,
      detail: "Reference 1 GW portfolio",
      icon: <BatteryCharging size={18} />,
      tone: "bg-orange-50 text-orange-700 ring-orange-100",
    },
    {
      label: "Carbon Savings",
      value: `${formatNumber(summary.carbonSavings, 0)} tCO2e`,
      detail: "Recoverable mitigation upside",
      icon: <Leaf size={18} />,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className={`${CARD} p-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{item.value}</p>
            </div>
            <span className={`rounded-xl p-2.5 ring-1 ${item.tone}`}>{item.icon}</span>
          </div>
          <p className="mt-3 text-sm text-slate-600">{item.detail}</p>
        </div>
      ))}
    </section>
  );
}

function MapLegend() {
  const items = [
    ["Low", "#16a34a"],
    ["Moderate", "#facc15"],
    ["Moderate-High", "#f97316"],
    ["High", "#dc2626"],
  ];

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-3 sm:w-72">
      <div
        className="h-2 rounded-full"
        style={{ background: "linear-gradient(90deg, #16a34a 0%, #facc15 36%, #f97316 68%, #dc2626 100%)" }}
      />
      <div className="mt-3 grid grid-cols-2 gap-2">
        {items.map(([label, color]) => (
          <div key={label} className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function StateInsights({ insight, selectedState, hoveredState }) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dynamic state insights</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{insight.stateName}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {hoveredState ? "Previewing hovered state" : selectedState === "All" ? "National portfolio view" : "Selected state view"}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${riskTone(insight.category)}`}>{insight.category} risk</span>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Key Observation</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{insight.observation}</p>
      </div>

      <div className="mt-4 grid gap-3">
        <InsightItem icon={<Factory size={17} />} title="Business Interpretation" body={insight.business} tone="bg-slate-100 text-slate-700" />
        <InsightItem icon={<Gauge size={17} />} title="Operational Recommendation" body={insight.operational} tone="bg-emerald-50 text-emerald-700" />
        <InsightItem icon={<Banknote size={17} />} title="Commercial Recommendation" body={insight.commercial} tone="bg-amber-50 text-amber-700" />
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
        <div className="flex items-center justify-between gap-3 text-sm font-semibold">
          <span>Estimated Recoverable Yield</span>
          <span>{insight.recoverableYield.toFixed(1)}%</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/80">
          <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, insight.recoverableYield * 3.3)}%` }} />
        </div>
        <p className="mt-2 text-xs text-emerald-700">Approx. {insight.recoverableGhi.toFixed(0)} W/m2 recoverable GHI.</p>
      </div>
    </div>
  );
}

function InsightItem({ icon, title, body, tone }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className={`rounded-lg p-2 ${tone}`}>{icon}</span>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function RankingChart({ title, subtitle, data, dataKey, color, unit, axisTitle, legend }) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      <div className="h-[390px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} margin={{ top: 16, right: 24, left: 20, bottom: 96 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="state"
              interval={0}
              angle={-35}
              textAnchor="end"
              height={94}
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              label={{ value: "State", position: "insideBottom", offset: -70, fill: "#64748b", fontSize: 13, fontWeight: 600 }}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              label={{ value: axisTitle, angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 13, fontWeight: 600 }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "#f8fafc" }}
              formatter={(value) => [`${Number(value).toFixed(unit === "%" ? 1 : 0)}${unit}`, legend]}
              labelFormatter={(label) => `State: ${label}`}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ color: "#475569", fontSize: 13 }} />
            <Bar name={legend} dataKey={dataKey} fill={color} radius={[9, 9, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RevenueImpactCard({ summary }) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Commercial exposure</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            Estimated Annual Revenue Loss due to Aerosol Attenuation
          </h3>
        </div>
        <span className="rounded-xl bg-rose-50 p-2.5 text-rose-700 ring-1 ring-rose-100">
          <Banknote size={18} />
        </span>
      </div>
      <div className="mt-5 space-y-4">
        <RevenueRow label="Estimated Annual Revenue Loss" value={formatInr(summary.revenueLoss)} tone="text-rose-700" />
        <RevenueRow label="Recoverable Revenue Potential" value={formatInr(summary.recoverableRevenue)} tone="text-emerald-700" />
        <RevenueRow label="Revenue Recovery Percentage" value={`${summary.recoveryPct.toFixed(1)}%`} tone="text-slate-900" />
      </div>
      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${summary.recoveryPct}%` }} />
      </div>
    </div>
  );
}

function RevenueRow({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-base font-semibold ${tone}`}>{value}</span>
    </div>
  );
}

function MonthlyTrendChart({ data }) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seasonal signal</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Monthly Aerosol Attenuation Trend</h3>
      </div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 16, right: 24, left: 16, bottom: 58 }}>
            <defs>
              <linearGradient id="monthlyImpact" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              angle={-35}
              textAnchor="end"
              height={58}
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              label={{ value: "Month", position: "insideBottom", offset: -42, fill: "#64748b", fontSize: 13, fontWeight: 600 }}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              label={{ value: "Aerosol Attenuation (%)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 13, fontWeight: 600 }}
            />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toFixed(1)}%`, "Aerosol attenuation"]} />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ color: "#475569", fontSize: 13 }} />
            <Area name="Aerosol Attenuation" type="monotone" dataKey="impact" stroke="#f97316" strokeWidth={3} fill="url(#monthlyImpact)" />
            <Line name="Risk Threshold" type="monotone" dataKey="threshold" stroke="#dc2626" strokeDasharray="5 5" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CarbonSavingsCard({ summary }) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sustainability upside</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            Potential Carbon Savings from Pollution Mitigation
          </h3>
        </div>
        <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700 ring-1 ring-emerald-100">
          <Leaf size={18} />
        </span>
      </div>
      <p className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">{formatNumber(summary.carbonSavings, 0)} tCO2e</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Estimated avoided emissions equivalent from recovering yield through aerosol and pollution mitigation.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <SmallMetric label="Energy loss" value={`${summary.energyLossGwh.toFixed(1)} GWh`} />
        <SmallMetric label="Recovery potential" value={`${summary.yieldRecoveryPct.toFixed(1)}%`} />
      </div>
    </div>
  );
}

function SmallMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function buildMonthlyTrend(scopeRows) {
  const avgImpact = mean(scopeRows.map((row) => row.aerosolImpact));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return months.map((month, index) => ({
    month,
    impact: Math.max(0, Number((avgImpact + Math.sin(index / 1.8) * 2.6 + Math.cos(index / 2.8) * 1.1).toFixed(1))),
    threshold: 36,
  }));
}
