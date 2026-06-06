import React, { useMemo } from "react";
import {
  CartesianGrid,
  Label,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import {
  ADOPTION_THRESHOLD,
  LABEL_STATES,
  METRIC_COLORS,
  QUADRANT_THEME,
  READINESS_THRESHOLD,
} from "../../utils/solarIntelligence/constants";
import { buildQuadrantSummary } from "../../utils/solarIntelligence/analytics";
import { buildMatrixRows } from "../../utils/solarIntelligence/compute";
import { getChartTheme } from "../../utils/solarIntelligence/theme";
import RichStateTooltip from "./RichStateTooltip";
import { cardClass, InterpretationNote, SectionHeading } from "./ui";

const HEIGHT = 500;

export default function QuadrantPositioningChart({ states, nationalSummary, selectedState, onSelectState, dark }) {
  const theme = getChartTheme(dark);
  const matrix = useMemo(() => buildMatrixRows(states), [states]);
  const summary = useMemo(() => buildQuadrantSummary(states), [states]);

  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Market maturity"
        title="Readiness vs adoption positioning"
        subtitle="Which states are ready to scale, and which require policy intervention?"
        conclusion="Thresholds at 60% readiness and 55% adoption. Only major states are labelled on-chart; all others appear on hover."
        dark={dark}
      />

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(QUADRANT_THEME).map(([key, meta]) => (
          <div
            key={key}
            className={`rounded-lg border-l-4 p-2.5 ${dark ? "bg-slate-800/60" : "bg-white"}`}
            style={{ borderLeftColor: meta.color }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{meta.label}</p>
            <p className="text-2xl font-bold" style={{ color: meta.color }}>
              {summary.counts[key]}
            </p>
            <p className="text-[10px] text-slate-500">states</p>
          </div>
        ))}
      </div>

      <div className="relative mt-4" style={{ height: HEIGHT }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ScatterChart margin={{ top: 28, right: 24, bottom: 52, left: 16 }}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
            <ReferenceArea x1={READINESS_THRESHOLD} x2={100} y1={ADOPTION_THRESHOLD} y2={100} fill={QUADRANT_THEME.Leaders.fill} strokeOpacity={0} />
            <ReferenceArea x1={READINESS_THRESHOLD} x2={100} y1={20} y2={ADOPTION_THRESHOLD} fill={QUADRANT_THEME["Investment Targets"].fill} strokeOpacity={0} />
            <ReferenceArea x1={20} x2={READINESS_THRESHOLD} y1={20} y2={ADOPTION_THRESHOLD} fill={QUADRANT_THEME["Policy Focus"].fill} strokeOpacity={0} />
            <ReferenceArea x1={20} x2={READINESS_THRESHOLD} y1={ADOPTION_THRESHOLD} y2={100} fill={QUADRANT_THEME["Emerging Markets"].fill} strokeOpacity={0} />
            <XAxis
              type="number"
              dataKey="readiness"
              domain={[25, 100]}
              tick={{ fill: theme.axis, fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            >
              <Label value="Market readiness (%)" position="bottom" offset={24} fill={METRIC_COLORS.readiness} fontSize={12} fontWeight={600} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="adoption"
              domain={[20, 100]}
              tick={{ fill: theme.axis, fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            >
              <Label value="Market adoption (%)" angle={-90} position="insideLeft" fill={METRIC_COLORS.adoption} fontSize={12} fontWeight={600} />
            </YAxis>
            <ZAxis range={[48, 48]} />
            <ReferenceLine x={READINESS_THRESHOLD} stroke={METRIC_COLORS.readiness} strokeDasharray="5 5" />
            <ReferenceLine y={ADOPTION_THRESHOLD} stroke={METRIC_COLORS.adoption} strokeDasharray="5 5" />
            <Tooltip
              content={
                <RichStateTooltip states={states} nationalSummary={nationalSummary} metricKey="readiness" dark={dark} />
              }
            />
            <Scatter
              data={matrix.states}
              onClick={(p) => onSelectState(p.state)}
              shape={(props) => {
                const isLabel = LABEL_STATES.includes(props.payload.state);
                const active = props.payload.state === selectedState;
                return (
                  <g>
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={active ? 9 : isLabel ? 7 : 5}
                      fill={active ? METRIC_COLORS.ghi : METRIC_COLORS.opportunity}
                      fillOpacity={isLabel ? 0.95 : 0.65}
                      stroke="#fff"
                      strokeWidth={1.5}
                      style={{ cursor: "pointer" }}
                    />
                    {isLabel && (
                      <text x={props.cx} y={props.cy - 11} textAnchor="middle" fontSize={10} fontWeight={600} fill={dark ? "#e2e8f0" : "#334155"}>
                        {props.payload.state.length > 14 ? props.payload.state.split(" ")[0] : props.payload.state}
                      </text>
                    )}
                  </g>
                );
              }}
            />
            <Scatter
              data={matrix.trendline}
              line={{ stroke: METRIC_COLORS.neutral, strokeWidth: 2, strokeDasharray: "6 4" }}
              shape={() => null}
              legendType="line"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <InterpretationNote dark={dark} variant="insight">
        {summary.interpretation}
      </InterpretationNote>
    </section>
  );
}
