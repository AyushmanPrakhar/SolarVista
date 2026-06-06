import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export function cardClass(dark) {
  return `rounded-xl border p-4 transition duration-200 hover:shadow-md sm:p-5 ${
    dark
      ? "border-slate-700/80 bg-slate-900/90 shadow-lg shadow-black/20 hover:border-slate-600"
      : "border-slate-200 bg-white shadow-sm shadow-slate-200/60 hover:border-slate-300"
  }`;
}

export function SectionHeading({ eyebrow, title, subtitle, conclusion, benchmark, dark }) {
  return (
    <div>
      {eyebrow && (
        <p className={`text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-1 text-lg font-semibold tracking-tight sm:text-xl ${dark ? "text-slate-50" : "text-slate-900"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-0.5 text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{subtitle}</p>
      )}
      {conclusion && (
        <p className={`mt-1 max-w-3xl text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
          {conclusion}
        </p>
      )}
      {benchmark && (
        <p className={`mt-2 inline-block rounded-md px-2 py-1 text-[11px] font-medium ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
          Benchmark: {benchmark}
        </p>
      )}
    </div>
  );
}

export function InterpretationNote({ children, dark, variant = "default" }) {
  const styles =
    variant === "insight"
      ? dark
        ? "border-l-4 border-[#EA580C] bg-slate-800/80 text-slate-300"
        : "border-l-4 border-[#EA580C] bg-orange-50/80 text-slate-800"
      : dark
        ? "border border-slate-700 bg-slate-800/50 text-slate-400"
        : "border border-slate-200 bg-slate-50 text-slate-700";

  return <p className={`mt-3 rounded-r-lg p-3 text-sm leading-relaxed ${styles}`}>{children}</p>;
}

export function ChartCard({ children, className = "", dark, compact }) {
  return (
    <section className={`${cardClass(dark)} ${compact ? "" : ""} ${className}`}>
      {children}
    </section>
  );
}

export function KpiCard({ label, value, unit, trend, delta, helper, dark }) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor =
    trend === "up" ? "text-emerald-600 dark:text-emerald-400" : trend === "down" ? "text-rose-600 dark:text-rose-400" : "text-slate-500";

  return (
    <div
      className={`rounded-xl border p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        dark ? "border-slate-700 bg-slate-800/80" : "border-slate-200 bg-white shadow-sm"
      }`}
    >
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <p className={`text-2xl font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>{value}</p>
          {unit && <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{unit}</p>}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${trendColor} ${dark ? "bg-slate-700/80" : "bg-slate-100"}`}>
            <TrendIcon size={14} />
            {delta}
          </span>
        )}
      </div>
      {helper && <p className={`mt-2 text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>{helper}</p>}
    </div>
  );
}

export function ChartSkeleton({ height = 320 }) {
  return (
    <div
      className="animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/50"
      style={{ height }}
      aria-hidden
    />
  );
}

export function MetricRow({ label, value, dark }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className={dark ? "text-slate-400" : "text-slate-600"}>{label}</span>
      <span className={`text-right font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}
