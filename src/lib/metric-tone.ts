/**
 * Semantic tone for pharmacy metrics.
 * Cost/variance-up is adverse; savings / opportunity value / positive ROI is favorable.
 */
export type MetricTone = "adverse" | "favorable" | "neutral";

export type MetricToneOptions = {
  /** When true, higher values are bad (spend, PMPM above baseline). Default false. */
  higherIsWorse?: boolean;
  epsilon?: number;
};

export function metricTone(
  value: number,
  { higherIsWorse = false, epsilon = 1e-9 }: MetricToneOptions = {},
): MetricTone {
  if (!Number.isFinite(value) || Math.abs(value) <= epsilon) return "neutral";
  const positive = value > 0;
  if (higherIsWorse) return positive ? "adverse" : "favorable";
  return positive ? "favorable" : "adverse";
}

export function toneClass(tone: MetricTone, prefix = "delta"): string {
  return `${prefix}--${tone}`;
}

/** Signed currency for deltas, e.g. +$740,320 / -$12,000 */
export function signedMoney(n: number, digits = 0): string {
  const abs = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(Math.abs(n));
  if (n > 0) return `+${abs}`;
  if (n < 0) return `-${abs}`;
  return abs;
}

/** Signed percent chip, e.g. +18.4% */
export function signedPercent(n: number, digits = 1): string {
  const body = `${Math.abs(n).toFixed(digits)}%`;
  if (n > 0) return `+${body}`;
  if (n < 0) return `-${body}`;
  return body;
}
