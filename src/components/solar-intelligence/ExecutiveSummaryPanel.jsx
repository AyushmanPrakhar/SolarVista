import { METRIC_COLORS } from "../../utils/solarIntelligence/constants";
import { cardClass, SectionHeading } from "./ui";

const ACCENT = {
  "Top Resource State": METRIC_COLORS.ghi,
  "Top Generation State": METRIC_COLORS.generation,
  "Highest Investment Opportunity": METRIC_COLORS.opportunity,
  "Best Adoption State": METRIC_COLORS.adoption,
  "Best Readiness State": METRIC_COLORS.readiness,
  "Most Underutilized State": METRIC_COLORS.risk,
  "Fastest Growth Potential Region": METRIC_COLORS.opportunity,
  "Policy Priority Region": METRIC_COLORS.readiness,
};

export default function ExecutiveSummaryPanel({ summary, dark }) {
  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Executive intelligence"
        title="National Solar Decision Summary"
        subtitle="What should policymakers, researchers, and investors prioritize immediately?"
        conclusion="Each card synthesizes cross-metric analysis — not raw data restatement."
        dark={dark}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <article
            key={item.title}
            className={`rounded-lg border-l-4 p-3 transition hover:-translate-y-0.5 hover:shadow-md ${
              dark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"
            }`}
            style={{ borderLeftColor: ACCENT[item.title] || METRIC_COLORS.ghi }}
          >
            <p className={`text-[10px] font-semibold uppercase tracking-wide ${dark ? "text-slate-500" : "text-slate-500"}`}>
              {item.title}
            </p>
            <p className={`mt-1 text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{item.value}</p>
            <p className="text-xs font-medium" style={{ color: ACCENT[item.title] }}>
              {item.metric}
            </p>
            <p className={`mt-2 text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
              {item.interpretation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
