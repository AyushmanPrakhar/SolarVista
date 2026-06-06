import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { COMPARISON_STATES, METRIC_COLORS } from "../../utils/solarIntelligence/constants";
import { buildSeasonalNarrative, buildStateMonthlySeries } from "../../utils/solarIntelligence/analytics";
import { monthlySolarTrend } from "../../data/indiaGhiData";
import { getSeasonalNationalData } from "../../utils/solarIntelligence/compute";
import { formatGhi } from "../../utils/solarIntelligence/format";
import { getChartTheme } from "../../utils/solarIntelligence/theme";
import { cardClass, InterpretationNote, SectionHeading } from "./ui";

export default function SeasonalExplorer({ states, dark }) {
  const [stateName, setStateName] = useState("Rajasthan");
  const [view, setView] = useState("single");
  const theme = getChartTheme(dark);
  const nationalInsight = useMemo(() => getSeasonalNationalData(), []);

  const state = useMemo(() => states.find((s) => s.state === stateName) || states[0], [states, stateName]);

  const series = useMemo(() => buildStateMonthlySeries(state, monthlySolarTrend), [state]);

  const peak = useMemo(() => [...series].sort((a, b) => b.ghi - a.ghi)[0], [series]);
  const low = useMemo(() => [...series].sort((a, b) => a.ghi - b.ghi)[0], [series]);

  const narratives = buildSeasonalNarrative({
    best: peak,
    worst: low,
    volatility: nationalInsight.volatility,
    peakWindow: nationalInsight.peakWindow,
  });

  const miniStates = COMPARISON_STATES.slice(0, 6);

  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Temporal analysis"
        title="Seasonal solar intelligence explorer"
        subtitle="How does irradiance move through the year—and where should planners act?"
        conclusion="State curves apply national seasonality to each state's annual GHI baseline. Annotations mark peak and monsoon trough."
        dark={dark}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          className={`rounded-lg border px-3 py-1.5 text-sm ${dark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-slate-200 bg-white"}`}
        >
          {states.map((s) => (
            <option key={s.state} value={s.state}>
              {s.state}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setView("single")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${view === "single" ? "bg-[#C2410C] text-white" : dark ? "bg-slate-800 text-slate-400" : "bg-slate-100"}`}
        >
          State trend
        </button>
        <button
          type="button"
          onClick={() => setView("multiples")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${view === "multiples" ? "bg-[#C2410C] text-white" : dark ? "bg-slate-800 text-slate-400" : "bg-slate-100"}`}
        >
          Regional mini-charts
        </button>
      </div>

      {view === "single" ? (
        <div className="mt-4 h-[380px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={series} margin={{ top: 24, right: 16, left: 8, bottom: 24 }}>
              <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: theme.axis, fontSize: 11 }} />
              <YAxis
                tick={{ fill: theme.axis, fontSize: 11 }}
                domain={["auto", "auto"]}
                label={{ value: "GHI (kWh/m²/day)", angle: -90, position: "insideLeft", fill: METRIC_COLORS.ghi, fontSize: 11 }}
              />
              <Tooltip
                contentStyle={theme.tooltip}
                formatter={(v) => [formatGhi(v), stateName]}
              />
              <ReferenceArea x1="Jun" x2="Sep" fill={METRIC_COLORS.monsoon} strokeOpacity={0} />
              <Area type="monotone" dataKey="ghi" stroke={METRIC_COLORS.ghi} fill={METRIC_COLORS.ghi} fillOpacity={0.2} strokeWidth={2.5} name={stateName} />
              <Area type="monotone" dataKey="nationalGhi" stroke={METRIC_COLORS.neutral} fill="none" strokeDasharray="4 4" strokeWidth={1.5} name="National pattern" />
              <ReferenceDot x={peak.month} y={peak.ghi} r={6} fill={METRIC_COLORS.ghi} label={{ value: "Peak", position: "top", fontSize: 10 }} />
              <ReferenceDot x={low.month} y={low.ghi} r={5} fill={METRIC_COLORS.readiness} label={{ value: "Low", position: "bottom", fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {miniStates.map((name) => {
            const s = states.find((r) => r.state === name);
            if (!s) return null;
            const data = buildStateMonthlySeries(s, monthlySolarTrend);
            return (
              <div key={name} className={`rounded-lg border p-2 ${dark ? "border-slate-700" : "border-slate-200"}`}>
                <p className="text-xs font-semibold">{name}</p>
                <div className="h-[100px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data}>
                      <Area type="monotone" dataKey="ghi" stroke={METRIC_COLORS.ghi} fill={METRIC_COLORS.ghi} fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                      <XAxis dataKey="month" hide />
                      <YAxis hide domain={["dataMin - 0.2", "dataMax + 0.2"]} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {narratives.map((line) => (
        <InterpretationNote key={line} dark={dark} variant="insight">
          {line}
        </InterpretationNote>
      ))}
    </section>
  );
}
