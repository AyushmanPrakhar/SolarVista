import { memo, useMemo } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

function AerosolGhiScatterPlot({ metrics, selectedState }) {
  const chartData = useMemo(
    () =>
      metrics.map((item) => ({
        state: item.state,
        aerosolIndex: item.aerosolIndex,
        ghi: item.ghi,
        selected: item.state === selectedState,
      })),
    [metrics, selectedState]
  );

  const selectedData = useMemo(
    () => chartData.filter((item) => item.selected),
    [chartData]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">Aerosol vs GHI</h2>
        <p className="text-sm text-slate-600">Mock aerosol index plotted against state-level GHI.</p>
      </div>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} onResize={() => {}}>
          <ScatterChart margin={{ top: 8, right: 12, bottom: 18, left: 0 }}>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis
              dataKey="aerosolIndex"
              name="Aerosol Index"
              tick={{ fill: "#475569", fontSize: 12 }}
              label={{
                value: "Aerosol index",
                position: "insideBottom",
                offset: -8,
                fill: "#475569",
                fontSize: 12,
              }}
            />
            <YAxis
              dataKey="ghi"
              name="GHI"
              domain={[4, 7]}
              tick={{ fill: "#475569", fontSize: 12 }}
              label={{
                value: "GHI",
                angle: -90,
                position: "insideLeft",
                fill: "#475569",
                fontSize: 12,
              }}
            />
            <ZAxis range={[52, 52]} />
            <Tooltip
              cursor={{ stroke: "#e6edf3", strokeDasharray: "3 3" }}
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e6edf3",
                borderRadius: 8,
                color: "#0f172a",
              }}
              formatter={(value, name) => [
                name === "GHI" ? `${Number(value).toFixed(1)} kWh/m2/day` : Number(value).toFixed(1),
                name,
              ]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.state || ""}
            />
            <Scatter data={chartData} fill="#38bdf8" isAnimationActive={false} />
            <Scatter data={selectedData} fill="#f97316" isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default memo(AerosolGhiScatterPlot);
