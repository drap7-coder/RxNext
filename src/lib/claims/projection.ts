import { demoClaimsSnapshot } from "@/lib/claims/demo";
import type { PbmClaimsSnapshot } from "@/lib/claims/types";

export type DemoProjectionInputs = {
  planName: string;
  lives: number;
  annualSpend: number;
  trendPercent: number;
  specialtySharePercent: number;
  pressurePoint: "balanced" | "glp1" | "specialty" | "biosimilar" | "rebates";
};

export const defaultProjectionInputs: DemoProjectionInputs = {
  planName: "ACME Holdings",
  lives: 49_954,
  annualSpend: 48_240_000,
  trendPercent: 18.4,
  specialtySharePercent: 52,
  pressurePoint: "glp1",
};

const pressureWeights: Record<DemoProjectionInputs["pressurePoint"], number[]> = {
  balanced: [0.36, 0.27, 0.2, 0.17],
  glp1: [0.45, 0.24, 0.18, 0.13],
  specialty: [0.28, 0.43, 0.16, 0.13],
  biosimilar: [0.3, 0.22, 0.14, 0.34],
  rebates: [0.3, 0.2, 0.36, 0.14],
};

function usd(value: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: Math.abs(value) >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: Math.abs(value) >= 1_000_000 ? 2 : digits,
  }).format(value);
}

export function sanitizeProjectionInputs(input: DemoProjectionInputs): DemoProjectionInputs {
  return {
    planName: input.planName.trim() || defaultProjectionInputs.planName,
    lives: Math.max(100, Math.round(Number(input.lives) || defaultProjectionInputs.lives)),
    annualSpend: Math.max(100_000, Number(input.annualSpend) || defaultProjectionInputs.annualSpend),
    trendPercent: Math.min(50, Math.max(-20, Number(input.trendPercent) || 0)),
    specialtySharePercent: Math.min(100, Math.max(0, Number(input.specialtySharePercent) || 0)),
    pressurePoint: pressureWeights[input.pressurePoint] ? input.pressurePoint : "balanced",
  };
}

/**
 * Produce the normalized snapshot consumed by Reports. A future PBM connector can
 * replace this adapter without changing the reporting or opportunity workflow.
 */
export function buildProjectionSnapshot(raw: DemoProjectionInputs): PbmClaimsSnapshot {
  const input = sanitizeProjectionInputs(raw);
  const baselineMonthly = input.annualSpend / 12;
  const projectedMonthly = baselineMonthly * (1 + input.trendPercent / 100);
  const monthlyDelta = projectedMonthly - baselineMonthly;
  const projectedPmpm = projectedMonthly / input.lives;
  const baselinePmpm = baselineMonthly / input.lives;
  const pmpmDelta = projectedPmpm - baselinePmpm;
  const explainedDelta = Math.abs(monthlyDelta) * 0.918;
  const specialtyFactor = Math.max(0.5, input.specialtySharePercent / 52);
  const rawWeights = pressureWeights[input.pressurePoint].map((weight, index) =>
    index === 1 || index === 3 ? weight * specialtyFactor : weight,
  );
  const weightTotal = rawWeights.reduce((sum, weight) => sum + weight, 0);
  const weights = rawWeights.map((weight) => weight / weightTotal);

  const drivers = demoClaimsSnapshot.drivers.map((driver, index) => {
    const dollars = Math.round(explainedDelta * weights[index]);
    return {
      ...driver,
      dollars,
      pmpm: dollars / input.lives,
      claims: Math.max(0, Math.round(driver.claims * (input.lives / defaultProjectionInputs.lives))),
      lineage: driver.lineage.map((claim) => ({
        ...claim,
        id: claim.id.replace(/^CLM|^REB/, "SAMPLE"),
        member: claim.member === "—" ? "—" : claim.member.replace("MBR", "DEMO"),
      })),
    };
  });

  const opportunities = demoClaimsSnapshot.opportunities.map((opportunity, index) => ({
    ...opportunity,
    value: drivers[index]?.dollars ?? opportunity.value,
    annual: Math.round((drivers[index]?.dollars ?? opportunity.value) * 12),
  }));

  return {
    scope: {
      periodLabel: "Illustrative year 1",
      populationLives: input.lives,
      basis: "User-entered assumptions · Illustrative",
      comparison: `${input.trendPercent.toFixed(1)}% trend projection`,
    },
    kpis: [
      {
        id: "net-spend",
        label: "Projected monthly spend",
        valueLabel: usd(projectedMonthly),
        delta: monthlyDelta,
        deltaLabel: "vs. current baseline",
        percent: input.trendPercent,
        higherIsWorse: true,
      },
      {
        id: "net-pmpm",
        label: "Projected PMPM",
        valueLabel: usd(projectedPmpm, 2),
        delta: pmpmDelta,
        deltaDigits: 2,
        deltaLabel: "vs. current baseline",
        percent: input.trendPercent,
        higherIsWorse: true,
      },
      {
        id: "forecast",
        label: "Projected annual spend",
        valueLabel: usd(projectedMonthly * 12),
        delta: monthlyDelta * 12,
        deltaLabel: "annualized variance",
        percent: input.trendPercent,
        higherIsWorse: true,
      },
      {
        id: "explained",
        label: "Modeled variance",
        valueLabel: "91.8%",
        delta: explainedDelta,
        deltaLabel: "allocated to illustrative drivers",
        higherIsWorse: false,
        chipLabel: "Projection",
        chipTone: "neutral",
      },
    ],
    drivers,
    opportunities,
  };
}
