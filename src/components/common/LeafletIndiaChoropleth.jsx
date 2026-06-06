import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Helper to auto-fit map to India's bounds when GeoJSON loads
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20], animate: true });
    }
  }, [map, bounds]);
  return null;
}

/**
 * Generic India Choropleth using React-Leaflet
 * @param {Object} geoData - GeoJSON feature collection
 * @param {Function} getColor - function(row) => hexColor
 * @param {Function} getTooltipContent - function(stateName, row) => string (html)
 * @param {Function} onSelectState - callback when state is clicked
 * @param {Function} onHoverState - callback when state is hovered
 * @param {Map} dataMap - Map of normalizedStateName -> dataRow
 */
export default function LeafletIndiaChoropleth({ 
  geoData, 
  getColor,
  getTooltipContent,
  onSelectState, 
  onHoverState,
  dataMap,
  selectedState 
}) {
  
  const geojsonBounds = useMemo(() => {
    if (!geoData) return null;
    return L.geoJSON(geoData).getBounds();
  }, [geoData]);

  const normalize = (name) => (name || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties?.st_nm || "";
    const row = dataMap.get(normalize(stateName));
    const isSelected = selectedState && normalize(selectedState) === normalize(stateName);

    // Initial Styling
    layer.setStyle({
      fillColor: getColor(row),
      fillOpacity: isSelected ? 0.95 : 0.8,
      weight: isSelected ? 2.5 : 1,
      color: isSelected ? "#0f172a" : "white",
    });

    // Tooltip
    if (getTooltipContent) {
      layer.bindTooltip(
        getTooltipContent(stateName, row),
        { sticky: true, opacity: 0.95, className: 'custom-leaflet-tooltip' }
      );
    }

    // Events
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 2.5,
          color: "#0f172a",
          fillOpacity: 0.95,
        });
        if (onHoverState) onHoverState(row);
      },
      mouseout: (e) => {
        const l = e.target;
        const currentIsSelected = selectedState && normalize(selectedState) === normalize(stateName);
        l.setStyle({
          weight: currentIsSelected ? 2.5 : 1,
          color: currentIsSelected ? "#0f172a" : "white",
          fillOpacity: currentIsSelected ? 0.95 : 0.8,
        });
        if (onHoverState) onHoverState(null);
      },
      click: () => {
        if (onSelectState && row) onSelectState(row.state);
      },
    });
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative z-0">
      <MapContainer
        center={[22, 78]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        style={{ height: "100%", width: "100%", background: "#f8fafc" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {geoData && (
          <GeoJSON 
            key={selectedState} // Re-render when selectedState changes to update styles efficiently
            data={geoData} 
            onEachFeature={onEachFeature}
          />
        )}
        <FitBounds bounds={geojsonBounds} />
      </MapContainer>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-leaflet-tooltip {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
          padding: 0 !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}} />
    </div>
  );
}
