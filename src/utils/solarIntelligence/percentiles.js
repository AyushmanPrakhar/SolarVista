import { METRIC_COLORS } from "./constants";

const METRIC_KEYS = {
  ghi: { key: "ghi", label: "Resource Quality (GHI)", color: METRIC_COLORS.ghi, higherIsBetter: true },
  generation: { key: "generation", label: "Generation Capacity", color: METRIC_COLORS.generation, higherIsBetter: true },
  readiness: { key: "readiness", label: "Market Readiness", color: METRIC_COLORS.readiness, higherIsBetter: true },
  adoption: { key: "adoption", label: "Adoption Maturity", color: METRIC_COLORS.adoption, higherIsBetter: true },
  opportunityIndex: { key: "opportunityIndex", label: "Investment Opportunity", color: METRIC_COLORS.opportunity, higherIsBetter: true },
};

export function rankStates(states, metricKey, higherIsBetter = true) {
  const sorted = [...states].sort((a, b) =>
    higherIsBetter ? b[metricKey] - a[metricKey] : a[metricKey] - b[metricKey]
  );
  const rankMap = new Map();
  sorted.forEach((row, index) => rankMap.set(row.state, index + 1));
  return { sorted, rankMap, total: states.length };
}

export function percentileFromRank(rank, total) {
  if (total <= 1) return 100;
  return Math.round(((total - rank + 1) / total) * 100);
}

export function buildStateScorecard(state, states, nationalSummary) {
  const total = states.length;
  const cards = [];

  Object.values(METRIC_KEYS).forEach(({ key, label, color, higherIsBetter }) => {
    const { rankMap } = rankStates(states, key, higherIsBetter);
    const rank = rankMap.get(state.state) ?? total;
    const pct = percentileFromRank(rank, total);
    const national =
      key === "ghi"
        ? nationalSummary.avgGhi
        : key === "generation"
          ? nationalSummary.totalGeneration / total
          : states.reduce((s, r) => s + r[key], 0) / total;

    cards.push({
      label,
      value: state[key],
      display: formatMetricValue(key, state[key]),
      national,
      nationalDisplay: formatMetricValue(key, national),
      rank,
      percentile: pct,
      color,
    });
  });

  return cards;
}

function formatMetricValue(key, value) {
  if (key === "ghi") return `${Number(value).toFixed(2)} kWh/m²/day`;
  if (key === "generation") return `${Math.round(value).toLocaleString("en-IN")} MU`;
  if (key === "opportunityIndex") return `${value} pts`;
  return `${Number(value).toFixed(1)}%`;
}

export function getRankedList(states, metricKey, limit = 10) {
  const { sorted, rankMap } = rankStates(states, metricKey, true);
  const national = states.reduce((s, r) => s + r[metricKey], 0) / states.length;
  return sorted.slice(0, limit).map((row) => ({
    ...row,
    rank: rankMap.get(row.state),
    vsNational: metricKey === "ghi" ? ((row[metricKey] / national - 1) * 100).toFixed(0) : null,
  }));
}
