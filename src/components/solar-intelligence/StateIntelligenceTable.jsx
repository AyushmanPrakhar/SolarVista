import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

import { METRIC_COLORS } from "../../utils/solarIntelligence/constants";
import { formatNumber } from "../../utils/solarIntelligence/format";
import { cardClass, SectionHeading } from "./ui";

const COLUMNS = [
  { key: "state", label: "State", sortable: true },
  { key: "ghi", label: "GHI", sortable: true, color: METRIC_COLORS.ghi },
  { key: "generation", label: "Generation", sortable: true, color: METRIC_COLORS.generation },
  { key: "readiness", label: "Readiness", sortable: true, color: METRIC_COLORS.readiness },
  { key: "adoption", label: "Adoption", sortable: true, color: METRIC_COLORS.adoption },
  { key: "opportunityIndex", label: "Opportunity", sortable: true, color: METRIC_COLORS.opportunity },
  { key: "potential", label: "Potential", sortable: true },
];

export default function StateIntelligenceTable({ states, selectedState, onSelectState, nationalAvgGhi, dark }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("ghi");
  const [sortDir, setSortDir] = useState("desc");
  const [filterBand, setFilterBand] = useState("all");
  const [showTop, setShowTop] = useState("all");

  const filtered = useMemo(() => {
    let list = [...states];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.state.toLowerCase().includes(q) || r.region.toLowerCase().includes(q));
    }
    if (filterBand !== "all") list = list.filter((r) => r.resourceBand === filterBand);
    list.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    if (showTop === "top10") return list.slice(0, 10);
    if (showTop === "bottom10") return list.slice(-10).reverse();
    return list;
  }, [states, search, sortKey, sortDir, filterBand, showTop]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <section className={cardClass(dark)}>
      <SectionHeading
        eyebrow="Primary analytical view"
        title="State Solar Intelligence Ranking"
        subtitle="Which states lead, lag, and present investment opportunity?"
        conclusion="Search, sort, and filter all states. Click a row to drive charts and executive briefs below. Replaces geospatial view when map data is unreliable."
        benchmark={`National GHI avg: ${nationalAvgGhi.toFixed(2)} kWh/m²/day`}
        dark={dark}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="search"
            placeholder="Search state or region…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm ${
              dark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-900"
            }`}
          />
        </div>
        <select
          value={filterBand}
          onChange={(e) => setFilterBand(e.target.value)}
          className={`rounded-lg border px-3 py-2 text-xs font-medium ${dark ? "border-slate-600 bg-slate-800 text-slate-200" : "border-slate-200 bg-white"}`}
        >
          <option value="all">All resource bands</option>
          <option value="Very High">Very High</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={showTop}
          onChange={(e) => setShowTop(e.target.value)}
          className={`rounded-lg border px-3 py-2 text-xs font-medium ${dark ? "border-slate-600 bg-slate-800 text-slate-200" : "border-slate-200 bg-white"}`}
        >
          <option value="all">All states</option>
          <option value="top10">Top 10</option>
          <option value="bottom10">Bottom 10</option>
        </select>
      </div>

      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className={dark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-600"}>
            <tr>
              <th className="px-3 py-2.5 text-xs font-semibold">#</th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => col.sortable && toggleSort(col.key)}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide"
                    style={col.color ? { color: col.color } : undefined}
                  >
                    {col.label}
                    {sortKey === col.key && (sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, index) => {
              const isSelected = selectedState === row.state;
              const ghiDelta = ((row.ghi / nationalAvgGhi - 1) * 100).toFixed(0);
              return (
                <tr
                  key={row.state}
                  onClick={() => onSelectState(row.state)}
                  className={`cursor-pointer border-t transition ${
                    isSelected
                      ? dark
                        ? "bg-[#EA580C]/20 border-[#EA580C]/40"
                        : "bg-orange-50 border-orange-200"
                      : dark
                        ? "border-slate-700 hover:bg-slate-800/80"
                        : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <td className={`px-3 py-2 font-mono text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{index + 1}</td>
                  <td className={`px-3 py-2 font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>{row.state}</td>
                  <td className="px-3 py-2" style={{ color: METRIC_COLORS.ghi }}>
                    {row.ghi.toFixed(2)}
                    <span className={`ml-1 text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                      ({ghiDelta > 0 ? "+" : ""}
                      {ghiDelta}%)
                    </span>
                  </td>
                  <td className="px-3 py-2" style={{ color: METRIC_COLORS.generation }}>
                    {formatNumber(row.generation)}
                  </td>
                  <td className="px-3 py-2" style={{ color: METRIC_COLORS.readiness }}>
                    {row.readiness}%
                  </td>
                  <td className="px-3 py-2" style={{ color: METRIC_COLORS.adoption }}>
                    {row.adoption}%
                  </td>
                  <td className="px-3 py-2 font-semibold" style={{ color: METRIC_COLORS.opportunity }}>
                    {row.opportunityIndex}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${METRIC_COLORS.ghi}18`,
                        color: METRIC_COLORS.ghi,
                      }}
                    >
                      {row.potential}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className={`mt-2 text-xs ${dark ? "text-slate-500" : "text-slate-500"}`}>
        Showing {filtered.length} of {states.length} states · GHI in kWh/m²/day · Generation in MU
      </p>
    </section>
  );
}
