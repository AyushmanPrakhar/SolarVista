import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ALL_STATES } from "../../utils/solarStateMetrics";

function SolarPotentialComparisonChart({ metrics, selectedState }) {
  const data = useMemo(() => {
    const sorted = [...metrics].sort((a, b) => b.potential - a.potential);
    if (!selectedState || selectedState === ALL_STATES) return sorted.slice(0, 12);

    const selected = metrics.find((m) => m.state === selectedState);
    const context = sorted.filter((m) => m.state !== selectedState).slice(0, 11);
    return selected ? [selected, ...context] : sorted.slice(0, 12);
  }, [metrics, selectedState]);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">Solar potential comparison</h2>
        <p className="text-sm text-slate-400">
          Estimated annual potential (GHI × 365) benchmarked across states.
        </p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} onResize={() => {}}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 36 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="state"
              angle={-35}
              interval={0}
              textAnchor="end"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
              contentStyle={{
                background: "#020617",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#e2e8f0",
              }}
              formatter={(value) => [`${Number(value).toLocaleString()} kWh/m²/yr`, "Potential"]}
            />
            <Bar dataKey="potential" radius={[4, 4, 0, 0]} fill="#38bdf8" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default memo(SolarPotentialComparisonChart);

