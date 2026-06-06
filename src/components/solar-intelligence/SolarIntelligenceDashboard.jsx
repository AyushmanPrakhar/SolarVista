import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Building2, Download, FileDown, Moon, Share2 } from "lucide-react";

import ghiData from "../../data/indiaGhiData";
import { ALL_STATES } from "../../utils/solarIntelligence/constants";
import {
  buildExecutiveIntelligence,
  buildNationalNarrative,
} from "../../utils/solarIntelligence/analytics";
import {
  buildNationalSummary,
  buildRegionalRows,
  enrichState,
  getTopBy,
  normalizeStateName,
} from "../../utils/solarIntelligence/compute";
import {
  exportCsv,
  exportDashboardSnapshot,
  exportExecutivePdf,
  downloadText,
} from "../../utils/solarIntelligence/export";
import { formatGhi, formatNumber } from "../../utils/solarIntelligence/format";
import { KpiCard, ChartSkeleton } from "./ui";
import ExecutiveIntelligenceCenter from "./ExecutiveIntelligenceCenter";
import VisualRankingPanels from "./VisualRankingPanels";
import QuadrantPositioningChart from "./QuadrantPositioningChart";
import StateComparisonStudio from "./StateComparisonStudio";
import StatePerformanceScorecard from "./StatePerformanceScorecard";
import SeasonalExplorer from "./SeasonalExplorer";
import RegionalIntelligencePanel from "./RegionalIntelligencePanel";

const RegionalGroupedChart = lazy(() =>
  import("./CoreCharts").then((m) => ({ default: m.RegionalGroupedChart }))
);

function ChartFallback({ height = 360 }) {
  return <ChartSkeleton height={height} />;
}

export default function SolarIntelligenceDashboard() {
  const rootRef = useRef(null);
  const [dark, setDark] = useState(() => localStorage.getItem("solar-intel-theme") === "dark");
  const [selectedState, setSelectedState] = useState(ALL_STATES);

  useEffect(() => {
    localStorage.setItem("solar-intel-theme", dark ? "dark" : "light");
  }, [dark]);

  const states = useMemo(() => ghiData.map(enrichState), []);
  const dataByState = useMemo(() => {
    const map = new Map();
    states.forEach((row) => map.set(normalizeStateName(row.state), row));
    return map;
  }, [states]);

  const selectedMetric = selectedState === ALL_STATES ? null : dataByState.get(normalizeStateName(selectedState));
  const activeMetric = selectedMetric || getTopBy(states, "ghi");
  const nationalSummary = useMemo(() => buildNationalSummary(states), [states]);
  const regionalRows = useMemo(() => buildRegionalRows(states), [states]);
  const executiveItems = useMemo(
    () => buildExecutiveIntelligence(states, regionalRows, nationalSummary),
    [states, regionalRows, nationalSummary]
  );
  const nationalNarrative = useMemo(
    () => buildNationalNarrative(states, regionalRows, nationalSummary),
    [states, regionalRows, nationalSummary]
  );

  const handleSelectState = (state) => setSelectedState(state);

  const exportReport = () => {
    const body = [
      "SolarVista — Solar Resource Intelligence",
      "",
      ...executiveItems.map(
        (item) =>
          `${item.title}\nWhat: ${item.what}\nWhy: ${item.why}\nSignificance: ${item.significance}\n`
      ),
      "",
      "National narrative:",
      ...nationalNarrative,
    ].join("\n\n");
    downloadText("solar-intelligence-brief.txt", body);
  };

  const shell = dark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900";

  return (
    <div ref={rootRef} className={`solar-intelligence-dashboard space-y-5 pb-8 ${shell}`}>
      <header
        className={`rounded-xl border p-4 sm:p-6 ${
          dark ? "border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950" : "border-slate-200 bg-white shadow-sm"
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#C2410C]">
              Solar Resource Intelligence
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              India Solar Market Intelligence
            </h1>
            <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>
              A decision-support view for researchers, consultants, and public agencies. Each section states what the
              data shows, why it matters, and where attention should flow next.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ToolbarButton icon={Download} label="Export data" onClick={() => exportCsv(states)} dark={dark} />
            <ToolbarButton icon={FileDown} label="Print / PDF" onClick={exportExecutivePdf} dark={dark} />
            <ToolbarButton icon={Share2} label="Snapshot" onClick={() => exportDashboardSnapshot(rootRef.current)} dark={dark} />
            <ToolbarButton icon={Building2} label="Brief" onClick={exportReport} dark={dark} />
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold ${
                dark ? "border-slate-600 bg-slate-800 text-slate-200" : "border-slate-200 bg-white"
              }`}
            >
              <Moon size={14} />
              {dark ? "Light" : "Dark"}
            </button>
            {selectedState !== ALL_STATES && (
              <button
                type="button"
                onClick={() => setSelectedState(ALL_STATES)}
                className="rounded-lg border border-[#C2410C]/50 px-3 py-2 text-xs font-semibold text-[#C2410C]"
              >
                Clear focus
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="National mean GHI"
            value={nationalSummary.avgGhi.toFixed(2)}
            unit="kWh/m²/day"
            helper={`${states.filter((s) => s.ghi >= 5.5).length} states above 5.5`}
            dark={dark}
          />
          <KpiCard
            label="Aggregate generation"
            value={formatNumber(nationalSummary.totalGeneration)}
            unit="MU (tracked states)"
            helper={`Leader: ${getTopBy(states, "generation").state}`}
            dark={dark}
          />
          <KpiCard
            label="Readiness–adoption gap"
            value={(nationalSummary.avgReadiness - nationalSummary.avgAdoption).toFixed(1)}
            unit="points nationally"
            helper="Latent capacity indicator"
            dark={dark}
          />
          <KpiCard
            label="In focus"
            value={activeMetric.state}
            unit={formatGhi(activeMetric.ghi)}
            helper={selectedState !== ALL_STATES ? "Filtering active" : "Click any chart bar or point"}
            dark={dark}
          />
        </div>
      </header>

      <ExecutiveIntelligenceCenter items={executiveItems} dark={dark} />

      <VisualRankingPanels
        states={states}
        nationalSummary={nationalSummary}
        selectedState={selectedState}
        onSelectState={handleSelectState}
        dark={dark}
      />

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <QuadrantPositioningChart
          states={states}
          nationalSummary={nationalSummary}
          selectedState={selectedState}
          onSelectState={handleSelectState}
          dark={dark}
        />
        <StatePerformanceScorecard
          states={states}
          state={activeMetric}
          selectedState={selectedState}
          nationalSummary={nationalSummary}
          dark={dark}
        />
      </div>

      <StateComparisonStudio states={states} dark={dark} />

      <RegionalIntelligencePanel rows={regionalRows} totalGeneration={nationalSummary.totalGeneration} dark={dark} />

      <Suspense fallback={<ChartFallback height={400} />}>
        <RegionalGroupedChart rows={regionalRows} dark={dark} />
      </Suspense>

      <SeasonalExplorer states={states} dark={dark} />

      <NationalNarrative prose={nationalNarrative} dark={dark} />
    </div>
  );
}

function NationalNarrative({ prose, dark }) {
  return (
    <section
      className={`rounded-xl border p-5 sm:p-6 ${
        dark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white"
      }`}
    >
      <h2 className={`text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
        National synthesis
      </h2>
      <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
        Closing view for research papers, committee packs, and investor memos.
      </p>
      <div className={`mt-4 space-y-4 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>
        {prose.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function ToolbarButton({ icon: Icon, label, onClick, dark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:-translate-y-0.5 ${
        dark ? "border-slate-600 bg-slate-800 text-slate-200" : "border-slate-200 bg-white text-slate-700 shadow-sm"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
