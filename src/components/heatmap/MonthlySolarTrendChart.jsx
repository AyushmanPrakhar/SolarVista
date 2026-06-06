import { memo, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ALL_STATES } from "../../utils/solarStateMetrics";
import { INDIA_SEASONALITY, MONTHS } from "../../data/solarMonthlyProfile";

function MonthlySolarTrendChart({ metrics, selectedState }) {
  const data = useMemo(() => {
    const base =
      selectedState && selectedState !== ALL_STATES
        ? metrics.find((m) => m.state === selectedState)?.ghi ?? 0
        : metrics.reduce((sum, m) => sum + m.ghi, 0) / (metrics.length || 1);

    return MONTHS.map((month, idx) => ({
      month,
      ghi: Number((base * (INDIA_SEASONALITY[idx] ?? 1)).toFixed(2)),
    }));
  }, [metrics, selectedState]);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">Monthly solar trend</h2>
        <p className="text-sm text-slate-400">
          Seasonality model (monsoon dip) scaled to {selectedState === ALL_STATES ? "national average" : selectedState}.
        </p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} onResize={() => {}}>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 18, left: 0 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[3.8, 7.2]} />
            <Tooltip
              contentStyle={{
                background: "#020617",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#e2e8f0",
              }}
              formatter={(value) => [`${Number(value).toFixed(2)} kWh/m²/day`, "GHI"]}
            />
            <Line
              type="monotone"
              dataKey="ghi"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ r: 2, fill: "#f59e0b" }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default memo(MonthlySolarTrendChart);

