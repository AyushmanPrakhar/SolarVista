import { motion } from "framer-motion";
import { Activity, BarChart3, MapPinned, RadioTower, Sun, Zap } from "lucide-react";
import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const solarParks = [
  { name: "Bhadla Solar Park", state: "Rajasthan", position: [27.54, 71.91], generation: "+6.2%", aqi: "Moderate", efficiency: "94.8%", status: "Stable" },
  { name: "Charanka Solar Park", state: "Gujarat", position: [23.9, 71.2], generation: "+4.1%", aqi: "Good", efficiency: "93.1%", status: "Irradiance high" },
  { name: "Rewa Ultra Mega", state: "Madhya Pradesh", position: [24.48, 81.63], generation: "+2.8%", aqi: "Good", efficiency: "91.7%", status: "Normal" },
  { name: "Pavagada Solar Park", state: "Karnataka", position: [14.1, 77.28], generation: "+3.5%", aqi: "Good", efficiency: "92.9%", status: "Forecast stable" },
  { name: "Kamuthi Solar Plant", state: "Tamil Nadu", position: [9.35, 78.39], generation: "+2.2%", aqi: "Good", efficiency: "93.6%", status: "Stable" },
  { name: "NCR AQI Corridor", state: "Delhi NCR", position: [28.61, 77.2], generation: "-3.8%", aqi: "Elevated", efficiency: "88.4%", status: "AQI elevated" },
];

const epcProjects = [
  { name: "Western Corridor EPC", position: [22.3, 73.2] },
  { name: "Southern Evacuation Upgrade", position: [12.97, 79.16] },
  { name: "Northern Transmission Link", position: [27.1, 76.2] },
];

const corridors = [
  [[27.54, 71.91], [23.9, 71.2], [22.3, 73.2], [19.07, 72.88]],
  [[24.48, 81.63], [22.57, 88.36]],
  [[14.1, 77.28], [12.97, 79.16], [9.35, 78.39]],
];

const insights = [
  ["Top solar states", "RJ, GJ, KA", BarChart3],
  ["Highest AQI impact", "NCR corridor", Activity],
  ["Forecast stability", "Tamil Nadu stable", Sun],
  ["Transmission utilization", "Western grid 91%", RadioTower],
  ["Renewable growth trend", "+5.8% q/q", Zap],
];

const floatingCards = [
  ["Rajasthan generation +6.2%", "left-[6%] top-[18%]"],
  ["Gujarat irradiance high", "right-[8%] top-[24%]"],
  ["NCR AQI elevated", "left-[10%] bottom-[27%]"],
  ["Grid stability 91%", "right-[9%] bottom-[23%]"],
  ["Tamil Nadu forecast stable", "left-[34%] bottom-[9%]"],
];

function IntelligenceMap() {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/64 p-4 shadow-[0_35px_100px_rgba(15,23,42,.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.045]">
      <div className="relative h-[610px] overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-slate-950 dark:border-white/10">
        <MapContainer
          center={[22.8, 78.9]}
          zoom={5}
          minZoom={4}
          maxZoom={7}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

          {corridors.map((path, index) => (
            <Polyline
              key={index}
              positions={path}
              pathOptions={{ color: index === 1 ? "#38bdf8" : "#10b981", weight: 3, opacity: 0.68, dashArray: "8 10" }}
            />
          ))}

          {solarParks.map((park) => (
            <CircleMarker
              key={park.name}
              center={park.position}
              radius={park.aqi === "Elevated" ? 13 : 10}
              pathOptions={{
                color: park.aqi === "Elevated" ? "#f59e0b" : "#34d399",
                fillColor: park.aqi === "Elevated" ? "#f59e0b" : "#10b981",
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div className="min-w-[190px]">
                  <strong>{park.name}</strong>
                  <div>{park.state}</div>
                  <div>Generation: {park.generation}</div>
                  <div>AQI: {park.aqi}</div>
                  <div>Efficiency: {park.efficiency}</div>
                  <div>Transmission: {park.status}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {epcProjects.map((project) => (
            <CircleMarker
              key={project.name}
              center={project.position}
              radius={8}
              pathOptions={{ color: "#7dd3fc", fillColor: "#38bdf8", fillOpacity: 0.72, weight: 2 }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <div>
                  <strong>{project.name}</strong>
                  <div>EPC project location</div>
                  <div>Transmission-linked asset</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(245,158,11,.12),transparent_26%),radial-gradient(circle_at_62%_72%,rgba(16,185,129,.16),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:34px_34px]" />
        <motion.div
          className="pointer-events-none absolute left-0 top-[44%] h-px w-full bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
          animate={{ x: ["-55%", "55%"], opacity: [0, 1, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute left-4 top-4 rounded-3xl border border-white/10 bg-slate-950/78 px-5 py-4 text-white shadow-2xl backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Bloomberg energy view</p>
          <p className="mt-1 font-semibold">India renewable intelligence</p>
        </div>

        <div className="absolute bottom-4 right-4 grid gap-2 rounded-3xl border border-white/10 bg-slate-950/78 p-3 text-white shadow-2xl backdrop-blur-xl">
          {["Solar parks", "AQI exposure", "Transmission corridors", "EPC projects"].map((label, index) => (
            <div key={label} className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <span className={`h-2.5 w-2.5 rounded-full ${["bg-emerald-400", "bg-amber-300", "bg-sky-300", "bg-cyan-300"][index]}`} />
              {label}
            </div>
          ))}
        </div>

        {floatingCards.map(([label, position], index) => (
          <motion.div
            key={label}
            className={`pointer-events-none absolute ${position} hidden rounded-full border border-white/10 bg-slate-950/72 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl md:block`}
            animate={{ y: [0, index % 2 ? 8 : -8, 0] }}
            transition={{ duration: 4.6, repeat: Infinity, delay: index * 0.25 }}
          >
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" />
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function MapPreviewSection() {
  return (
    <section id="map" className="relative py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[.86fr_1.14fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
            <MapPinned size={16} className="text-emerald-500" />
            Renewable network visualization
          </div>
          <h2 className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            India-scale renewable intelligence map.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Interactive solar parks, AQI overlays, renewable clusters, EPC locations, and transmission corridors with operational hover context.
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            {insights.map(([title, detail, Icon]) => (
              <div key={title} className="rounded-3xl border border-white/70 bg-white/60 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                <Icon size={21} className="text-emerald-500" />
                <p className="mt-4 font-semibold text-slate-950 dark:text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <IntelligenceMap />
      </div>
    </section>
  );
}
