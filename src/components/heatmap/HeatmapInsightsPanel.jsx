import { memo, useMemo } from "react";
import { ALL_STATES } from "../../utils/solarStateMetrics";
import { formatNumber } from "../../utils/stats";

function HeatmapInsightsPanel({ metrics, selectedState, selectedMetric }) {
  const summary = useMemo(() => {
    if (!metrics?.length) {
      return {
        headline: "No data available",
        bullets: ["Check data sources for the heatmap metrics."],
      };
    }

    const top = metrics[0];
    const bottom = metrics[metrics.length - 1];

    const avg = metrics.reduce((sum, m) => sum + m.ghi, 0) / metrics.length;
    const p50 = [...metrics].sort((a, b) => a.ghi - b.ghi)[Math.floor(metrics.length * 0.5)]?.ghi ?? avg;

    if (!selectedState || selectedState === ALL_STATES || !selectedMetric) {
      return {
        headline: "National GHI signal",
        bullets: [
          `Top state: ${top.state} at ${top.ghi.toFixed(1)} kWh/m²/day`,
          `Lowest state: ${bottom.state} at ${bottom.ghi.toFixed(1)} kWh/m²/day`,
          `Average across dataset: ${avg.toFixed(2)} kWh/m²/day (median ~${p50.toFixed(1)})`,
          "Use the map to select a state and benchmark it against peers.",
        ],
      };
    }

    const rank = metrics.findIndex((m) => m.state === selectedMetric.state) + 1;
    const rankPct = metrics.length ? 1 - (rank - 1) / metrics.length : 0;
    const bucket =
      rankPct >= 0.8 ? "top-quintile" : rankPct >= 0.6 ? "above-average" : rankPct >= 0.4 ? "mid-pack" : "below-average";

    return {
      headline: `${selectedMetric.state} opportunity brief`,
      bullets: [
        `Rank: #${rank} of ${metrics.length} (${bucket})`,
        `Daily GHI: ${selectedMetric.ghi.toFixed(1)} kWh/m²/day`,
        `Estimated annual potential: ${formatNumber(selectedMetric.potential)} kWh/m²/year`,
        `Aerosol index proxy: ${Number(selectedMetric.aerosolIndex).toFixed(1)} (higher = more attenuation risk)`,
      ],
    };
  }, [metrics, selectedMetric, selectedState]);

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Insights
          </p>
          <h2 className="mt-2 text-lg font-semibold text-white">
            {summary.headline}
          </h2>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
          Enterprise view
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
        {summary.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/90" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(HeatmapInsightsPanel);

