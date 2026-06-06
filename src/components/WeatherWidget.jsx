import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Droplets, Wind, MapPin, Cloud, Sun, CloudRain, CloudLightning, Loader2, AlertCircle } from 'lucide-react';
import { fetchCurrentWeather } from '../services/weatherService';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getWeatherData = () => {
      if (!navigator.geolocation) {
        if (isMounted) {
          setError('Geolocation not supported');
          setLoading(false);
        }
        return;
      }

      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const data = await fetchCurrentWeather(latitude, longitude);
            if (isMounted) {
              setWeather(data);
              setError(null);
            }
          } catch (err) {
            if (isMounted) setError('Weather data unavailable');
          } finally {
            if (isMounted) setLoading(false);
          }
        },
        (err) => {
          if (isMounted) {
            let errorMsg = 'Location access denied';
            if (err.code === 2) errorMsg = 'Location unavailable';
            if (err.code === 3) errorMsg = 'Location request timed out';
            setError(errorMsg);
            setLoading(false);
          }
        },
        geoOptions
      );
    };

    getWeatherData();
    return () => { isMounted = false; };
  }, []);

  const getWeatherIcon = (condition) => {
    const iconSize = 32;
    switch (condition?.toLowerCase()) {
      case 'clear': return <Sun size={iconSize} className="text-[#FACC15]" />;
      case 'clouds': return <Cloud size={iconSize} className="text-slate-300" />;
      case 'rain': return <CloudRain size={iconSize} className="text-blue-400" />;
      case 'thunderstorm': return <CloudLightning size={iconSize} className="text-purple-400" />;
      default: return <Cloud size={iconSize} className="text-slate-300" />;
    }
  };

  // Safe formatting helpers
  const formatTemp = (val) => Number.isFinite(val) ? `${Math.round(val)}°C` : '--';
  const formatHumidity = (val) => Number.isFinite(val) ? `${val}%` : '--';
  const formatWind = (val) => Number.isFinite(val) ? `${Math.round(val * 3.6)} km/h` : '--';

  const temp = formatTemp(weather?.main?.temp);
  const humidity = formatHumidity(weather?.main?.humidity);
  const windSpeed = formatWind(weather?.wind?.speed);
  const condition = weather?.weather?.[0]?.description ?? '--';
  const cityName = weather?.name ?? 'Unknown Location';
  const countryCode = weather?.sys?.country ?? '';

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-8"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        {/* Background Decorative Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#F97316]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#FACC15]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Section: City & Status */}
            <div className="flex items-center gap-5">
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                {loading ? <Loader2 className="animate-spin text-[#FACC15]" size={32} /> : getWeatherIcon(weather?.weather?.[0]?.main)}
              </div>
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <MapPin size={14} className="text-[#F97316]" />
                  <span className="text-xs font-bold uppercase tracking-widest">Real-time Intelligence</span>
                </div>
                {loading ? (
                  <div className="h-8 w-48 bg-slate-100 animate-pulse rounded-lg" />
                ) : error ? (
                  <div className="flex items-center gap-2 text-red-500 font-semibold">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                ) : (
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {cityName}{countryCode ? `, ${countryCode}` : ''}
                  </h2>
                )}
              </div>
            </div>

            {/* Right Section: Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] p-5 md:p-6 border border-slate-100 dark:border-slate-700 flex-grow max-w-4xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Thermometer size={12} className="text-[#F97316]" /> Temp
                </span>
                <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? '---' : temp}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Droplets size={12} className="text-blue-500" /> Humidity
                </span>
                <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? '---' : humidity}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Wind size={12} className="text-emerald-500" /> Wind
                </span>
                <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? '---' : windSpeed}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Cloud size={12} className="text-[#FACC15]" /> Condition
                </span>
                <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white capitalize truncate">
                  {loading ? '---' : condition}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
