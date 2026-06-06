import { Activity, Gauge, MapPin, Trophy } from "lucide-react";
import { memo, useMemo } from "react";

function KpiCard({ icon, label, value, detail }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {value}
          </p>
          <p className="mt-1 text-sm text-slate-400">{detail}</p>
        </div>
        <div className="rounded-md bg-slate-900 p-2 text-amber-300">{icon}</div>
      </div>
    </div>
  );
}

function SolarKpiCards({ metrics, selectedMetric }) {
  const stats = useMemo(() => {
    const averageGhi =
      metrics.reduce((sum, item) => sum + item.ghi, 0) / (metrics.length || 1);
    const top = metrics.reduce(
      (best, item) => (item.ghi > best.ghi ? item : best),
      metrics[0]
    );

    return { averageGhi, top };
  }, [metrics]);

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        icon={<Gauge size={18} />}
        label="Average GHI"
        value={stats.averageGhi.toFixed(2)}
        detail="kWh/m2/day across states"
      />
      <KpiCard
        icon={<Trophy size={18} />}
        label="Top State"
        value={stats.top.state}
        detail="Highest GHI in dataset"
      />
      <KpiCard
        icon={<Activity size={18} />}
        label="Top GHI Value"
        value={stats.top.ghi.toFixed(1)}
        detail="kWh/m2/day"
      />
      <KpiCard
        icon={<MapPin size={18} />}
        label="Selected State"
        value={selectedMetric?.state || "All"}
        detail={
          selectedMetric
            ? `${selectedMetric.ghi.toFixed(1)} kWh/m2/day`
            : `${metrics.length} states visible`
        }
      />
    </section>
  );
}

export default memo(SolarKpiCards);
