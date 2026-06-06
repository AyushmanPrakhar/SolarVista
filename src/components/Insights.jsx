import { convertFromMU } from "../utils/unitConverter";

export default function Insights({ data, unit, onSelectState }) {
  if (!data || data.length === 0) return null;

  // Total
  const total = data.reduce((sum, d) => sum + d.generation_mu, 0);

  // State totals
  const stateMap = {};
  data.forEach(d => {
    stateMap[d.state] = (stateMap[d.state] || 0) + d.generation_mu;
  });

  const sortedStates = Object.entries(stateMap).sort((a, b) => b[1] - a[1]);
  const topState = sortedStates[0];

  // Monthly trend
  const monthMap = {};
  data.forEach(d => {
    monthMap[d.month] = (monthMap[d.month] || 0) + d.generation_mu;
  });

  const months = Object.keys(monthMap);
  let trend = "stable";

  if (months.length > 1) {
    const first = monthMap[months[0]];
    const last = monthMap[months[months.length - 1]];

    if (last > first) trend = "increasing";
    else if (last < first) trend = "decreasing";
  }

  // Simple anomaly
  const avg = total / data.length;
  const anomaly = data.find(
    d => d.generation_mu > avg * 2 || d.generation_mu < avg * 0.5
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-950 mb-2">
        AI Insights
      </h3>

      {/* 🔥 Clickable Top State */}
      <p
        onClick={() => onSelectState(topState[0])}
        className="cursor-pointer hover:underline text-blue-600"
      >
        🔥 <b>{topState[0]}</b> is the top-performing state with{" "}
        {convertFromMU(topState[1], unit).toFixed(2)} {unit}
      </p>

      <p className="mt-2">
        📈 Solar generation trend is <b>{trend}</b>.
      </p>

      {/* ⚠️ Clickable anomaly */}
      {anomaly && (
        <p
          onClick={() => onSelectState(anomaly.state)}
          className="cursor-pointer hover:underline text-red-600 mt-2"
        >
          ⚠️ Anomaly detected in <b>{anomaly.state}</b> during {anomaly.month}
        </p>
      )}
    </div>
  );
}
