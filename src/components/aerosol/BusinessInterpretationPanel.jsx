import { memo, useMemo } from "react";
import { BriefcaseBusiness, ClipboardCheck, ShieldAlert } from "lucide-react";

function BusinessInterpretationPanel({ selectedState, scopeLabel, rows }) {
  const content = useMemo(() => {
    const avgImpact = rows.reduce((sum, r) => sum + r.aerosolImpact, 0) / (rows.length || 1);
    const avgGhi = rows.reduce((sum, r) => sum + r.ghi, 0) / (rows.length || 1);
    const recoveryOpportunity = Math.min(100, Math.round(avgImpact * 1.15));
    const riskScore = Math.min(100, Math.round(avgImpact * 2.2));

    const band = avgImpact >= 40 ? "High" : avgImpact >= 34 ? "Moderate" : "Low";

    const summary =
      band === "High"
        ? "Aerosol exposure is materially affecting usable solar yield. Treat this scope as an active risk zone for generation forecasts and O&M planning."
        : band === "Moderate"
          ? "Aerosol losses are meaningful but manageable. The portfolio should use conservative yield assumptions and targeted recovery actions."
          : "Aerosol exposure is comparatively manageable. The main opportunity is to preserve performance while scaling solar output efficiently.";

    const operational =
      band === "High"
        ? "Increase cleaning cadence, add soiling sensors where missing, and prioritize high-loss districts for inspection after pollution episodes."
        : band === "Moderate"
          ? "Use seasonal cleaning schedules, compare inverter underperformance against aerosol windows, and monitor pyranometer drift."
          : "Keep baseline monitoring active and focus operational effort on availability, grid constraints, and preventive maintenance.";

    const commercial =
      band === "High"
        ? "Add aerosol and soiling buffers to P50/P90 cases, revisit warranty assumptions, and price recovery capex into bids."
        : band === "Moderate"
          ? "Use mid-range loss assumptions, validate with site data before financial close, and quantify upside from mitigation."
          : "Standard assumptions are likely adequate, with periodic validation for seasonal variance and local pollution events.";

    return { avgImpact, avgGhi, recoveryOpportunity, riskScore, band, summary, operational, commercial };
  }, [rows]);

  const riskTone =
    content.band === "High"
      ? "bg-rose-50 text-rose-700 ring-rose-100"
      : content.band === "Moderate"
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : "bg-emerald-50 text-emerald-700 ring-emerald-100";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 xl:col-span-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Business interpretation</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
              {selectedState === "All" ? "India-wide" : selectedState} Executive Summary
            </h2>
            <p className="mt-1 text-sm text-slate-600">Decision guidance based on the {scopeLabel} slice.</p>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${riskTone}`}>
            {content.band} risk
          </span>
        </div>

        <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {content.summary}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <ScoreCard label="Risk score" value={content.riskScore} tone={riskTone} />
          <ScoreCard label="Recovery opportunity" value={content.recoveryOpportunity} tone="bg-emerald-50 text-emerald-700 ring-emerald-100" />
        </div>

        <Guidance
          icon={<ClipboardCheck size={18} />}
          title="Operational Guidance"
          body={content.operational}
          tone="bg-emerald-50 text-emerald-700"
        />
        <Guidance
          icon={<BriefcaseBusiness size={18} />}
          title="Commercial Guidance"
          body={content.commercial}
          tone="bg-amber-50 text-amber-700"
        />

        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <ShieldAlert size={15} className="text-slate-500" />
          Avg impact {content.avgImpact.toFixed(1)}%, avg GHI {content.avgGhi.toFixed(0)} W/m2.
        </div>
      </div>
    </section>
  );
}

function ScoreCard({ label, value, tone }) {
  return (
    <div className={`rounded-xl px-4 py-3 ring-1 ${tone}`}>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
        <div className="h-full rounded-full bg-current" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Guidance({ icon, title, body, tone }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className={`rounded-lg p-2 ${tone}`}>{icon}</span>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

export default memo(BusinessInterpretationPanel);
