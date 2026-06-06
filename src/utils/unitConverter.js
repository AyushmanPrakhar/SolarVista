export function convertFromMU(value, unit) {
  if (unit === "TWh") return value / 1000;
  if (unit === "MWh") return value * 1000;
  return value;
}
