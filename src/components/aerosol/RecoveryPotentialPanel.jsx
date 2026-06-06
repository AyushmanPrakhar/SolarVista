import { memo, useMemo } from "react";
import { Activity, Gauge, Sparkles } from "lucide-react";
import { ALL_STATES } from "../../utils/solarStateMetrics";
import { formatNumber } from "../../utils/stats";

function RecoveryPotentialPanel({ rows, selectedState }) {
  const model = useMemo(() => {
    const avgImpact = rows.reduce((sum, r) => sum + r.aerosolImpact, 0) / (rows.length || 1);
    const avgPotential = rows.reduce((sum, r) => sum + r.potentialGHI, 0) / (rows.length || 1);
    const recoverablePct = Math.min(40, Math.max(4, avgImpact * 0.45));
    const recoverableGhi = (avgPotential * recoverablePct) / 100;

    return { avgImpact, avgPotential, recoverablePct, recoverableGhi };
  }, [rows]);

  const scenarios = [10, 20, 30].map((pct) => ({
    reduction: pct,
    recoveryPct: Math.min(100, Number((model.avgImpact * (pct / 100)).toFixed(1))),
    recoveredGhi: Number((model.recoverableGhi * (pct / 30)).toFixed(0)),
  }));

  const scope = selectedState && selectedState !== ALL_STATES ? selectedState : "All states";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Recovery modelling</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Recovery Potential</h2>
          <p className="mt-1 text-sm text-slate-600">Estimated recoverable solar intensity from pollution control and targeted O&M.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Scope: <span className="font-semibold text-slate-900">{scope}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric icon={<Activity size={17} />} label="Avg aerosol impact" value={`${model.avgImpact.toFixed(1)}%`} tone="rose" />
        <Metric icon={<Sparkles size={17} />} label="Recoverable share" value={`${model.recoverablePct.toFixed(1)}%`} tone="emerald" />
        <Metric
          icon={<Gauge size={17} />}
          label="Recoverable GHI"
          value={`${formatNumber(model.recoverableGhi, { maximumFractionDigits: 0 })} W/m2`}
          tone="slate"
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Scenario modelling</p>
          <p className="text-xs text-slate-500">PM2.5 reduction sensitivity</p>
        </div>
        <div className="mt-4 space-y-4">
          {scenarios.map((scenario) => (
            <div key={scenario.reduction} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">PM2.5 reduction by {scenario.reduction}%</p>
                  <p className="mt-1 text-xs text-slate-600">Approx. {scenario.recoveredGhi} W/m2 GHI recovery</p>
                </div>
                <div className="font-semibold text-emerald-700">{scenario.recoveryPct}% recovery</div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${scenario.recoveryPct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-600">
        If interventions capture about {model.recoverablePct.toFixed(0)}% of current attenuation, projects can improve yield
        assumptions, reduce downside risk, and prioritize mitigation spend by state.
      </p>
    </section>
  );
}

function Metric({ icon, label, value, tone }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <span className={`rounded-lg p-2 ${tones[tone]}`}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}

export default memo(RecoveryPotentialPanel);
