export function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value ?? 0);
}

export function formatPercent(value, digits = 1) {
  return `${formatNumber(value, digits)}%`;
}

export function formatGhi(value) {
  return `${formatNumber(value, 2)} kWh/m²/day`;
}

export function formatMu(value) {
  return `${formatNumber(value)} MU`;
}

export function formatInr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatDeltaPct(value, digits = 1) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, digits)}%`;
}

export function normalizeStateName(name = "") {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
