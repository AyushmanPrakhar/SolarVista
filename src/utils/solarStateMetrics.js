import indiaFullData from "../data/indiaFullData";

export const ALL_STATES = "All";

export function normalizeStateName(name = "") {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function buildSolarStateMetrics() {
  return indiaFullData
    .map(([state, city, lat, lng, ghi], index) => {
      const aerosolIndex = Number(
        Math.max(18, 56 - ghi * 4.1 + ((index * 7) % 11) - 5).toFixed(1)
      );

      return {
        state,
        city,
        lat,
        lng,
        ghi,
        potential: Math.round(ghi * 365),
        aerosolIndex,
      };
    })
    .sort((a, b) => b.ghi - a.ghi);
}

export function getGhiColor(ghi, minGhi, maxGhi, alpha = 185) {
  if (!Number.isFinite(ghi)) {
    return [30, 41, 59, 95];
  }

  const range = Math.max(maxGhi - minGhi, 0.01);
  const t = Math.min(1, Math.max(0, (ghi - minGhi) / range));

  if (t < 0.5) {
    const local = t / 0.5;
    return [
      Math.round(37 + (34 - 37) * local),
      Math.round(99 + (197 - 99) * local),
      Math.round(235 + (94 - 235) * local),
      alpha,
    ];
  }

  const local = (t - 0.5) / 0.5;
  return [
    Math.round(34 + (249 - 34) * local),
    Math.round(197 + (115 - 197) * local),
    Math.round(94 + (22 - 94) * local),
    alpha,
  ];
}
