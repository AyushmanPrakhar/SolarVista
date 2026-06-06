import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { METRIC_COLORS, RANKING_LIMIT } from "../../utils/solarIntelligence/constants";
import { getRankedList } from "../../utils/solarIntelligence/percentiles";
import { formatGhi, formatMu, formatNumber } from "../../utils/solarIntelligence/format";
import { getChartTheme } from "../../utils/solarIntelligence/theme";
import RichStateTooltip from "./RichStateTooltip";
import { cardClass, SectionHeading } from "./ui";

const PANELS = [
  {
    id: "ghi",
    title: "Solar Resource Leadership",
    question: "Where is the strongest solar resource?",
    metricKey: "ghi",
    color: METRIC_COLORS.ghi,
    format: (v) => v.toFixed(2),
    unit: "kWh/m²/day",
    benchmarkKey: "avgGhi",
  },
  {
    id: "generation",
    title: "Generation Leaders",
    question: "Which states generate the most solar power?",
    metricKey: "generation",
    color: METRIC_COLORS.generation,
    format: (v) => formatNumber(v),
    unit: "MU",
    benchmarkKey: "totalGeneration",
    benchmarkDiv: true,
  },
  {
    id: "opportunity",
    title: "Investment Opportunity Ranking",
    question: "Where is readiness outpacing adoption?",
    metricKey: "opportunityIndex",
    color: METRIC_COLORS.opportunity,
    format: (v) => String(v),
    unit: "gap pts",
    benchmarkKey: "avgOpportunity",
  },
];

export default function VisualRankingPanels({ states, nationalSummary, selectedState, onSelectState, dark }) {
  const [limit, setLimit] = useState(RANKING_LIMIT);
  const theme = getChartTheme(dark);

  const avgOpp = useMemo(
    () => states.reduce((s, r) => s + r.opportunityIndex, 0) / states.length,
    [states]
  );

  const benchmarks = useMemo(
    () => ({
      avgGhi: nationalSummary.avgGhi,
      totalGeneration: nationalSummary.totalGeneration / states.length,
      avgOpportunity: avgOpp,
    }),
    [nationalSummary, states.length, avgOpp]
  );

  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Primary analytical view"
        title="State performance rankings"
        subtitle="Three lenses on resource, deployment, and latent market capacity"
        conclusion="Select a bar to focus the rest of the dashboard. Benchmark lines show the national reference."
        dark={dark}
      />
      <div className="mb-3 flex flex-wrap gap-2">
        {[5, 10, 15].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setLimit(n)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              limit === n ? "bg-[#C2410C] text-white" : dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"
            }`}
          >
            Top {n}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {PANELS.map((panel) => {
          const data = getRankedList(states, panel.metricKey, limit);
          const benchmark = panel.benchmarkDiv
            ? benchmarks[panel.benchmarkKey]
            : benchmarks[panel.benchmarkKey] ?? nationalSummary.avgGhi;

          return (
            <div
              key={panel.id}
              className={`rounded-lg border p-3 ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-slate-50/80"}`}
            >
              <h3 className="text-sm font-semibold" style={{ color: panel.color }}>
                {panel.title}
              </h3>
              <p className={`mt-0.5 text-[11px] ${dark ? "text-slate-500" : "text-slate-500"}`}>{panel.question}</p>
              <div className="mt-3 h-[280px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 4, right: 36, left: 4, bottom: 4 }}
                    onClick={(d) => d?.activePayload?.[0]?.payload?.state && onSelectState(d.activePayload[0].payload.state)}
                  >
                    <CartesianGrid stroke={theme.grid} horizontal={false} />
                    <XAxis type="number" tick={{ fill: theme.axis, fontSize: 10 }} />
                    <YAxis
                      type="category"
                      dataKey="state"
                      width={100}
                      tick={{ fill: theme.axis, fontSize: 10 }}
                      tickFormatter={(v, i) => `#${data[i]?.rank} ${v}`}
                    />
                    <Tooltip
                      content={
                        <RichStateTooltip
                          states={states}
                          nationalSummary={nationalSummary}
                          metricKey={panel.metricKey}
                          dark={dark}
                        />
                      }
                    />
                    <ReferenceLine x={benchmark} stroke={METRIC_COLORS.neutral} strokeDasharray="4 4" />
                    <Bar
                      dataKey={panel.metricKey}
                      fill={panel.color}
                      radius={[0, 4, 4, 0]}
                      barSize={14}
                      cursor="pointer"
                    >
                      <LabelList
                        dataKey={panel.metricKey}
                        position="right"
                        formatter={panel.format}
                        fontSize={10}
                        fill={theme.axis}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-500"}`}>
                National benchmark: {panel.id === "ghi" ? formatGhi(benchmark) : panel.id === "generation" ? formatMu(benchmark) : `${benchmark.toFixed(1)} pts`}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
