export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function mean(values) {
  if (!values?.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function pearsonCorrelation(xs, ys) {
  if (!xs?.length || xs.length !== ys?.length) return 0;
  const n = xs.length;
  if (n < 2) return 0;

  const mx = mean(xs);
  const my = mean(ys);

  let num = 0;
  let dx = 0;
  let dy = 0;

  for (let i = 0; i < n; i += 1) {
    const vx = xs[i] - mx;
    const vy = ys[i] - my;
    num += vx * vy;
    dx += vx * vx;
    dy += vy * vy;
  }

  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

export function formatNumber(value, opts) {
  if (!Number.isFinite(value)) return "--";
  return value.toLocaleString(undefined, opts);
}

