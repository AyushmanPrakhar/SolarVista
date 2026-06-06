import { useEffect, useMemo, useRef } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import indiaGeoJson from "../data/india-light.json";

const INDIA_CENTER = [22.8, 79.2];
const INDIA_BOUNDS = [
  [6.5, 67.5],
  [37.7, 98.5],
];

function stateName(feature) {
  return feature?.properties?.st_nm || feature?.properties?.name || "";
}

function getGhiColor(ghi) {
  if (!Number.isFinite(ghi)) return "#e2e8f0";
  if (ghi >= 6.2) return "#ea580c";
  if (ghi >= 5.75) return "#f97316";
  if (ghi >= 5.25) return "#22c55e";
  if (ghi >= 4.75) return "#86efac";
  return "#bfdbfe";
}

function metricForFeature(feature, dataByState) {
  return dataByState.get(stateName(feature));
}

function MapBridge({ selectedState, setMapApi }) {
  const map = useMap();

  useEffect(() => {
    setMapApi({
      reset: () => map.fitBounds(INDIA_BOUNDS, { padding: [20, 20], animate: true }),
      invalidate: () => map.invalidateSize(),
    });

    map.fitBounds(INDIA_BOUNDS, { padding: [20, 20], animate: false });
  }, [map, setMapApi]);

  useEffect(() => {
    if (!selectedState) return;

    let selectedLayer = null;
    map.eachLayer((layer) => {
      const feature = layer.feature;
      if (feature && stateName(feature) === selectedState) {
        selectedLayer = layer;
      }
    });

    if (selectedLayer?.getBounds?.().isValid()) {
      map.fitBounds(selectedLayer.getBounds(), {
        maxZoom: 6.2,
        padding: [48, 48],
        animate: true,
        duration: 0.55,
      });
    }
  }, [map, selectedState]);

  return null;
}

function ResizeWatcher() {
  const map = useMap();

  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 180);
    return () => window.clearTimeout(id);
  }, [map]);

  return null;
}

export default function Heatmap({
  data,
  selectedState,
  onSelectState,
  onHoverState,
  filteredPotentials = [],
  setMapApi,
}) {
  const geoJsonRef = useRef(null);
  const dataByState = useMemo(
    () => new Map(data.map((item) => [item.state, item])),
    [data]
  );

  const activeFilters = useMemo(
    () => new Set(filteredPotentials),
    [filteredPotentials]
  );

  const styleFeature = (feature) => {
    const metric = metricForFeature(feature, dataByState);
    const selected = metric?.state === selectedState;
    const filteredOut =
      activeFilters.size > 0 && metric && !activeFilters.has(metric.potential);

    return {
      fillColor: getGhiColor(metric?.ghi),
      weight: selected ? 2.8 : 1,
      color: selected ? "#0f172a" : "#ffffff",
      fillOpacity: filteredOut ? 0.2 : selected ? 0.92 : 0.78,
      opacity: filteredOut ? 0.45 : 1,
      dashArray: selected ? "" : "2",
    };
  };

  const handleEachFeature = (feature, layer) => {
    const metric = metricForFeature(feature, dataByState);
    const name = stateName(feature);
    const tooltip = metric
      ? `<div class="text-slate-900"><strong>${metric.state}</strong><br/>GHI: ${metric.ghi.toFixed(
          2
        )} kWh/m2/day<br/>Generation: ${metric.generation.toLocaleString()} MW<br/>Potential: ${
          metric.potential
        }</div>`
      : `<div class="text-slate-900"><strong>${name}</strong><br/>No GHI metric available</div>`;

    layer.bindTooltip(tooltip, {
      sticky: true,
      direction: "top",
      className: "solar-ghi-tooltip",
    });

    layer.on({
      mouseover: (event) => {
        event.target.setStyle({
          weight: 2.4,
          color: "#2563eb",
          fillOpacity: 0.94,
        });
        event.target.bringToFront();
        onHoverState?.(metric || { state: name });
      },
      mouseout: (event) => {
        geoJsonRef.current?.resetStyle(event.target);
        onHoverState?.(null);
      },
      click: () => {
        if (metric) onSelectState?.(metric.state);
      },
    });
  };

  return (
    <div className="relative h-full min-h-[650px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <MapContainer
        center={INDIA_CENTER}
        zoom={5}
        minZoom={4}
        maxZoom={7}
        scrollWheelZoom
        zoomControl={false}
        attributionControl={false}
        preferCanvas
        style={{ height: "100%", minHeight: "650px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="OpenStreetMap"
          opacity={0.34}
        />
        <GeoJSON
          key={`${selectedState}-${filteredPotentials.join("-")}`}
          ref={geoJsonRef}
          data={{
            ...indiaGeoJson,
            features: indiaGeoJson.features.filter((feature) => feature.geometry),
          }}
          style={styleFeature}
          onEachFeature={handleEachFeature}
        />
        <MapBridge selectedState={selectedState} setMapApi={setMapApi} />
        <ResizeWatcher />
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 z-[500] rounded-2xl border border-white/70 bg-white/85 p-4 shadow-lg backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          GHI intensity
        </p>
        <div className="mt-3 h-2 w-52 rounded-full bg-[linear-gradient(90deg,#bfdbfe_0%,#22c55e_52%,#f97316_76%,#ea580c_100%)]" />
        <div className="mt-2 flex w-52 justify-between text-[11px] font-medium text-slate-600">
          <span>Low</span>
          <span>Solar Potential</span>
          <span>High</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] max-w-xs rounded-2xl border border-white/70 bg-white/85 p-4 shadow-lg backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Boundary layer
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-950">
          India state-level GHI
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Hover to inspect state metrics. Click a state to drive KPI cards and
          analytics panels.
        </p>
      </div>
    </div>
  );
}
