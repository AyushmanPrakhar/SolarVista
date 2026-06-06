import { METRIC_COLORS } from "../../utils/solarIntelligence/constants";
import { cardClass, SectionHeading } from "./ui";

const ACCENTS = {
  "Top Solar Resource": METRIC_COLORS.ghi,
  "Top Generation": METRIC_COLORS.generation,
  "Highest Opportunity": METRIC_COLORS.opportunity,
  "Best Adoption": METRIC_COLORS.adoption,
  "Best Readiness": METRIC_COLORS.readiness,
  "Most Underutilized": METRIC_COLORS.risk,
  "Growth Potential Region": METRIC_COLORS.opportunity,
  "Policy Priority Region": METRIC_COLORS.readiness,
};

export default function ExecutiveIntelligenceCenter({ items, dark }) {
  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Executive intelligence center"
        title="National solar decision brief"
        subtitle="What matters now, why it matters, and what it means for policy and capital"
        dark={dark}
      />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.title}
            className={`rounded-lg border p-4 ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-slate-50/90"}`}
            style={{ borderTopWidth: 3, borderTopColor: ACCENTS[item.title] || METRIC_COLORS.ghi }}
          >
            <header>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{item.title}</p>
              <p className={`mt-1 text-xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{item.value}</p>
              <p className="text-sm font-medium" style={{ color: ACCENTS[item.title] }}>
                {item.metric}
              </p>
            </header>
            <div className={`mt-3 space-y-2 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>
              <p>
                <span className="font-semibold text-slate-500">What: </span>
                {item.what}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Why: </span>
                {item.why}
              </p>
              <p>
                <span className="font-semibold text-slate-500">Significance: </span>
                {item.significance}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
