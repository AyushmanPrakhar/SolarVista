import { METRIC_COLORS } from "../../utils/solarIntelligence/constants";
import { formatGhi, formatMu } from "../../utils/solarIntelligence/format";
import { cardClass, SectionHeading } from "./ui";

const QUADRANT_META = {
  Leaders: {
    color: METRIC_COLORS.adoption,
    desc: "High readiness · High adoption — mature, bankable markets",
  },
  "Investment Targets": {
    color: METRIC_COLORS.opportunity,
    desc: "High readiness · Low adoption — priority capital deployment",
  },
  "Policy Focus": {
    color: METRIC_COLORS.readiness,
    desc: "Low readiness · Low adoption — grid and policy build-out",
  },
  "Emerging Markets": {
    color: METRIC_COLORS.generation,
    desc: "Moderate opportunity — selective utility-scale entry",
  },
};

export default function InvestmentOpportunityPanel({ quadrants, onSelectState, selectedState, dark }) {
  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Investment classification"
        title="Solar Investment Opportunity Matrix"
        subtitle="Where should capital and policy interventions be directed?"
        conclusion="States grouped by readiness–adoption positioning relative to national thresholds (60% / 55%)."
        benchmark="Readiness ≥60% · Adoption ≥55%"
        dark={dark}
      />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {Object.entries(quadrants).map(([name, list]) => {
          const meta = QUADRANT_META[name];
          return (
            <div
              key={name}
              className={`rounded-lg border p-3 ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"}`}
              style={{ borderTopWidth: 3, borderTopColor: meta.color }}
            >
              <h3 className="text-sm font-semibold" style={{ color: meta.color }}>
                {name}
              </h3>
              <p className={`mt-0.5 text-[11px] ${dark ? "text-slate-500" : "text-slate-500"}`}>{meta.desc}</p>
              <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto">
                {list.slice(0, 8).map((row) => (
                  <li key={row.state}>
                    <button
                      type="button"
                      onClick={() => onSelectState(row.state)}
                      className={`w-full rounded px-2 py-1 text-left text-xs transition ${
                        selectedState === row.state
                          ? "bg-[#EA580C]/15 font-semibold text-[#EA580C]"
                          : dark
                            ? "text-slate-300 hover:bg-slate-700"
                            : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-medium">{row.state}</span>
                      <span className={`ml-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        {formatGhi(row.ghi)} · {formatMu(row.generation)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {list.length > 8 && (
                <p className={`mt-1 text-[10px] ${dark ? "text-slate-600" : "text-slate-400"}`}>+{list.length - 8} more</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
