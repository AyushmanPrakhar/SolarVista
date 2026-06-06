import { memo, useMemo } from "react";
import { AlertTriangle, Gauge, MapPin, TrendingDown, TrendingUp } from "lucide-react";
import { mean } from "../../utils/stats";

function Card({
  icon,
  label,
  value,
  detail,
  accent = "text-slate-900",
  iconTone = "bg-slate-100 text-slate-700",
  status = "Stable",
  statusTone = "bg-slate-100 text-slate-700",
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/80">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
          <p className={`mt-3 truncate text-2xl font-semibold tracking-tight ${accent}`}>{value}</p>
          <p className="mt-1 text-sm text-slate-600">{detail}</p>
        </div>
        <div className={`rounded-xl p-2.5 transition group-hover:scale-105 ${iconTone}`}>{icon}</div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {status}
        </span>
        <span className="text-xs text-slate-500">Current selection</span>
      </div>
    </div>
  );
}

function AerosolKpiCards({ rows }) {
  const stats = useMemo(() => {
    const avgGhi = mean(rows.map((r) => r.ghi));
    const avgImpact = mean(rows.map((r) => r.aerosolImpact));
    const worst = [...rows].sort((a, b) => b.aerosolImpact - a.aerosolImpact)[0];
    const trendAvg = mean(rows.map((r) => r.trend ?? 0));
    return { avgGhi, avgImpact, worst, trendAvg };
  }, [rows]);

  const highImpact = stats.avgImpact >= 40;
  const improving = stats.trendAvg < 0;

  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      <Card
        icon={<Gauge size={18} />}
        label="Average GHI"
        value={`${stats.avgGhi.toFixed(0)} W/m2`}
        detail="Solar performance baseline"
        accent="text-slate-900"
        iconTone="bg-emerald-50 text-emerald-700"
        status="Performance"
        statusTone="bg-emerald-50 text-emerald-700"
      />
      <Card
        icon={<AlertTriangle size={18} />}
        label="Average Aerosol Impact"
        value={`${stats.avgImpact.toFixed(1)}%`}
        detail="Estimated usable solar reduction"
        accent={highImpact ? "text-rose-600" : "text-amber-600"}
        iconTone={highImpact ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}
        status={highImpact ? "High impact" : "Moderate risk"}
        statusTone={highImpact ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}
      />
      <Card
        icon={<MapPin size={18} />}
        label="Most Affected State"
        value={stats.worst?.state || "--"}
        detail={stats.worst ? `${stats.worst.aerosolImpact}% impact` : "--"}
        iconTone="bg-red-50 text-red-700"
        status="Priority zone"
        statusTone="bg-red-50 text-red-700"
      />
      <Card
        icon={improving ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
        label="Trend Signal"
        value={`${stats.trendAvg.toFixed(2)} pp`}
        detail="Negative values indicate improving impact"
        accent={improving ? "text-emerald-600" : "text-amber-600"}
        iconTone={improving ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}
        status={improving ? "Improving" : "Watchlist"}
        statusTone={improving ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}
      />
    </section>
  );
}

export default memo(AerosolKpiCards);
