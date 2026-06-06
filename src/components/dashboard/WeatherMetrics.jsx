import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, MapPin, AlertCircle } from 'lucide-react';
import { fetchCurrentWeather } from '../../services/weatherService';

const SkeletonCard = () => (
  <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 animate-pulse">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 space-y-3">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-8 w-16 bg-slate-200 rounded"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
      <div className="h-12 w-12 bg-slate-100 rounded-lg"></div>
    </div>
  </div>
);

const WeatherCard = ({ icon, label, value, detail, accent, iconColor }) => (
  <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-[#0B132B]">
          {value}
        </p>
        <p className="mt-1 text-sm text-slate-400 font-medium">{detail}</p>
      </div>
      <div className={`rounded-xl p-3 ${accent} shadow-inner`}>
        {React.cloneElement(icon, { className: iconColor, size: 24 })}
      </div>
    </div>
  </div>
);

const WeatherMetrics = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getLocationAndWeather = () => {
      if (!navigator.geolocation) {
        if (isMounted) {
          setError('Geolocation is not supported by your browser');
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
            if (isMounted) setError('Failed to fetch weather data');
          } finally {
            if (isMounted) setLoading(false);
          }
        },
        (err) => {
          if (isMounted) {
            let msg = 'Location permission denied';
            if (err.code === 2) msg = 'Location unavailable';
            if (err.code === 3) msg = 'Location request timed out';
            setError(msg);
            setLoading(false);
          }
        },
        geoOptions
      );
    };

    getLocationAndWeather();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4 shadow-sm">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertCircle className="text-red-600" size={24} />
        </div>
        <div>
          <h4 className="text-red-900 font-bold">Weather Data Unavailable</h4>
          <p className="text-red-700 text-sm mt-0.5">{error}. Please allow location access or check your connection.</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  // Safe formatting helpers
  const formatTemp = (val) => Number.isFinite(val) ? `${Math.round(val)}°C` : '--';
  const formatHumidity = (val) => Number.isFinite(val) ? `${val}%` : '--';
  const formatWind = (val) => Number.isFinite(val) ? `${Math.round(val * 3.6)} km/h` : '--';

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 w-full">
      <WeatherCard
        icon={<Thermometer />}
        label="Temperature"
        value={formatTemp(weather?.main?.temp)}
        detail={Number.isFinite(weather?.main?.feels_like) ? `Feels like ${Math.round(weather.main.feels_like)}°C` : '--'}
        accent="bg-orange-50"
        iconColor="text-[#F97316]"
      />
      <WeatherCard
        icon={<Droplets />}
        label="Humidity"
        value={formatHumidity(weather?.main?.humidity)}
        detail={weather?.weather?.[0]?.description ?? '--'}
        accent="bg-blue-50"
        iconColor="text-blue-600"
      />
      <WeatherCard
        icon={<Wind />}
        label="Wind Speed"
        value={formatWind(weather?.wind?.speed)}
        detail={Number.isFinite(weather?.wind?.deg) ? `Direction: ${weather.wind.deg}°` : '--'}
        accent="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <WeatherCard
        icon={<MapPin />}
        label="Location"
        value={weather?.name ?? 'Unknown'}
        detail={weather?.sys?.country ? `${weather.sys.country}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '--'}
        accent="bg-amber-50"
        iconColor="text-[#FACC15]"
      />
    </div>
  );
};

export default WeatherMetrics;
