import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { COMPARISON_STATES, METRIC_COLORS } from "../../utils/solarIntelligence/constants";
import { formatGhi, formatMu } from "../../utils/solarIntelligence/format";
import { getChartTheme } from "../../utils/solarIntelligence/theme";
import { rankStates } from "../../utils/solarIntelligence/percentiles";
import { cardClass, SectionHeading } from "./ui";

const METRICS = [
  { key: "ghi", label: "GHI", color: METRIC_COLORS.ghi, format: (v) => v.toFixed(2) },
  { key: "generation", label: "Generation (÷1000)", color: METRIC_COLORS.generation, format: (v) => (v / 1000).toFixed(1) },
  { key: "readiness", label: "Readiness %", color: METRIC_COLORS.readiness, format: (v) => v.toFixed(0) },
  { key: "adoption", label: "Adoption %", color: METRIC_COLORS.adoption, format: (v) => v.toFixed(0) },
  { key: "opportunityIndex", label: "Opportunity", color: METRIC_COLORS.opportunity, format: (v) => v },
];

export default function StateComparisonStudio({ states, dark }) {
  const [picked, setPicked] = useState(() => COMPARISON_STATES.slice(0, 4));
  const theme = getChartTheme(dark);

  const stateMap = useMemo(() => {
    const m = new Map();
    states.forEach((s) => m.set(s.state, s));
    return m;
  }, [states]);

  const compareRows = useMemo(() => picked.map((name) => stateMap.get(name)).filter(Boolean), [picked, stateMap]);

  const chartData = useMemo(() => {
    return METRICS.map((m) => {
      const row = { metric: m.label };
      compareRows.forEach((s) => {
        row[s.state] = m.key === "generation" ? s.generation / 1000 : s[m.key];
      });
      return row;
    });
  }, [compareRows]);

  const toggle = (name) => {
    setPicked((prev) => {
      if (prev.includes(name)) return prev.filter((s) => s !== name);
      if (prev.length >= 5) return prev;
      return [...prev, name];
    });
  };

  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Comparative analysis"
        title="State comparison studio"
        subtitle="Benchmark major states side by side across resource and market dimensions"
        conclusion="Select up to five states. Grouped bars normalise generation to thousands of MU for visual balance."
        dark={dark}
      />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {COMPARISON_STATES.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => toggle(name)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              picked.includes(name)
                ? "bg-[#1E3A8A] text-white"
                : dark
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-4 h-[340px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={chartData} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="metric" tick={{ fill: theme.axis, fontSize: 10 }} />
            <YAxis tick={{ fill: theme.axis, fontSize: 10 }} />
            <Tooltip contentStyle={theme.tooltip} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {compareRows.map((s, i) => (
              <Bar
                key={s.state}
                dataKey={s.state}
                fill={[METRIC_COLORS.ghi, METRIC_COLORS.generation, METRIC_COLORS.readiness, METRIC_COLORS.opportunity, METRIC_COLORS.adoption][i % 5]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {compareRows.map((row) => (
          <ComparisonCard key={row.state} row={row} states={states} dark={dark} />
        ))}
      </div>
    </section>
  );
}

function ComparisonCard({ row, states, dark }) {
  const { rankMap: ghiRank } = rankStates(states, "ghi", true);
  const { rankMap: genRank } = rankStates(states, "generation", true);

  return (
    <div className={`rounded-lg border p-3 ${dark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-white"}`}>
      <p className={`font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{row.state}</p>
      <dl className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between">
          <dt style={{ color: METRIC_COLORS.ghi }}>GHI</dt>
          <dd>
            {formatGhi(row.ghi)} · #{ghiRank.get(row.state)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt style={{ color: METRIC_COLORS.generation }}>Generation</dt>
          <dd>
            {formatMu(row.generation)} · #{genRank.get(row.state)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt style={{ color: METRIC_COLORS.readiness }}>Readiness</dt>
          <dd>{row.readiness}%</dd>
        </div>
        <div className="flex justify-between">
          <dt style={{ color: METRIC_COLORS.adoption }}>Adoption</dt>
          <dd>{row.adoption}%</dd>
        </div>
      </dl>
    </div>
  );
}
