import { memo } from "react";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-slate-100">{value}</span>
    </div>
  );
}

function HeatmapTooltip({ hoverInfo }) {
  if (!hoverInfo) return null;

  const { x, y, metric } = hoverInfo;
  return (
    <div
      className="pointer-events-none absolute z-10 min-w-[220px] rounded-xl border border-slate-700/60 bg-slate-950/90 p-3 text-white shadow-2xl backdrop-blur"
      style={{ left: x + 12, top: y + 12 }}
    >
      <div className="mb-2 text-base font-semibold tracking-tight text-white">
        {metric.state}
      </div>
      <div className="space-y-1.5">
        <Row label="GHI" value={`${metric.ghi.toFixed(1)} kWh/m²/day`} />
        <Row label="Solar potential" value={`${metric.potential.toLocaleString()} kWh/m²/yr`} />
        <Row label="Aerosol index" value={Number(metric.aerosolIndex).toFixed(1)} />
      </div>
      <div className="mt-2 text-xs text-slate-400">
        Click to lock selection.
      </div>
    </div>
  );
}

export default memo(HeatmapTooltip);

