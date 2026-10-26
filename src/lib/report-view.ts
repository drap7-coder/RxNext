import type { DemoProjectionInputs, PbmClaimsSnapshot, ReportKpi } from "@/lib/claims";
import type { ReportView, SpendDriver } from "@/lib/report-data";

export type ReportViewModel = {
  description: string;
  kpis: ReportKpi[];
  trendEyebrow: string;
  trendTitle: string;
  trendMetricLabel: string;
  trendMetricValue: string;
  comparisonLabel: string;
  comparisonValue: string;
  queueTitle: string;
  decompositionTitle: string;
  drivers: SpendDriver[];
};

function percent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

function compactMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function orderedDrivers(claims: PbmClaimsSnapshot, ids: string[]) {
  return ids.map((id) => claims.drivers.find((driver) => driver.id === id)).filter(Boolean) as SpendDriver[];
}

function metric(
  id: string,
  label: string,
  valueLabel: string,
  delta: number,
  deltaValueLabel: string,
  deltaLabel: string,
  higherIsWorse: boolean,
): ReportKpi {
  return {
    id,
    label,
    valueLabel,
    delta,
    deltaValueLabel,
    deltaLabel,
    higherIsWorse,
    chipLabel: "Modeled",
    chipTone: "neutral",
  };
}

export function buildReportViewModel(
  view: ReportView,
  projection: DemoProjectionInputs,
  claims: PbmClaimsSnapshot,
): ReportViewModel {
  const monthly = projection.annualSpend / 12;
  const all = claims.drivers;
  const defaultModel: ReportViewModel = {
    description: "Net cost, utilization, and opportunity performance across the pharmacy benefit.",
    kpis: claims.kpis,
    trendEyebrow: "Projected net paid trend",
    trendTitle: "Cost performance",
    trendMetricLabel: "Projected monthly",
    trendMetricValue: claims.kpis[0].valueLabel,
    comparisonLabel: "Current baseline range",
    comparisonValue: `${compactMoney(monthly * 0.96)}–${compactMoney(monthly * 1.04)}`,
    queueTitle: "Material exceptions",
    decompositionTitle: "Projected drivers",
    drivers: all,
  };

  if (view === "Overview") return defaultModel;

  if (view === "Spend performance") {
    return {
      ...defaultModel,
      description: "Projected gross-to-net spend, PMPM movement, and the largest financial variances.",
      trendEyebrow: "Spend projection",
      trendTitle: "Gross-to-net trajectory",
      queueTitle: "Largest cost pressures",
      decompositionTitle: "Spend variance bridge",
      drivers: [...all].sort((a, b) => b.dollars - a.dollars),
    };
  }

  if (view === "Utilization") {
    const scripts = Math.round(projection.lives * 1.18);
    const utilizers = Math.round(projection.lives * 0.72);
    return {
      ...defaultModel,
      description: "Modeled prescription volume, utilization intensity, and emerging demand signals.",
      kpis: [
        metric("scripts", "Projected monthly scripts", scripts.toLocaleString(), 8.2, "+8.2%", "vs. current run rate", true),
        metric("utilizers", "Active utilizers", utilizers.toLocaleString(), 4.7, "+4.7%", "vs. current population", true),
        metric("rx-member", "Scripts per member", "1.18", 0.09, "+0.09", "per member", true),
        metric("adherence", "Modeled adherence", "82.4%", 2.1, "+2.1 pts", "opportunity-adjusted", false),
      ],
      trendEyebrow: "Utilization projection",
      trendTitle: "Prescription volume",
      trendMetricLabel: "Projected monthly scripts",
      trendMetricValue: scripts.toLocaleString(),
      comparisonLabel: "Current run rate",
      comparisonValue: Math.round(scripts / 1.082).toLocaleString(),
      queueTitle: "Utilization signals",
      decompositionTitle: "Utilization drivers",
      drivers: orderedDrivers(claims, ["glp1", "biosimilar", "specialty", "rebate"]),
    };
  }

  if (view === "Specialty") {
    const specialtySpend = projection.annualSpend * (projection.specialtySharePercent / 100);
    const opportunity = claims.drivers.find((driver) => driver.id === "specialty")?.dollars ?? 0;
    return {
      ...defaultModel,
      description: "Specialty exposure, site-of-care pressure, and modeled intervention value.",
      kpis: [
        metric("share", "Specialty share", percent(projection.specialtySharePercent, 0), projection.specialtySharePercent - 48, `${projection.specialtySharePercent - 48 >= 0 ? "+" : ""}${(projection.specialtySharePercent - 48).toFixed(0)} pts`, "vs. benchmark", true),
        metric("specialty-spend", "Annual specialty spend", compactMoney(specialtySpend), specialtySpend - projection.annualSpend * 0.48, compactMoney(specialtySpend - projection.annualSpend * 0.48), "vs. 48% benchmark", true),
        metric("site-care", "Site-of-care exposure", compactMoney(opportunity * 12), opportunity * 12, compactMoney(opportunity * 12), "annualized", true),
        metric("specialty-opportunity", "Modeled opportunity", compactMoney(opportunity * 12 * 0.32), opportunity * 12 * 0.32, compactMoney(opportunity * 12 * 0.32), "addressable range", false),
      ],
      trendEyebrow: "Specialty projection",
      trendTitle: "Specialty spend trajectory",
      trendMetricLabel: "Projected annual specialty",
      trendMetricValue: compactMoney(specialtySpend * (1 + projection.trendPercent / 100)),
      comparisonLabel: "Current specialty spend",
      comparisonValue: compactMoney(specialtySpend),
      queueTitle: "Specialty interventions",
      decompositionTitle: "Specialty cost drivers",
      drivers: orderedDrivers(claims, ["specialty", "biosimilar", "glp1", "rebate"]),
    };
  }

  if (view === "Formulary") {
    const biosimilar = claims.drivers.find((driver) => driver.id === "biosimilar")?.dollars ?? 0;
    return {
      ...defaultModel,
      description: "Illustrative formulary efficiency, preferred-product adoption, and leakage exposure.",
      kpis: [
        metric("gdr", "Generic dispensing rate", "88.2%", 1.4, "+1.4 pts", "vs. current estimate", false),
        metric("preferred", "Preferred utilization", "84.7%", -3.6, "-3.6 pts", "to modeled target", true),
        metric("leakage", "Nonpreferred leakage", compactMoney(biosimilar * 12), biosimilar * 12, compactMoney(biosimilar * 12), "annualized exposure", true),
        metric("conversion", "Modeled conversion value", compactMoney(biosimilar * 12 * 0.38), biosimilar * 12 * 0.38, compactMoney(biosimilar * 12 * 0.38), "addressable", false),
      ],
      trendEyebrow: "Formulary projection",
      trendTitle: "Preferred-product adoption",
      trendMetricLabel: "Modeled preferred utilization",
      trendMetricValue: "84.7%",
      comparisonLabel: "Target range",
      comparisonValue: "88–92%",
      queueTitle: "Formulary exceptions",
      decompositionTitle: "Leakage drivers",
      drivers: orderedDrivers(claims, ["biosimilar", "glp1", "specialty", "rebate"]),
    };
  }

  const rebate = claims.drivers.find((driver) => driver.id === "rebate")?.dollars ?? 0;
  const estimatedRebates = projection.annualSpend * 0.18;
  return {
    ...defaultModel,
    description: "Estimated rebate yield, settlement timing, and guarantee exposure under demo assumptions.",
    kpis: [
      metric("rebates", "Estimated annual rebates", compactMoney(estimatedRebates), estimatedRebates, compactMoney(estimatedRebates), "illustrative gross value", false),
      metric("yield", "Estimated rebate yield", "18.0%", 1.2, "+1.2 pts", "vs. modeled baseline", false),
      metric("timing", "Settlement timing exposure", compactMoney(rebate * 12), rebate * 12, compactMoney(rebate * 12), "annualized", true),
      metric("guarantee", "Guarantee confidence", "92.0%", -8, "8 pts", "remaining uncertainty", true),
    ],
    trendEyebrow: "Rebate projection",
    trendTitle: "Gross-to-net realization",
    trendMetricLabel: "Estimated annual rebates",
    trendMetricValue: compactMoney(estimatedRebates),
    comparisonLabel: "Modeled yield",
    comparisonValue: "18.0% of gross spend",
    queueTitle: "Contract attention",
    decompositionTitle: "Rebate and guarantee drivers",
    drivers: orderedDrivers(claims, ["rebate", "glp1", "biosimilar", "specialty"]),
  };
}
