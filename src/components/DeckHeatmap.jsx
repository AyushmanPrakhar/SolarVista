import React, { useCallback, useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";

import Legend from "./Legend";
import SolarKpiCards from "./SolarKpiCards";

import geojson from "../data/india-light.json";
import HeatmapTooltip from "./heatmap/HeatmapTooltip";
import HeatmapInsightsPanel from "./heatmap/HeatmapInsightsPanel";

import {
  ALL_STATES,
  buildSolarStateMetrics,
  getGhiColor,
  normalizeStateName,
} from "../utils/solarStateMetrics";
import { getIndiaInitialViewState } from "../utils/geo";

const INITIAL_VIEW_STATE = getIndiaInitialViewState();
export default function DeckHeatmap({
  selectedState = ALL_STATES,
  setSelectedState = () => {},
}) {
  const [hoverInfo, setHoverInfo] = useState(null);

  // ✅ GeoJSON features
  const geoData = geojson;

  // ✅ Metrics
  const metrics = useMemo(() => buildSolarStateMetrics(), []);

  // ✅ Lookup table
  const metricByState = useMemo(() => {
    const lookup = {};

    metrics.forEach((item) => {
      lookup[normalizeStateName(item.state)] = item;
    });

    return lookup;
  }, [metrics]);

  // ✅ Selected state metric
  const selectedMetric = useMemo(() => {
    return selectedState === ALL_STATES
      ? null
      : metrics.find((item) => item.state === selectedState);
  }, [metrics, selectedState]);

  // ✅ GHI range
  const ghiRange = useMemo(() => {
    return {
      min: Math.min(...metrics.map((item) => item.ghi)),
      max: Math.max(...metrics.map((item) => item.ghi)),
    };
  }, [metrics]);

  // ✅ Match state metric
  const getMetric = useCallback(
    (feature) => {
      return metricByState[
        normalizeStateName(feature?.properties?.st_nm)
      ];
    },
    [metricByState]
  );

  // ✅ Deck.gl Layer
  const layer = useMemo(() => {
    return new GeoJsonLayer({
      id: "india-map",

      data: geoData,

      filled: true,
      stroked: true,
      pickable: true,
      autoHighlight: true,

      highlightColor: [255, 255, 255, 120],

      getFillColor: (feature) => {
        const metric = getMetric(feature);

        if (!metric) {
          return [80, 80, 80, 100];
        }

        const isSelected = metric.state === selectedState;

        return getGhiColor(
          metric.ghi,
          ghiRange.min,
          ghiRange.max,
          isSelected ? 255 : 190
        );
      },

      getLineColor: (feature) => {
        const metric = getMetric(feature);

        return metric?.state === selectedState
          ? [255, 215, 0, 255]
          : [255, 255, 255, 165];
      },

      getLineWidth: (feature) => {
        const metric = getMetric(feature);

        return metric?.state === selectedState ? 3 : 1;
      },

      lineWidthMinPixels: 1,

      updateTriggers: {
        getFillColor: [
          selectedState,
          ghiRange.min,
          ghiRange.max,
        ],
        getLineColor: [selectedState],
        getLineWidth: [selectedState],
      },

      // ✅ Hover
      onHover: (info) => {
        const metric = getMetric(info.object);

        if (info.object && metric) {
          setHoverInfo({
            x: info.x,
            y: info.y,
            metric,
          });
        } else {
          setHoverInfo(null);
        }
      },

      // ✅ Click
      onClick: (info) => {
        const metric = getMetric(info.object);

        if (metric) {
          setSelectedState(metric.state);
        }
      },
    });
  }, [
    geoData,
    getMetric,
    selectedState,
    ghiRange.min,
    ghiRange.max,
    setSelectedState,
  ]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
      {/* HEADER */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
            SolarVista heat intelligence
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            India Solar Heatmap
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
            State-level GHI coloring with hover + click selection, KPI rollups,
            and decision-grade charts.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedState(ALL_STATES);
            setHoverInfo(null);
          }}
          className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-amber-300"
        >
          Reset view
        </button>
      </header>

      {/* KPI CARDS */}
      <SolarKpiCards
        metrics={metrics}
        selectedMetric={selectedMetric}
      />

      <section className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Interactive India map</h2>
              <p className="text-sm text-slate-400">
                Hover for metrics. Click to select a state.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
              Selected: <span className="font-semibold text-white">{selectedMetric?.state || "All"}</span>
            </div>
          </div>

          <div className="relative h-[560px] overflow-hidden rounded-2xl border border-slate-800">
            <DeckGL
              initialViewState={INITIAL_VIEW_STATE}
              controller={true}
              layers={[layer]}
              getTooltip={() => null}
            />

        {/* LEGEND */}
        <Legend
          min={ghiRange.min}
          max={ghiRange.max}
        />

        {/* TOOLTIP */}
            <HeatmapTooltip hoverInfo={hoverInfo} />
          </div>
        </div>

        <HeatmapInsightsPanel
          metrics={metrics}
          selectedState={selectedState}
          selectedMetric={selectedMetric}
        />
      </section>

    </div>
  );
}