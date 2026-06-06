import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const heatData = [
  { state: "Andhra Pradesh", lat: 15.9129, lng: 79.7400, ghi: 5.8, aqi: 96 },
  { state: "Arunachal Pradesh", lat: 28.2180, lng: 94.7278, ghi: 4.5, aqi: 42 },
  { state: "Assam", lat: 26.2006, lng: 92.9376, ghi: 4.6, aqi: 58 },
  { state: "Bihar", lat: 25.0961, lng: 85.3131, ghi: 5.1, aqi: 148 },
  { state: "Chhattisgarh", lat: 21.2787, lng: 81.8661, ghi: 5.4, aqi: 102 },
  { state: "Goa", lat: 15.2993, lng: 74.1240, ghi: 5.5, aqi: 62 },
  { state: "Gujarat", lat: 22.2587, lng: 71.1924, ghi: 6.2, aqi: 118 },
  { state: "Haryana", lat: 29.0588, lng: 76.0856, ghi: 5.6, aqi: 172 },
  { state: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, ghi: 5.2, aqi: 55 },
  { state: "Jharkhand", lat: 23.6102, lng: 85.2799, ghi: 5.0, aqi: 126 },
  { state: "Karnataka", lat: 15.3173, lng: 75.7139, ghi: 5.8, aqi: 95 },
  { state: "Kerala", lat: 10.8505, lng: 76.2711, ghi: 5.3, aqi: 48 },
  { state: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, ghi: 5.9, aqi: 112 },
  { state: "Maharashtra", lat: 19.7515, lng: 75.7139, ghi: 5.6, aqi: 126 },
  { state: "Manipur", lat: 24.6637, lng: 93.9063, ghi: 4.7, aqi: 52 },
  { state: "Meghalaya", lat: 25.4670, lng: 91.3662, ghi: 4.3, aqi: 46 },
  { state: "Mizoram", lat: 23.1645, lng: 92.9376, ghi: 4.4, aqi: 39 },
  { state: "Nagaland", lat: 26.1584, lng: 94.5624, ghi: 4.5, aqi: 40 },
  { state: "Odisha", lat: 20.9517, lng: 85.0985, ghi: 5.5, aqi: 110 },
  { state: "Punjab", lat: 31.1471, lng: 75.3412, ghi: 5.4, aqi: 164 },
  { state: "Rajasthan", lat: 27.0238, lng: 74.2179, ghi: 6.5, aqi: 142 },
  { state: "Sikkim", lat: 27.5330, lng: 88.5122, ghi: 4.2, aqi: 36 },
  { state: "Tamil Nadu", lat: 11.1271, lng: 78.6569, ghi: 5.9, aqi: 88 },
  { state: "Telangana", lat: 18.1124, lng: 79.0193, ghi: 5.8, aqi: 104 },
  { state: "Tripura", lat: 23.9408, lng: 91.9882, ghi: 4.6, aqi: 44 },
  { state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, ghi: 5.3, aqi: 182 },
  { state: "Uttarakhand", lat: 30.0668, lng: 79.0193, ghi: 5.0, aqi: 74 },
  { state: "West Bengal", lat: 22.9868, lng: 87.8550, ghi: 4.9, aqi: 138 },

  { state: "Andaman and Nicobar Islands", lat: 11.7401, lng: 92.6586, ghi: 5.4, aqi: 28 },
  { state: "Chandigarh", lat: 30.7333, lng: 76.7794, ghi: 5.3, aqi: 132 },
  { state: "Dadra and Nagar Haveli and Daman and Diu", lat: 20.1809, lng: 73.0169, ghi: 5.7, aqi: 76 },
  { state: "Delhi", lat: 28.7041, lng: 77.1025, ghi: 5.4, aqi: 248 },
  { state: "Jammu and Kashmir", lat: 33.7782, lng: 76.5762, ghi: 5.1, aqi: 68 },
  { state: "Ladakh", lat: 34.1526, lng: 77.5771, ghi: 6.1, aqi: 24 },
  { state: "Lakshadweep", lat: 10.5667, lng: 72.6417, ghi: 5.6, aqi: 18 },
  { state: "Puducherry", lat: 11.9416, lng: 79.8083, ghi: 5.7, aqi: 64 }
];

function getColor(ghi) {
  if (ghi >= 6.3) return "#ef4444";
  if (ghi >= 6.0) return "#f97316";
  if (ghi >= 5.7) return "#22c55e";
  return "#3b82f6";
}

export default function GHIHeatmap() {
  return (
    <div className="h-[650px] w-full rounded-2xl overflow-hidden">
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {heatData.map((item) => (
          <CircleMarker
            key={item.state}
            center={[item.lat, item.lng]}
            radius={item.ghi * 4}
            pathOptions={{
              fillColor: getColor(item.ghi),
              color: getColor(item.ghi),
              fillOpacity: 0.45,
              weight: 2,
            }}
          >
            <Popup>
              <div className="space-y-2">
                <h2 className="font-bold text-lg">{item.state}</h2>
                <p>☀️ GHI: {item.ghi} kWh/m²/day</p>
                <p>🌫 AQI: {item.aqi}</p>
                <p>⚡ Solar Potential: {item.ghi > 6 ? "Very High" : "High"}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}