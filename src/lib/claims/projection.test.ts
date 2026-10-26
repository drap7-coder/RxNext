import { describe, expect, it } from "vitest";
import {
  buildProjectionSnapshot,
  defaultProjectionInputs,
  sanitizeProjectionInputs,
} from "@/lib/claims/projection";

describe("demo projection", () => {
  it("scales spend and PMPM from user assumptions", () => {
    const snapshot = buildProjectionSnapshot({
      ...defaultProjectionInputs,
      lives: 10_000,
      annualSpend: 12_000_000,
      trendPercent: 10,
    });

    expect(snapshot.scope.populationLives).toBe(10_000);
    expect(snapshot.kpis[0].valueLabel).toBe("$1.1M");
    expect(snapshot.kpis[1].valueLabel).toBe("$110.00");
    expect(snapshot.kpis[1].delta).toBeCloseTo(10);
  });

  it("changes driver emphasis without changing the normalized contract", () => {
    const glp = buildProjectionSnapshot({ ...defaultProjectionInputs, pressurePoint: "glp1" });
    const specialty = buildProjectionSnapshot({ ...defaultProjectionInputs, pressurePoint: "specialty" });

    expect(glp.drivers[0].dollars).toBeGreaterThan(glp.drivers[1].dollars);
    expect(specialty.drivers[1].dollars).toBeGreaterThan(specialty.drivers[0].dollars);
    expect(glp.opportunities[0].value).toBe(glp.drivers[0].dollars);
  });

  it("sanitizes unsafe or empty input ranges", () => {
    const sanitized = sanitizeProjectionInputs({
      planName: " ",
      lives: -1,
      annualSpend: 0,
      trendPercent: 99,
      specialtySharePercent: -4,
      pressurePoint: "balanced",
    });

    expect(sanitized.planName).toBe(defaultProjectionInputs.planName);
    expect(sanitized.lives).toBeGreaterThanOrEqual(100);
    expect(sanitized.annualSpend).toBeGreaterThanOrEqual(100_000);
    expect(sanitized.trendPercent).toBe(50);
    expect(sanitized.specialtySharePercent).toBe(0);
  });
});
