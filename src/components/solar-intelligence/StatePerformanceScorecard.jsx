import React, { useMemo } from "react";

import { buildStateScorecard } from "../../utils/solarIntelligence/percentiles";
import { ALL_STATES } from "../../utils/solarIntelligence/constants";
import { cardClass, SectionHeading } from "./ui";

export default function StatePerformanceScorecard({ states, state, selectedState, nationalSummary, dark }) {
  const focus =
    selectedState !== ALL_STATES ? state : states.find((s) => s.state === "Rajasthan") || state;

  const cards = useMemo(
    () => buildStateScorecard(focus, states, nationalSummary),
    [focus, states, nationalSummary]
  );

  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Performance profile"
        title={`${focus.state} — performance scorecard`}
        subtitle="National percentile ranking by dimension (higher is stronger)"
        conclusion="Percentiles translate raw metrics into peer context—more intuitive than radar geometry for executive and academic audiences."
        dark={dark}
      />

      <div className="mt-4 space-y-4">
        {cards.map((card) => (
          <div key={card.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold" style={{ color: card.color }}>
                {card.label}
              </span>
              <span className={dark ? "text-slate-300" : "text-slate-700"}>
                {card.display}
                <span className={`ml-2 text-xs ${dark ? "text-slate-500" : "text-slate-500"}`}>
                  vs {card.nationalDisplay} national
                </span>
              </span>
            </div>
            <div className={`h-2.5 overflow-hidden rounded-full ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${card.percentile}%`, backgroundColor: card.color }}
              />
            </div>
            <p className={`mt-1 text-xs ${dark ? "text-slate-500" : "text-slate-500"}`}>
              {card.percentile}th percentile nationally · Rank #{card.rank}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
