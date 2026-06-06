import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Helper to handle map centering/zooming from outside
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 7, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

export default function InfrastructureMap({ 
  parks, 
  selectedParkId, 
  onSelectPark, 
  mapCenter, 
  mapZoom 
}) {
  // Function to calculate radius proportional to capacity
  // Base radius 5, scale factor for MW
  const getRadius = (capacity) => {
    return Math.sqrt(capacity) * 0.8 + 5;
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController center={mapCenter} zoom={mapZoom} />

        {parks.map((park) => {
          const isSelected = selectedParkId === park.id;
          
          return (
            <CircleMarker
              key={park.id}
              center={[park.latitude, park.longitude]}
              radius={getRadius(park.capacityMW)}
              fillColor={isSelected ? "#F97316" : "#0B132B"}
              color={isSelected ? "#ffffff" : "#F97316"}
              weight={isSelected ? 3 : 1}
              opacity={1}
              fillOpacity={0.7}
              eventHandlers={{
                click: () => onSelectPark(park.id),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 font-sans">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">{park.name}</h3>
                  <div className="space-y-1.5">
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-slate-500 uppercase font-black tracking-tighter">State</span>
                      <span className="font-bold text-slate-700">{park.state}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-slate-500 uppercase font-black tracking-tighter">Capacity</span>
                      <span className="font-bold text-orange-600">{park.capacityMW} MW</span>
                    </div>
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-slate-500 uppercase font-black tracking-tighter">Year</span>
                      <span className="font-bold text-slate-700">{park.year}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-center py-0.5 rounded-full bg-slate-100 text-slate-600 ring-1 ring-slate-200 uppercase tracking-widest">
                      {park.status}
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
