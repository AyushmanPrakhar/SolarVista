import React, { useState } from 'react';
import { Search, Download, ChevronRight, ArrowUpDown, ExternalLink } from 'lucide-react';

export default function InfrastructureTable({ parks, onSelectPark }) {
  const [searchTerm, setSearchState] = useState("");
  const [sortKey, setSortKey] = useState("rank");
  const [sortOrder, setSortOrder] = useState("asc");

  const filtered = React.useMemo(() => {
    return parks
      .filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.state.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (sortOrder === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });
  }, [parks, searchTerm, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const exportCSV = () => {
    const headers = ["Rank", "Name", "State", "Capacity MW", "Year", "Status", "Lat", "Lon"];
    const rows = filtered.map(p => [p.rank, p.name, p.state, p.capacityMW, p.year, p.status, p.latitude, p.longitude]);
    const content = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SolarParks_India_Export.csv`;
    a.click();
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search parks or states..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchState(e.target.value)}
          />
        </div>
        <button 
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <Download size={16} />
          Export Data
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-100">
              <SortHeader label="Rank" k="rank" current={sortKey} order={sortOrder} onClick={handleSort} center />
              <SortHeader label="Solar Park" k="name" current={sortKey} order={sortOrder} onClick={handleSort} />
              <SortHeader label="State" k="state" current={sortKey} order={sortOrder} onClick={handleSort} />
              <SortHeader label="Capacity (MW)" k="capacityMW" current={sortKey} order={sortOrder} onClick={handleSort} right />
              <SortHeader label="Year" k="year" current={sortKey} order={sortOrder} onClick={handleSort} center />
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((park) => (
              <tr key={park.id} className="group hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => onSelectPark(park.id)}>
                <td className="px-6 py-5 text-sm font-black text-slate-300">#{park.rank}</td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0B132B] group-hover:text-orange-600 transition-colors">{park.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{park.id}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-slate-600">{park.state}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-black ring-1 ring-amber-100/50">
                    {park.capacityMW} MW
                  </span>
                </td>
                <td className="px-6 py-5 text-center text-sm font-bold text-slate-500">{park.year}</td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ring-1 ${
                    park.status === 'Operational' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-blue-50 text-blue-700 ring-blue-100'
                  }`}>
                    {park.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="p-2 bg-slate-100 rounded-full text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm inline-block">
                    <ChevronRight size={14} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filtered.length === 0 && (
        <div className="py-20 text-center text-slate-400">
           <p className="font-bold uppercase tracking-widest text-xs">No parks found matching your search</p>
        </div>
      )}
    </div>
  );
}

function SortHeader({ label, k, current, order, onClick, right, center }) {
  const active = current === k;
  return (
    <th 
      className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors ${right ? 'text-right' : center ? 'text-center' : 'text-left'}`}
      onClick={() => onClick(k)}
    >
      <div className={`flex items-center gap-1 ${right ? 'justify-end' : center ? 'justify-center' : 'justify-start'}`}>
        {label}
        <ArrowUpDown size={12} className={active ? 'text-orange-500' : 'opacity-20'} />
      </div>
    </th>
  );
}
