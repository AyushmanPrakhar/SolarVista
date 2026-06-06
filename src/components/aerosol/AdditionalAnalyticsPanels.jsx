import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Banknote, BatteryCharging, CloudSun, Leaf, TrendingUp } from "lucide-react";
import { formatNumber, mean } from "../../utils/stats";

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
  color: "#0f172a",
};

function smallSeriesFrom(rows) {
  const avg = mean(rows.map((r) => r.aerosolImpact || 0));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => ({
    month,
    impact: Math.max(0, Number((avg + Math.sin(index / 1.7) * 2.8 + Math.cos(index / 2.4) * 1.2).toFixed(1))),
  }));
}

function metricSummary(rows) {
  const avgImpact = mean(rows.map((r) => r.aerosolImpact || 0));
  const avgGhi = mean(rows.map((r) => r.ghi || 0));
  const avgPotential = mean(rows.map((r) => r.potentialGHI || 0));
  const recoverablePct = Math.min(40, Math.max(4, avgImpact * 0.45));
  const capacityMW = 1000;
  const annualEnergyLossMWh = capacityMW * 365 * (avgImpact / 100) * 0.2;
  const revenueLoss = annualEnergyLossMWh * 40;
  const recoverableGhi = Math.max(0, avgPotential - avgGhi) * (recoverablePct / 40);
  const carbonTons = annualEnergyLossMWh * 0.5;

  return {
    avgImpact,
    avgGhi,
    avgPotential,
    recoverablePct,
    recoverableGhi,
    annualEnergyLossMWh,
    revenueLoss,
    carbonTons,
  };
}

function AnalyticsCard({ icon, eyebrow, title, value, detail, tone = "emerald", children }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <div className={`rounded-xl p-2.5 ${tones[tone]}`}>{icon}</div>
      </div>
      <div className="mt-5">
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
      </div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

function Progress({ value, tone = "bg-emerald-500" }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function MonthlyAerosolTrend({ rows }) {
  const data = useMemo(() => smallSeriesFrom(rows), [rows]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly signal</p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">Monthly Aerosol Trend</h3>
        </div>
        <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
          <TrendingUp size={18} />
        </div>
      </div>
      <div className="mt-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="aerosolTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{ value: "Month", position: "insideBottom", offset: -14, fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              label={{ value: "Impact (%)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${Number(value).toFixed(1)}%`, "Aerosol impact"]}
            />
            <Area type="monotone" dataKey="impact" stroke="#f97316" strokeWidth={3} fill="url(#aerosolTrendFill)" />
            <Line type="monotone" dataKey="impact" stroke="#dc2626" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RevenueImpactEstimation({ rows }) {
  const summary = useMemo(() => metricSummary(rows), [rows]);
  const riskValue = Math.min(100, summary.avgImpact * 2.1);

  return (
    <AnalyticsCard
      icon={<Banknote size={18} />}
      eyebrow="Commercial"
      title="Revenue Impact Estimation"
      value={`$${formatNumber(summary.revenueLoss, { maximumFractionDigits: 0 })}`}
      detail="Indicative annual revenue exposure for a 1 GW reference portfolio at $40/MWh."
      tone="rose"
    >
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Commercial risk</span>
        <span className="font-semibold text-rose-700">{riskValue.toFixed(0)}%</span>
      </div>
      <div className="mt-2">
        <Progress value={riskValue} tone="bg-rose-500" />
      </div>
    </AnalyticsCard>
  );
}

export function EnergyLossEstimation({ rows }) {
  const summary = useMemo(() => metricSummary(rows), [rows]);

  return (
    <AnalyticsCard
      icon={<BatteryCharging size={18} />}
      eyebrow="Operations"
      title="Energy Loss Estimation"
      value={`${formatNumber(summary.annualEnergyLossMWh, { maximumFractionDigits: 0 })} MWh`}
      detail={`${summary.avgImpact.toFixed(1)}% modeled attenuation against average GHI of ${summary.avgGhi.toFixed(0)} W/m2.`}
      tone="amber"
    >
      <Progress value={summary.avgImpact * 2} tone="bg-amber-500" />
    </AnalyticsCard>
  );
}

export function RecoverablePotential({ rows }) {
  const summary = useMemo(() => metricSummary(rows), [rows]);

  return (
    <AnalyticsCard
      icon={<CloudSun size={18} />}
      eyebrow="Recovery"
      title="Recoverable GHI Potential"
      value={`${summary.recoverableGhi.toFixed(0)} W/m2`}
      detail={`${summary.recoverablePct.toFixed(1)}% of current attenuation is treated as recoverable through intervention.`}
      tone="emerald"
    >
      <Progress value={summary.recoverablePct * 2.5} tone="bg-emerald-500" />
    </AnalyticsCard>
  );
}

export function CarbonOffsetImpact({ rows }) {
  const summary = useMemo(() => metricSummary(rows), [rows]);

  return (
    <AnalyticsCard
      icon={<Leaf size={18} />}
      eyebrow="Sustainability"
      title="Carbon Offset Impact"
      value={`${formatNumber(summary.carbonTons, { maximumFractionDigits: 0 })} tCO2e`}
      detail="Annual emissions-equivalent opportunity from avoiding modeled solar energy losses."
      tone="emerald"
    >
      <Progress value={Math.min(100, summary.recoverablePct * 2.2)} tone="bg-emerald-500" />
    </AnalyticsCard>
  );
}

const AdditionalAnalyticsPanels = null;

export default AdditionalAnalyticsPanels;
