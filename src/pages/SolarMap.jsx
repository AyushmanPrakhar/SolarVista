import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  MapPin, 
  Thermometer, 
  Wind, 
  Zap, 
  Info, 
  Loader2, 
  ChevronRight,
  Crosshair,
  AlertCircle,
  MousePointer2
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { fetchNasaSolarData, reverseGeocode } from '../services/nasaPowerService';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const CARD_STYLE = "bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden dark:bg-slate-900 dark:border-slate-800";

const SolarMap = () => {
  const [position, setPosition] = useState(null);
  const [data, setData] = useState(null);
  const [address, setAddress] = useState({ city: '', state: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (loading) return; // Prevent concurrent requests
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        handleAnalyze(lat, lng);
      },
    });
    return null;
  };

  const handleAnalyze = async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetch for NASA data and Geocoding
      const [nasaResult, geoResult] = await Promise.all([
        fetchNasaSolarData(lat, lng),
        reverseGeocode(lat, lng)
      ]);
      
      setData(nasaResult);
      setAddress(geoResult);
    } catch (err) {
      setError('Unable to retrieve solar intelligence data. Please try another location or try again later.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Improved Categorization & Scoring
  const getCategorization = (ghi) => {
    if (ghi >= 6.5) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20', scoreDesc: 'Excellent solar resource potential.' };
    if (ghi >= 5.0) return { label: 'Good', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20', scoreDesc: 'Strong solar resource potential.' };
    if (ghi >= 4.0) return { label: 'Moderate', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-100 dark:border-orange-500/20', scoreDesc: 'Moderate solar resource potential.' };
    return { label: 'Low', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20', scoreDesc: 'Limited solar resource potential.' };
  };

  const calculateScore = (ghi) => Math.min(Math.round((ghi / 7) * 100), 100);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] space-y-6 max-w-screen-2xl mx-auto">
      {/* Header & User Guidance */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Interactive Solar Map</h1>
          <div className="flex items-center gap-2 mt-1.5 text-slate-500 dark:text-slate-400">
            <MousePointer2 size={16} className="text-[#FBBF24]" />
            <p className="text-sm font-medium">Click anywhere on the map to analyze solar potential for that location.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl text-slate-600 dark:text-slate-400 text-xs font-semibold shadow-sm">
          <Info size={14} className="text-blue-500" />
          <span>Global Climatology (RE Community)</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Map Container - Left 8 Cols */}
        <div className="lg:col-span-8 relative rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-50 dark:bg-slate-950">
          <MapContainer 
            center={[22.5937, 78.9629]} 
            zoom={5} 
            className="h-full w-full z-0"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
            {position && (
              <Marker position={position}>
                <Popup className="custom-popup">
                  <div className="p-1 font-sans">
                    <p className="font-bold text-slate-900">{address.city || 'Analysis Point'}</p>
                    <p className="text-[10px] text-slate-500">{position[0].toFixed(4)}, {position[1].toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
          
          {/* Default State Instructions */}
          {!position && !loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 p-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg text-slate-900 dark:text-white px-8 py-5 rounded-[2rem] shadow-xl flex flex-col items-center gap-3 text-center border border-slate-200 dark:border-slate-800"
              >
                <div className="p-3 bg-[#FBBF24] rounded-2xl shadow-lg shadow-amber-200/50 dark:shadow-none">
                  <Crosshair size={24} className="text-slate-950" />
                </div>
                <div>
                  <p className="font-bold text-lg leading-tight">Ready for Intelligence</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Select any point on the map to begin.</p>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Insight Panel - Right 4 Cols */}
        <div className="lg:col-span-4 flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`${CARD_STYLE} flex-1 flex flex-col items-center justify-center p-10 text-center`}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/10 blur-3xl rounded-full" />
                  <Loader2 className="animate-spin text-amber-500 relative z-10" size={56} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8">Analyzing...</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Querying NASA POWER climatology and resolving geographic data.</p>
                
                {/* Skeleton Placeholders */}
                <div className="w-full mt-10 space-y-4">
                  <div className="h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse" />
                  <div className="h-40 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-pulse" />
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${CARD_STYLE} flex-1 flex flex-col items-center justify-center p-8 text-center bg-rose-50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/20`}
              >
                <div className="bg-rose-100 dark:bg-rose-500/20 p-4 rounded-full mb-6">
                  <AlertCircle className="text-rose-500 dark:text-rose-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-rose-900 dark:text-rose-100">API Error</h3>
                <p className="text-rose-700 dark:text-rose-300 text-sm mt-3 leading-relaxed">{error}</p>
                <button 
                   onClick={() => position && handleAnalyze(position[0], position[1])}
                   className="mt-8 px-8 py-3 bg-rose-600 text-white rounded-2xl text-sm font-bold shadow-sm hover:bg-rose-700 transition-all active:scale-95"
                >
                  Retry Analysis
                </button>
              </motion.div>
            ) : data ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1 overflow-y-auto pr-1"
              >
                {/* Main Insight Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    {/* Location Badge */}
                    <div className="flex items-start justify-between gap-4 mb-10">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 text-[#F59E0B] mb-1">
                          <MapPin size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Selected Site</span>
                        </div>
                        <h2 className="text-2xl font-bold truncate leading-tight">
                          {address.city}{address.state ? `, ${address.state}` : ''}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-mono mt-1 tracking-tighter">
                          {data.lat.toFixed(4)}°N, {data.lon.toFixed(4)}°E
                        </p>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategorization(data.ghi).border} ${getCategorization(data.ghi).bg} ${getCategorization(data.ghi).color}`}>
                        {getCategorization(data.ghi).label}
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Solar Score Display */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Solar Score</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-slate-900 dark:text-white">{calculateScore(data.ghi)}</span>
                            <span className="text-slate-400 font-bold text-xl">/100</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <div className={`text-sm font-bold ${getCategorization(data.ghi).color}`}>
                             Potential: {getCategorization(data.ghi).label}
                           </div>
                           <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-1 max-w-[120px] text-right leading-tight">
                             {getCategorization(data.ghi).scoreDesc}
                           </p>
                        </div>
                      </div>

                      {/* KPIs */}
                      <div className="grid grid-cols-2 gap-4">
                        <MetricTile 
                          icon={<Sun size={14} className="text-amber-500" />} 
                          label="GHI Index" 
                          value={data.ghi} 
                          unit="kWh/m²/day" 
                        />
                        <MetricTile 
                          icon={<Thermometer size={14} className="text-orange-500" />} 
                          label="Avg Temp" 
                          value={`${data.temp}°C`} 
                          unit="2m Surface" 
                        />
                        <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-default">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl">
                              <Wind size={20} className="text-blue-500 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Avg Wind Speed</p>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.wind} <span className="text-xs font-medium text-slate-400 italic uppercase ml-1">km/h</span></p>
                            </div>
                          </div>
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                            <ChevronRight size={16} className="text-slate-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footnote */}
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic text-center">
                    Climatology reflects a 30-year temporal average. Local factors should be considered for site-specific modeling.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${CARD_STYLE} flex-1 flex flex-col items-center justify-center p-10 text-center opacity-60`}
              >
                <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-full mb-6">
                  <Sun className="text-slate-300 dark:text-slate-600" size={64} />
                </div>
                <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">Waiting for Site Selection</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-3 max-w-[200px]">Interact with the map to generate localized intelligence.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const MetricTile = ({ icon, label, value, unit }) => (
  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-default">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">{label}</span>
    </div>
    <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{value}</p>
    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-black uppercase tracking-tighter">{unit}</p>
  </div>
);

export default SolarMap;
