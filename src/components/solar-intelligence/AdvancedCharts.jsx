import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import {
  CHART_COLORS,
  DEFAULT_RADAR_STATES,
  GHI_SCALE,
  METRIC_COLORS,
  RADAR_PALETTE,
  RISK_COLORS,
} from "../../utils/solarIntelligence/constants";
import { ghiToColor } from "../../utils/solarIntelligence/compute";
import { formatGhi, formatMu, formatPercent } from "../../utils/solarIntelligence/format";
import { getChartTheme } from "../../utils/solarIntelligence/theme";
import { ChartCard, InterpretationNote, SectionHeading } from "./ui";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function StateMonthHeatmap({ heatmapData, dark }) {
  const states = useMemo(() => [...new Set(heatmapData.map((d) => d.state))].sort(), [heatmapData]);
  const matrix = useMemo(() => {
    const map = new Map();
    heatmapData.forEach((d) => map.set(`${d.state}-${d.month}`, d.ghi));
    return map;
  }, [heatmapData]);

  return (
    <ChartCard dark={dark}>
      <SectionHeading
        eyebrow="Temporal resource"
        title="State × Month GHI Intensity Matrix"
        subtitle="Where and when is solar resource strongest?"
        conclusion="Seasonally adjusted from annual state baselines — identifies monsoon depression and pre-summer peaks for O&M planning."
        dark={dark}
      />
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid gap-0.5" style={{ gridTemplateColumns: `100px repeat(${MONTHS_SHORT.length}, 1fr)` }}>
            <div />
            {MONTHS_SHORT.map((m) => (
              <div key={m} className={`pb-1 text-center text-[10px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>
                {m}
              </div>
            ))}
            {states.map((state) => (
              <React.Fragment key={state}>
                <div className={`truncate pr-2 text-[10px] font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
                  {state}
                </div>
                {MONTHS_SHORT.map((month) => {
                  const ghi = matrix.get(`${state}-${month}`) ?? 0;
                  return (
                    <div
                      key={`${state}-${month}`}
                      title={`${state} ${month}: ${ghi.toFixed(2)}`}
                      className="aspect-square min-h-[22px] rounded-sm transition hover:ring-2 hover:ring-[#D55E00]"
                      style={{ backgroundColor: ghiToColor(ghi, GHI_SCALE) }}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

export function InvestmentBubbleChart({ states, dark }) {
  const theme = getChartTheme(dark);

  return (
    <ChartCard dark={dark}>
      <SectionHeading
        eyebrow="Capital allocation"
        title="Readiness vs Investment Opportunity"
        subtitle="Which states offer scale with acceptable risk?"
        conclusion="Bubble area ∝ generation (MU); colour = composite risk band."
        benchmark="X: readiness % · Y: opportunity gap (readiness − adoption)"
        dark={dark}
      />
      <div className="mt-4 h-[380px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ScatterChart margin={{ top: 16, right: 24, bottom: 40, left: 8 }}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="readiness"
              name="Readiness"
              tick={{ fill: theme.axis, fontSize: 11 }}
              label={{ value: "Readiness %", position: "insideBottom", offset: -20, fill: theme.label, fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="opportunityIndex"
              name="Opportunity"
              tick={{ fill: theme.axis, fontSize: 11 }}
              label={{ value: "Opportunity gap", angle: -90, position: "insideLeft", fill: theme.label, fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="generation" range={[40, 400]} />
            <Tooltip
              contentStyle={theme.tooltip}
              formatter={(value, name) => {
                if (name === "generation") return [formatMu(value), "Generation"];
                if (name === "readiness") return [formatPercent(value), "Readiness"];
                return [value, "Opportunity gap"];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.state}
            />
            <Scatter data={states} shape={(props) => {
              const color = RISK_COLORS[props.payload.riskBand] || METRIC_COLORS.opportunity;
              return <circle cx={props.cx} cy={props.cy} r={props.size / 12} fill={color} fillOpacity={0.75} stroke="#fff" strokeWidth={1} />;
            }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function RegionalTreemap({ rows, totalGeneration, dark }) {
  const theme = getChartTheme(dark);
  const data = rows.map((r) => ({
    name: r.region,
    generation: r.generation,
    avgGhi: r.avgGhi,
    readiness: r.readiness,
    adoption: r.adoption,
    states: r.states,
    sharePct: ((r.generation / totalGeneration) * 100).toFixed(1),
  }));

  return (
    <ChartCard dark={dark}>
      <SectionHeading
        eyebrow="Regional portfolio"
        title="Regional Generation Distribution"
        subtitle="What share of national output does each region contribute?"
        conclusion="Tile area ∝ generation (MU); fill color encodes average regional GHI."
        benchmark={`National generation: ${formatMu(totalGeneration)}`}
        dark={dark}
      />
      <div className="mt-4 h-[340px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <Treemap
            data={data}
            dataKey="generation"
            nameKey="name"
            stroke={dark ? "#1e293b" : "#fff"}
            content={<TreemapCell dark={dark} />}
          >
            <Tooltip content={<RegionalTreemapTooltip dark={dark} />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
      <InterpretationNote dark={dark}>
        Larger tiles indicate deployment concentration — West and South typically dominate. Hover for readiness, adoption, and
        national contribution percentage.
      </InterpretationNote>
    </ChartCard>
  );
}

function RegionalTreemapTooltip({ active, payload, dark }) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  return (
    <div className={`rounded-lg border p-3 text-xs shadow-lg ${dark ? "border-slate-600 bg-slate-900" : "border-slate-200 bg-white"}`}>
      <p className="text-sm font-bold">{p.name}</p>
      <p style={{ color: METRIC_COLORS.ghi }}>Avg GHI: {formatGhi(p.avgGhi)}</p>
      <p style={{ color: METRIC_COLORS.generation }}>Generation: {formatMu(p.generation)}</p>
      <p style={{ color: METRIC_COLORS.readiness }}>Readiness: {formatPercent(p.readiness)}</p>
      <p style={{ color: METRIC_COLORS.adoption }}>Adoption: {formatPercent(p.adoption)}</p>
      <p className="mt-1 font-semibold" style={{ color: METRIC_COLORS.opportunity }}>
        National share: {p.sharePct}%
      </p>
      <p className="text-slate-500">{p.states} states in region</p>
    </div>
  );
}

function TreemapCell({ x, y, width, height, name, generation, avgGhi, sharePct, dark }) {
  if (width < 4 || height < 4) return null;
  const fill = ghiToColor(avgGhi, GHI_SCALE);
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke={dark ? "#0f172a" : "#fff"} strokeWidth={2} rx={4} />
      {width > 56 && height > 32 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>
            {name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize={9}>
            {sharePct}% · {formatMu(generation)}
          </text>
        </>
      )}
    </g>
  );
}

const RADAR_METRICS = ["GHI", "Generation", "Readiness", "Adoption", "Opportunity"];

function normalizeForRadar(state) {
  return {
    GHI: Math.min(100, (state.ghi / 6.6) * 100),
    Generation: Math.min(100, (state.generation / 70000) * 100),
    Readiness: state.readiness,
    Adoption: state.adoption,
    Opportunity: Math.min(100, state.opportunityIndex * 4),
  };
}

export function StatePerformanceRadar({ states, selectedState, dark }) {
  const theme = getChartTheme(dark);
  const [mode, setMode] = useState("multi");
  const [picked, setPicked] = useState(() => DEFAULT_RADAR_STATES);

  const singleTarget =
    selectedState && selectedState !== "All States" ? selectedState : "Rajasthan";

  const stateMap = useMemo(() => {
    const m = new Map();
    states.forEach((s) => m.set(s.state, s));
    return m;
  }, [states]);

  const compareStates = useMemo(() => {
    if (mode === "single") {
      const s = stateMap.get(singleTarget) || states.find((row) => row.state === "Rajasthan");
      return s ? [s] : [];
    }
    return picked.map((name) => stateMap.get(name)).filter(Boolean);
  }, [mode, picked, singleTarget, stateMap, states]);

  const radarData = useMemo(() => {
    return RADAR_METRICS.map((metric) => {
      const row = { metric };
      compareStates.forEach((s) => {
        row[s.state] = normalizeForRadar(s)[metric];
      });
      return row;
    });
  }, [compareStates]);

  const toggleState = (name) => {
    setPicked((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name].slice(0, 6)));
  };

  return (
    <ChartCard dark={dark} compact>
      <SectionHeading
        eyebrow="Comparative analysis"
        title="State Performance Radar"
        subtitle="Compare representative states across five normalized dimensions"
        conclusion="Scores are index-normalized (0–100) for cross-state comparison — not raw units."
        dark={dark}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <ModeBtn active={mode === "single"} onClick={() => setMode("single")} dark={dark}>
          Single ({singleTarget})
        </ModeBtn>
        <ModeBtn active={mode === "multi"} onClick={() => setMode("multi")} dark={dark}>
          Multi-state compare
        </ModeBtn>
      </div>
      {mode === "multi" && (
        <div className="mt-2 flex flex-wrap gap-1">
          {DEFAULT_RADAR_STATES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => toggleState(name)}
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition ${
                picked.includes(name)
                  ? "bg-[#EA580C] text-white"
                  : dark
                    ? "bg-slate-700 text-slate-400"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      <div className="mt-3 h-[340px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke={theme.grid} />
            <PolarAngleAxis dataKey="metric" tick={{ fill: theme.axis, fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: theme.axis, fontSize: 9 }} />
            <Tooltip contentStyle={theme.tooltip} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {compareStates.map((s, i) => (
              <Radar
                key={s.state}
                name={s.state}
                dataKey={s.state}
                stroke={RADAR_PALETTE[i % RADAR_PALETTE.length]}
                fill={RADAR_PALETTE[i % RADAR_PALETTE.length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <InterpretationNote dark={dark}>
        {mode === "multi"
          ? "Multi-state view highlights structural differences: e.g. high GHI with low adoption (investment target) vs balanced profiles (Southern leaders)."
          : `Single-state profile for ${compareStates[0]?.state || "—"} — compare against multi-state view for benchmarking.`}
      </InterpretationNote>
    </ChartCard>
  );
}

function ModeBtn({ active, onClick, children, dark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
        active
          ? "border-[#EA580C] bg-[#EA580C]/10 text-[#EA580C]"
          : dark
            ? "border-slate-600 text-slate-400"
            : "border-slate-200 text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

const QUADRANT_COLORS = {
  "High Readiness / Low Adoption": "#CC79A7",
  "Low Readiness / High Resource": "#E69F00",
  "Policy & Grid Build-out": "#0072B2",
  "Mature Market": "#009E73",
  Balanced: "#94A3B8",
};

export function PolicyPriorityMatrix({ policyRows, dark }) {
  const theme = getChartTheme(dark);

  return (
    <ChartCard dark={dark}>
      <SectionHeading
        eyebrow="Policy intervention"
        title="Priority matrix"
        conclusion="Classifies states for MNRE / state nodal agency intervention design."
        dark={dark}
      />
      <div className="mt-4 h-[360px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ScatterChart margin={{ top: 16, right: 16, bottom: 40, left: 8 }}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" />
            <XAxis type="number" dataKey="readiness" domain={[20, 100]} tick={{ fill: theme.axis, fontSize: 11 }} name="Readiness" />
            <YAxis type="number" dataKey="ghi" domain={[4, 7]} tick={{ fill: theme.axis, fontSize: 11 }} name="GHI" />
            <ZAxis range={[50, 50]} />
            <Tooltip contentStyle={theme.tooltip} labelFormatter={(_, p) => p?.[0]?.payload?.state} />
            <Scatter data={policyRows} shape={(props) => (
              <circle
                cx={props.cx}
                cy={props.cy}
                r={6}
                fill={QUADRANT_COLORS[props.payload.quadrant] || "#94a3b8"}
                stroke="#fff"
                strokeWidth={1.5}
              />
            )} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.entries(QUADRANT_COLORS).map(([label, color]) => (
          <span key={label} className="inline-flex items-center gap-1.5 text-[10px] font-medium">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>
    </ChartCard>
  );
}

/** @deprecated Use ExecutiveSummaryPanel — kept for lazy import compatibility */
export function NationalScorecard() {
  return null;
}
