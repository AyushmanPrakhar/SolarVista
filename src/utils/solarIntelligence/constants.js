/** Semantic metric colors — use consistently across all views */
export const METRIC_COLORS = {
  ghi: "#C2410C",
  generation: "#0D9488",
  readiness: "#1E3A8A",
  adoption: "#047857",
  opportunity: "#6D28D9",
  risk: "#B91C1C",
  neutral: "#64748B",
  trend: "#64748B",
  benchmark: "#94A3B8",
  monsoon: "rgba(30, 58, 138, 0.08)",
};

export const CHART_COLORS = { ...METRIC_COLORS };

export const GHI_SCALE = {
  min: 4.2,
  max: 6.6,
  stops: [
    { at: 0, color: "#1E3A8A" },
    { at: 0.35, color: "#047857" },
    { at: 0.65, color: "#EAB308" },
    { at: 1, color: "#C2410C" },
  ],
};

export const QUADRANT_THEME = {
  Leaders: { fill: "rgba(4, 120, 87, 0.14)", color: METRIC_COLORS.adoption, label: "Leaders" },
  "Investment Targets": { fill: "rgba(109, 40, 217, 0.14)", color: METRIC_COLORS.opportunity, label: "Investment Targets" },
  "Emerging Markets": { fill: "rgba(13, 148, 136, 0.12)", color: METRIC_COLORS.generation, label: "Emerging Markets" },
  "Policy Focus": {
    fill: "rgba(30, 58, 138, 0.12)",
    color: METRIC_COLORS.readiness,
    label: "Policy focus markets",
  },
};

export const ALL_STATES = "All States";
export const READINESS_THRESHOLD = 60;
export const ADOPTION_THRESHOLD = 55;
export const ADOPTION_MODERATE = 45;

export const LABEL_STATES = [
  "Rajasthan",
  "Gujarat",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Punjab",
  "Uttar Pradesh",
  "West Bengal",
  "Assam",
];

export const COMPARISON_STATES = [...LABEL_STATES];

export const MEDALS = ["1", "2", "3"];

export const RANKING_LIMIT = 10;

export const RADAR_PALETTE = ["#C2410C", "#1E3A8A", "#047857", "#6D28D9", "#0D9488", "#B91C1C"];

export const RISK_COLORS = { Low: "#047857", Medium: "#EAB308", High: "#B91C1C" };

export const stateCentroids = {};
