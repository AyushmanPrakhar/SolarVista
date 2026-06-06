export function getChartTheme(dark) {
  return {
    grid: dark ? "#334155" : "#e2e8f0",
    axis: dark ? "#94a3b8" : "#475569",
    label: dark ? "#cbd5e1" : "#64748b",
    tooltip: {
      background: dark ? "#1e293b" : "#ffffff",
      border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
      borderRadius: 12,
      boxShadow: dark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 18px 40px rgba(15, 23, 42, 0.14)",
      color: dark ? "#f1f5f9" : "#0f172a",
      fontSize: 13,
    },
  };
}
