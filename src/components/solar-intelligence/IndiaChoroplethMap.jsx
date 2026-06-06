import React, { useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";

import indiaGeo from "../../data/india-light.json";
import { ALL_STATES, GHI_SCALE, stateCentroids } from "../../utils/solarIntelligence/constants";
import { ghiToColor, normalizeStateName } from "../../utils/solarIntelligence/compute";
import { formatGhi, formatMu, formatNumber, formatPercent } from "../../utils/solarIntelligence/format";
import { exportSvgAsPng } from "../../utils/solarIntelligence/export";
import { SectionHeading, cardClass } from "./ui";
import LeafletIndiaChoropleth from "../common/LeafletIndiaChoropleth";

export default function IndiaChoroplethMap({
  dataByState,
  selectedState,
  hoveredState,
  onSelectState,
  onHoverState,
  dark,
}) {
  const mapRef = useRef(null);
  
  const topStates = useMemo(
    () =>
      [...dataByState.values()]
        .sort((a, b) => b.ghi - a.ghi)
        .slice(0, 5),
    [dataByState]
  );

  const exportMap = () => {
    // Note: Leaflet export is complex; for now we preserve the button but mapRef logic might need adjustment
    console.log("Map export requested. Leaflet requires specific plugin for full PNG export.");
  };

  const getTooltipContent = (name, metric) => {
    if (!metric) return `<div class="p-2 font-sans"><div class="font-bold">${name}</div><div class="text-slate-500">No data</div></div>`;
    
    return `
      <div class="p-3 font-sans min-w-[200px] ${dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}">
        <div class="font-bold border-b border-slate-100 pb-2 mb-2 flex items-center justify-between gap-3">
          <span>${metric.state}</span>
          <span class="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-[#D55E00]">
            ${metric.resourceBand}
          </span>
        </div>
        <div class="space-y-1.5">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500">GHI</span>
            <span class="font-bold">${formatGhi(metric.ghi)}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500">Generation</span>
            <span class="font-bold">${formatMu(metric.generation)}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500">Readiness</span>
            <span class="font-bold">${formatPercent(metric.readiness)}</span>
          </div>
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-500">Adoption</span>
            <span class="font-bold">${formatPercent(metric.adoption)}</span>
          </div>
          <div class="flex justify-between items-center text-xs pt-1 border-t border-slate-50 mt-1">
            <span class="text-slate-500">Opportunity</span>
            <span class="font-bold">${formatNumber(metric.opportunityIndex)}</span>
          </div>
        </div>
      </div>
    `;
  };

  return (
    <section className={cardClass(dark)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <SectionHeading
          eyebrow="Geospatial intelligence"
          title="India GHI choropleth"
          conclusion="Stable React-Leaflet implementation. Click a state to filter the platform. Colors encode irradiance."
          dark={dark}
        />
        <div className="flex flex-wrap items-center gap-2">
          <MapControl icon={Download} label="Export" onClick={exportMap} dark={dark} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_200px]">
        <div
          ref={mapRef}
          className={`relative h-[min(72vh,560px)] min-h-[380px] overflow-hidden rounded-xl border ${
            dark ? "border-slate-700 bg-slate-950" : "border-slate-100 bg-slate-50"
          } z-0`}
        >
          <LeafletIndiaChoropleth 
            geoData={indiaGeo}
            dataMap={dataByState}
            getColor={(metric) => metric ? ghiToColor(metric.ghi, GHI_SCALE) : GHI_SCALE.stops[0].color}
            getTooltipContent={getTooltipContent}
            onSelectState={onSelectState}
            onHoverState={onHoverState}
            selectedState={selectedState}
          />
        </div>

        <aside className="space-y-3">
          <GhiLegend dark={dark} />
          <div className={`rounded-xl border p-3 ${dark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>
              Top GHI ranking
            </p>
            <ul className="mt-2 space-y-1.5">
              {topStates.map((row, i) => (
                <li key={row.state} className="flex justify-between text-xs">
                  <span className={dark ? "text-slate-300" : "text-slate-700"}>
                    {i + 1}. {row.state}
                  </span>
                  <span className="font-semibold text-[#D55E00]">{row.ghi.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function MapControl({ icon: Icon, label, onClick, dark }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 ${
        dark
          ? "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function GhiLegend({ dark }) {
  return (
    <div className={`rounded-xl border p-3 ${dark ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>
        GHI scale (kWh/m²/day)
      </p>
      <div
        className="mt-2 h-3 w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${GHI_SCALE.stops.map((s) => s.color).join(", ")})`,
        }}
      />
      <div className={`mt-1 flex justify-between text-[10px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
        <span>{GHI_SCALE.min}</span>
        <span>{GHI_SCALE.max}</span>
      </div>
    </div>
  );
}
