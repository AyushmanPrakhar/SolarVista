export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// A lightweight synthetic seasonality curve (monsoon dip mid-year).
// Used to render a consistent monthly trend chart for state-level metrics
// that otherwise have only a single GHI number.
export const INDIA_SEASONALITY = [0.93, 0.98, 1.03, 1.06, 1.05, 0.96, 0.84, 0.82, 0.90, 1.00, 1.03, 0.97];

