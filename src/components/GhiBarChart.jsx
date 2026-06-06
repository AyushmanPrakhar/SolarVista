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

import { ALL_STATES } from "../utils/solarStateMetrics";

function GhiBarChart({ metrics, selectedState }) {
  const chartData = useMemo(() => {
    if (!selectedState || selectedState === ALL_STATES) {
      return metrics;
    }

    const selected = metrics.find((item) => item.state === selectedState);
    const context = metrics
      .filter((item) => item.state !== selectedState)
      .slice(0, 11);

    return selected ? [selected, ...context] : metrics;
  }, [metrics, selectedState]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">GHI by State</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {selectedState === ALL_STATES
            ? "All states ranked by daily irradiance."
            : `${selectedState} compared with top GHI states.`}
        </p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} onResize={() => {}}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 36 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} className="dark:stroke-slate-800" />
            <XAxis
              dataKey="state"
              angle={-35}
              interval={0}
              textAnchor="end"
              tick={{ fill: "#64748B", fontSize: 11 }}
            />
            <YAxis tick={{ fill: "#64748B", fontSize: 12 }} domain={[4, 7]} />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                color: "#0f172a",
              }}
              itemStyle={{ color: "#0f172a" }}
              formatter={(value) => [`${Number(value).toFixed(1)} kWh/m2/day`, "GHI"]}
            />
            <Bar
              dataKey="ghi"
              radius={[4, 4, 0, 0]}
              fill="#22c55e"
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default memo(GhiBarChart);
