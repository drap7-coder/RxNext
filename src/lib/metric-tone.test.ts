import { describe, expect, it } from "vitest";
import { metricTone, signedMoney, signedPercent, toneClass } from "@/lib/metric-tone";

describe("metricTone", () => {
  it("treats higher cost as adverse and lower cost as favorable", () => {
    expect(metricTone(100, { higherIsWorse: true })).toBe("adverse");
    expect(metricTone(-50, { higherIsWorse: true })).toBe("favorable");
  });

  it("treats higher savings/ROI as favorable and losses as adverse", () => {
    expect(metricTone(250_000, { higherIsWorse: false })).toBe("favorable");
    expect(metricTone(-10_000, { higherIsWorse: false })).toBe("adverse");
  });

  it("defaults higherIsWorse to false", () => {
    expect(metricTone(1)).toBe("favorable");
    expect(metricTone(-1)).toBe("adverse");
  });

  it("returns neutral for zero and near-zero within epsilon", () => {
    expect(metricTone(0)).toBe("neutral");
    expect(metricTone(1e-12)).toBe("neutral");
    expect(metricTone(-1e-12)).toBe("neutral");
    expect(metricTone(0.05, { epsilon: 0.1 })).toBe("neutral");
    expect(metricTone(0.2, { epsilon: 0.1 })).toBe("favorable");
  });

  it("returns neutral for non-finite values", () => {
    expect(metricTone(Number.NaN)).toBe("neutral");
    expect(metricTone(Number.POSITIVE_INFINITY)).toBe("neutral");
    expect(metricTone(Number.NEGATIVE_INFINITY)).toBe("neutral");
  });
});

describe("tone helpers", () => {
  it("builds tone class names", () => {
    expect(toneClass("adverse")).toBe("delta--adverse");
    expect(toneClass("favorable", "chip")).toBe("chip--favorable");
  });

  it("formats signed money and percent", () => {
    expect(signedMoney(740320)).toBe("+$740,320");
    expect(signedMoney(-1200)).toBe("-$1,200");
    expect(signedMoney(0)).toBe("$0");
    expect(signedPercent(18.4)).toBe("+18.4%");
    expect(signedPercent(-4)).toBe("-4.0%");
  });
});
