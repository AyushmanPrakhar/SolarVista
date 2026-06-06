import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Map as MapIcon, 
  Zap, 
  Trophy, 
  MapPinned, 
  Percent, 
  Filter,
  RefreshCw,
  Search,
  ChevronDown
} from 'lucide-react';

import { solarParksData } from '../data/solarParksExtended';
import InfrastructureMap from '../components/solar-parks/InfrastructureMap';
import InfrastructureCharts from '../components/solar-parks/InfrastructureCharts';
import InfrastructureTable from '../components/solar-parks/InfrastructureTable';
import InfrastructureTimeline from '../components/solar-parks/InfrastructureTimeline';
import InfrastructureInsights from '../components/solar-parks/InfrastructureInsights';

export default function SolarParks() {
  const [selectedParkId, setSelectedParkId] = useState(null);
  const [filters, setFilters] = useState({
    state: "All",
    status: "All",
    minCapacity: 0
  });
  
  const [mapView, setMapView] = useState({
    center: [22.5937, 78.9629],
    zoom: 5
  });

  // Derived filtered data
  const filteredParks = useMemo(() => {
    return solarParksData.filter(p => {
      const stateMatch = filters.state === "All" || p.state === filters.state;
      const statusMatch = filters.status === "All" || p.status === filters.status;
      const capacityMatch = p.capacityMW >= filters.minCapacity;
      return stateMatch && statusMatch && capacityMatch;
    });
  }, [filters]);

  // Statistics
  const stats = useMemo(() => {
    const totalMW = filteredParks.reduce((sum, p) => sum + p.capacityMW, 0);
    const uniqueStates = new Set(filteredParks.map(p => p.state)).size;
    const sorted = [...filteredParks].sort((a, b) => b.capacityMW - a.capacityMW);
    const largest = sorted[0];
    const avgCap = filteredParks.length ? Math.round(totalMW / filteredParks.length) : 0;
    const operational = filteredParks.filter(p => p.status === 'Operational').length;
    const opPct = filteredParks.length ? Math.round((operational / filteredParks.length) * 100) : 0;

    return {
      totalGW: (totalMW / 1000).toFixed(1),
      largestPark: largest?.name || 'N/A',
      statesCount: uniqueStates,
      avgCapacity: avgCap,
      opPercent: opPct,
      count: filteredParks.length
    };
  }, [filteredParks]);

  const handleSelectPark = (id) => {
    setSelectedParkId(id);
    const park = solarParksData.find(p => p.id === id);
    if (park) {
      setMapView({
        center: [park.latitude, park.longitude],
        zoom: 12
      });
    }
  };

  const states = Array.from(new Set(solarParksData.map(p => p.state))).sort();

  return (
    <div className="mx-auto max-w-screen-2xl space-y-8 pb-20 text-slate-900">
      {/* Header & Global Filters */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full text-amber-700 text-xs font-black uppercase tracking-widest border border-amber-100/50">
            <Building2 size={14} />
            Physical Asset Tracking
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#0B132B]">Infrastructure Intelligence</h1>
          <p className="text-slate-500 font-medium">Monitoring utility-scale solar parks across the Indian subcontinent.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1.5">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Filter by State</label>
             <div className="relative">
               <select 
                 className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all cursor-pointer min-w-[180px]"
                 value={filters.state}
                 onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
               >
                 <option value="All">National Overview</option>
                 {states.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Operational Status</label>
             <div className="relative">
               <select 
                 className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all cursor-pointer"
                 value={filters.status}
                 onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
               >
                 <option value="All">All Status</option>
                 <option value="Operational">Operational</option>
                 <option value="Under Construction">Under Construction</option>
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
             </div>
          </div>

          <button 
            onClick={() => setFilters({ state: "All", status: "All", minCapacity: 0 })}
            className="mt-5 p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95"
            title="Reset Filters"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* KPI Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total GW" value={stats.totalGW} icon={<Zap size={20} />} detail={`${stats.count} Projects`} color="bg-amber-50 text-amber-600" />
        <KpiCard label="Largest Park" value={stats.largestPark} icon={<Trophy size={20} />} detail="Highest Capacity" color="bg-emerald-50 text-emerald-600" />
        <KpiCard label="States" value={stats.statesCount} icon={<MapPinned size={20} />} detail="Geographic Reach" color="bg-blue-50 text-blue-600" />
        <KpiCard label="Avg Capacity" value={`${stats.avgCapacity} MW`} icon={<Building2 size={20} />} detail="Per Project" color="bg-indigo-50 text-indigo-600" />
        <KpiCard label="Operational" value={`${stats.opPercent}%`} icon={<Percent size={20} />} detail="Project Readiness" color="bg-purple-50 text-purple-600" />
        <KpiCard label="Active Filter" value={filters.state === 'All' ? 'National' : filters.state} icon={<Filter size={20} />} detail="Data Scope" color="bg-slate-100 text-slate-600" />
      </section>

      {/* Map and Insights Grid */}
      <div className="grid gap-8 lg:grid-cols-12 min-h-[600px]">
        <div className="lg:col-span-8 h-full min-h-[500px]">
           <InfrastructureMap 
             parks={filteredParks} 
             selectedParkId={selectedParkId} 
             onSelectPark={handleSelectPark}
             mapCenter={mapView.center}
             mapZoom={mapView.zoom}
           />
        </div>
        <div className="lg:col-span-4 space-y-6">
           <InfrastructureInsights parks={filteredParks} />
           <InfrastructureTimeline parks={filteredParks} />
        </div>
      </div>

      {/* Analytics Charts */}
      <InfrastructureCharts parks={filteredParks} />

      {/* Master Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapIcon className="text-orange-500" size={20} />
          <h2 className="text-xl font-bold text-[#0B132B]">Master Asset List</h2>
        </div>
        <InfrastructureTable parks={filteredParks} onSelectPark={handleSelectPark} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, detail, color }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div>
        <p className="text-xl font-black text-[#0B132B] truncate" title={value}>{value}</p>
        <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{detail}</p>
      </div>
    </div>
  );
}
