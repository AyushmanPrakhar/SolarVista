import { Brain, FileText, Gauge, Shield, Sparkles, Sun, Target, TrendingUp, Wallet } from "lucide-react";

import { formatGhi, formatMu, formatPercent } from "../../utils/solarIntelligence/format";
import { ALL_STATES } from "../../utils/solarIntelligence/constants";
import { cardClass, MetricRow, SectionHeading } from "./ui";

const INSIGHT_ICONS = {
  resource: Sun,
  investment: Wallet,
  policy: FileText,
  risk: Shield,
  commercial: TrendingUp,
};

export function ExecutiveInsightsList({ insights, dark }) {
  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Research synthesis"
        title="National Solar Intelligence — Analytical Conclusions"
        subtitle="Evidence-based findings for policy and investment committees"
        dark={dark}
      />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {insights.map((insight, index) => (
          <div
            key={insight}
            className={`rounded-lg border p-3 transition hover:-translate-y-0.5 ${
              dark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-lg p-1.5 ${dark ? "bg-slate-700" : "bg-white ring-1 ring-slate-200"}`}>
                <Brain size={14} className="text-[#D55E00]" />
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Insight {index + 1}</p>
            </div>
            <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>{insight}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StateExecutiveInsights({ insights, stateName, dark }) {
  const blocks = [
    ["resource", "Resource insight", insights.resource],
    ["investment", "Investment insight", insights.investment],
    ["policy", "Policy insight", insights.policy],
    ["risk", "Risk insight", insights.risk],
    ["commercial", "Commercial insight", insights.commercial],
  ];

  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="State intelligence"
        title={`${stateName} — executive brief`}
        conclusion="Personalized analytics for stakeholder presentations and state nodal agency action plans."
        dark={dark}
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {blocks.map(([key, title, body]) => {
          const Icon = INSIGHT_ICONS[key] || Sparkles;
          return (
            <div
              key={key}
              className={`rounded-lg border p-3 ${dark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={15} className="text-[#D55E00]" />
                <p className={`text-xs font-semibold ${dark ? "text-slate-200" : "text-slate-900"}`}>{title}</p>
              </div>
              <p className={`mt-2 text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>{body}</p>
            </div>
          );
        })}
      </div>
      <div className={`mt-4 rounded-lg border p-3 ${dark ? "border-amber-900/50 bg-amber-950/30" : "border-amber-200 bg-amber-50"}`}>
        <p className={`text-xs font-semibold uppercase ${dark ? "text-amber-300" : "text-amber-800"}`}>Actionable recommendations</p>
        <ul className={`mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed ${dark ? "text-amber-100/90" : "text-amber-900"}`}>
          {insights.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function StateIntelligencePanel({ metric, selectedState, hoveredState, dark }) {
  return (
    <section className={`${cardClass(dark)} xl:sticky xl:top-4`}>
      <SectionHeading
        eyebrow="State panel"
        title={metric.state}
        conclusion={
          selectedState === ALL_STATES && !hoveredState
            ? "National leader context until a state is selected."
            : "Selection drives map, charts, and insights below."
        }
        dark={dark}
      />
      <div className="mt-4 space-y-3">
        <MetricBlock title="Resource" icon={Sun} dark={dark}>
          <MetricRow label="GHI" value={formatGhi(metric.ghi)} dark={dark} />
          <MetricRow label="Generation" value={formatMu(metric.generation)} dark={dark} />
        </MetricBlock>
        <MetricBlock title="Market" icon={Gauge} dark={dark}>
          <MetricRow label="Readiness" value={`${formatPercent(metric.readiness)} (${metric.readinessBand})`} dark={dark} />
          <MetricRow label="Adoption" value={`${formatPercent(metric.adoption)} (${metric.adoptionBand})`} dark={dark} />
        </MetricBlock>
        <MetricBlock title="Investment" icon={Target} dark={dark}>
          <MetricRow label="Opportunity" value={`${metric.opportunityIndex} (${metric.opportunityBand})`} dark={dark} />
          <MetricRow label="Risk" value={`${metric.riskScore}/100`} dark={dark} />
          <MetricRow label="Investment score" value={`${metric.investmentScore}/100`} dark={dark} />
        </MetricBlock>
      </div>
      <p className={`mt-4 rounded-lg p-3 text-xs leading-relaxed ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-700"}`}>
        {metric.strategy}
      </p>
    </section>
  );
}

function MetricBlock({ title, icon: Icon, children, dark }) {
  return (
    <div className={`rounded-lg border p-3 ${dark ? "border-slate-700 bg-slate-800/40" : "border-slate-200 bg-white"}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={15} className="text-[#D55E00]" />
        <p className={`text-xs font-semibold ${dark ? "text-slate-200" : "text-slate-900"}`}>{title}</p>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
