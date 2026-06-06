import { memo, useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { pearsonCorrelation } from "../../utils/stats";

function interpretCorrelation(r) {
  const abs = Math.abs(r);
  if (abs < 0.15) return "weak";
  if (abs < 0.35) return "mild";
  if (abs < 0.6) return "moderate";
  return "strong";
}

function AerosolCorrelationPanel({ rows }) {
  const { r, label, interpretation } = useMemo(() => {
    const xs = rows.map((d) => d.aerosolImpact);
    const ys = rows.map((d) => d.ghi);
    const corr = pearsonCorrelation(xs, ys);
    const strength = interpretCorrelation(corr);
    const direction = corr < 0 ? "negative" : "positive";

    return {
      r: corr,
      label: `r = ${corr.toFixed(2)} (${strength} ${direction})`,
      interpretation:
        corr < 0
          ? "Higher aerosol impact generally coincides with lower usable solar intensity."
          : "Higher aerosol impact coincides with higher GHI in this sample, which can indicate geography or seasonality effects.",
    };
  }, [rows]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Relationship analysis</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Aerosol Correlation</h2>
          <p className="mt-1 text-sm text-slate-600">{interpretation}</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
          {label}
        </div>
      </div>

      <div className="mt-4 h-[340px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} onResize={() => {}}>
          <ScatterChart margin={{ top: 12, right: 18, bottom: 28, left: 8 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis
              dataKey="aerosolImpact"
              name="Aerosol impact"
              unit="%"
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              label={{ value: "Aerosol impact (%)", position: "insideBottom", offset: -18, fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              dataKey="ghi"
              name="GHI"
              unit=" W/m2"
              tick={{ fill: "#475569", fontSize: 12 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              label={{ value: "GHI (W/m2)", angle: -90, position: "insideLeft", fill: "#64748b", fontSize: 12 }}
            />
            <ZAxis range={[64, 64]} />
            <Tooltip
              cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
                color: "#0f172a",
              }}
              formatter={(value, name) => {
                if (name === "GHI") return [`${Number(value).toFixed(0)} W/m2`, "GHI"];
                return [`${Number(value).toFixed(1)}%`, "Aerosol impact"];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.state || ""}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ color: "#475569", fontSize: 12 }} />
            <Scatter name="State observations" data={rows} fill={r < 0 ? "#f97316" : "#16a34a"} isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default memo(AerosolCorrelationPanel);
