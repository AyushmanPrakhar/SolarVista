import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip as MapTooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Insights from "../components/Insights";

import solarGeneration from "../data/solar_generation.json";
import stateCoordinates from "../data/stateCoordinates";

const UNITS = ["MU", "GWh", "TWh", "MWh"];
const ALL_STATES = "All States";
const ALL_MONTHS = "All Months";

function convertFromMU(value, unit) {
  if (unit === "TWh") return value / 1000;
  if (unit === "MWh") return value * 1000;
  return value;
}

function formatValue(value, unit) {
  return `${convertFromMU(value, unit).toLocaleString(undefined, {
    maximumFractionDigits: unit === "TWh" ? 2 : 0,
  })} ${unit}`;
}

function aggregateByState(records) {
  return records.reduce((totals, record) => {
    totals[record.state] = (totals[record.state] || 0) + record.generation_mu;
    return totals;
  }, {});
}

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}
    >
      {children}
    </section>
  );
}

function KpiCard({ label, value, detail }) {
  return (
    <Card>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </Card>
  );
}

function FlyToSelectedState({ selectedState }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedState || selectedState === ALL_STATES) return;

    const coords = stateCoordinates[selectedState];
    if (coords) {
      map.flyTo(coords, 6, { duration: 0.8 });
    }
  }, [map, selectedState]);

  return null;
}

export default function GenerationDashboard() {
  const [year, setYear] = useState("All Years");
  const [month, setMonth] = useState(ALL_MONTHS);
  const [state, setState] = useState(ALL_STATES);
  const [unit, setUnit] = useState("MU");
  const mapRef = useRef(null);

  const years = useMemo(
    () =>
      ["All Years", ...new Set(solarGeneration.map((record) => record.year))]
        .filter(Boolean)
        .sort((a, b) => (a === "All Years" ? -1 : b === "All Years" ? 1 : a - b)),
    []
  );

  const months = useMemo(
    () => [ALL_MONTHS, ...new Set(solarGeneration.map((record) => record.month))],
    []
  );

  const states = useMemo(
    () => [ALL_STATES, ...new Set(solarGeneration.map((record) => record.state))],
    []
  );

  const filteredRecords = useMemo(
    () =>
      solarGeneration.filter((record) => {
        const matchesYear = year === "All Years" || record.year === Number(year);
        const matchesMonth = month === ALL_MONTHS || record.month === month;
        const matchesState = state === ALL_STATES || record.state === state;

        return matchesYear && matchesMonth && matchesState;
      }),
    [month, state, year]
  );

  const stateTotals = useMemo(
    () => aggregateByState(filteredRecords),
    [filteredRecords]
  );

  const allMapStateTotals = useMemo(() => {
    const records = solarGeneration.filter((record) => {
      const matchesYear = year === "All Years" || record.year === Number(year);
      const matchesMonth = month === ALL_MONTHS || record.month === month;
      return matchesYear && matchesMonth;
    });

    return aggregateByState(records);
  }, [month, year]);

  const totalGeneration = filteredRecords.reduce(
    (sum, record) => sum + record.generation_mu,
    0
  );

  const topStateEntry = Object.entries(stateTotals).sort(
    ([, a], [, b]) => b - a
  )[0];

  const monthlyTrend = useMemo(() => {
    const totals = solarGeneration
      .filter((record) => {
        const matchesYear = year === "All Years" || record.year === Number(year);
        const matchesState = state === ALL_STATES || record.state === state;
        return matchesYear && matchesState;
      })
      .reduce((acc, record) => {
        const key = year === "All Years" ? `${record.month} ${record.year}` : record.month;
        acc[key] = (acc[key] || 0) + record.generation_mu;
        return acc;
      }, {});

    return Object.entries(totals).map(([label, value]) => ({
      label,
      generation: Number(convertFromMU(value, unit).toFixed(2)),
    }));
  }, [state, unit, year]);

  const topStates = useMemo(
    () =>
      Object.entries(stateTotals)
        .map(([name, value]) => ({
          state: name,
          generation: Number(convertFromMU(value, unit).toFixed(2)),
        }))
        .sort((a, b) => b.generation - a.generation)
        .slice(0, 10),
    [stateTotals, unit]
  );

  const maxMapValue = Math.max(...Object.values(allMapStateTotals), 1);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            State solar data
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Generation Dashboard
          </h1>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          Explore solar generation by year, month, state, and reporting unit
          without affecting the existing analytics pages.
        </p>
      </header>

      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-600">Year</span>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {years.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-600">Month</span>
            <select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {months.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-600">State</span>
            <select
              value={state}
              onChange={(event) => setState(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {states.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-600">Unit</span>
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {UNITS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Generation"
          value={formatValue(totalGeneration, unit)}
          detail="Filtered generation volume"
        />
        <KpiCard
          label="States Covered"
          value={Object.keys(stateTotals).length}
          detail="States in current result"
        />
        <KpiCard
          label="Records"
          value={filteredRecords.length}
          detail="Dataset rows after filters"
        />
        <KpiCard
          label="Top State"
          value={topStateEntry ? topStateEntry[0] : "No data"}
          detail={topStateEntry ? formatValue(topStateEntry[1], unit) : "Adjust filters"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">
              State Generation Map
            </h2>
            <p className="text-sm text-slate-500">
              Circle size represents generation for the selected year and month.
            </p>
          </div>
          <div className="h-[500px] overflow-hidden rounded-lg">
            <MapContainer
              center={[22.9734, 78.6569]}
              zoom={5}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToSelectedState selectedState={state} />
              {Object.entries(allMapStateTotals).map(([name, value]) => {
                const coords = stateCoordinates[name];
                if (!coords) return null;

                const isSelected = state === name;
                const radius = 6 + (value / maxMapValue) * 18;

                return (
                  <CircleMarker
                    key={name}
                    center={coords}
                    radius={isSelected ? radius + 4 : radius}
                    pathOptions={{
                      color: isSelected ? "#0f172a" : "#ffffff",
                      fillColor: isSelected ? "#f59e0b" : "#22c55e",
                      fillOpacity: 0.72,
                      opacity: 0.95,
                      weight: isSelected ? 3 : 1,
                    }}
                  >
                    <MapTooltip direction="top" offset={[0, -4]} opacity={1}>
                      <div className="text-sm">
                        <p className="font-semibold text-slate-900">{name}</p>
                        <p className="text-slate-700">{formatValue(value, unit)}</p>
                      </div>
                    </MapTooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-950">
              Top States
            </h2>
            <p className="text-sm text-slate-500">
              Highest generation states for the active filters.
            </p>
          </div>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={topStates} layout="vertical" margin={{ left: 34 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="state"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="generation" fill="#22c55e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-950">
            Monthly Trend
          </h2>
          <p className="text-sm text-slate-500">
            Generation trend for the selected state and year scope.
          </p>
        </div>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="generation"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
