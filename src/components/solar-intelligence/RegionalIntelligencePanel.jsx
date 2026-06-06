import { METRIC_COLORS } from "../../utils/solarIntelligence/constants";
import { formatGhi, formatMu, formatNumber, formatPercent } from "../../utils/solarIntelligence/format";
import { cardClass, SectionHeading } from "./ui";

export default function RegionalIntelligencePanel({ rows, totalGeneration, dark }) {
  const leader = rows[0];
  const laggard = [...rows].sort((a, b) => a.adoption - b.adoption)[0];

  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Regional analysis"
        title="Regional solar intelligence"
        subtitle="How do India's macro-regions compare on resource, output, and market maturity?"
        conclusion="Aggregating states surfaces patterns that state-level views can miss—particularly for North-East and Central planning."
        dark={dark}
      />

      <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>
        {leader?.region} leads on combined generation ({formatMu(leader?.generation)}), while {laggard?.region} remains
        the weakest on adoption ({formatPercent(laggard?.adoption)}). Regional strategy should follow resource quality,
        but execution capacity and DISCOM performance increasingly determine outcomes.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => {
          const share = ((row.generation / totalGeneration) * 100).toFixed(1);
          return (
            <div
              key={row.region}
              className={`rounded-lg border p-4 transition hover:-translate-y-0.5 ${
                dark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-white shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>
                  {row.region}
                </h3>
                <span className="text-xs font-bold" style={{ color: METRIC_COLORS.generation }}>
                  {share}% of output
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <Metric label="Avg GHI" value={formatGhi(row.avgGhi)} color={METRIC_COLORS.ghi} />
                <Metric label="Generation" value={formatMu(row.generation)} color={METRIC_COLORS.generation} />
                <Metric label="Readiness" value={formatPercent(row.readiness)} color={METRIC_COLORS.readiness} />
                <Metric label="Adoption" value={formatPercent(row.adoption)} color={METRIC_COLORS.adoption} />
                <Metric label="Opportunity" value={row.opportunity.toFixed(1)} color={METRIC_COLORS.opportunity} />
                <Metric label="States" value={formatNumber(row.states)} color={METRIC_COLORS.neutral} />
              </dl>
              <p className={`mt-3 text-[11px] leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
                {row.interpretation}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Metric({ label, value, color }) {
  return (
    <>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold" style={{ color }}>
        {value}
      </dd>
    </>
  );
}
