import type { Opportunity } from "@/lib/opportunities";
import type { LineageClaim, SpendDriver } from "@/lib/report-data";

/** Reporting scope for PBM claims snapshots. */
export type ReportScope = {
  periodLabel: string;
  populationLives: number;
  basis: string;
  comparison: string;
};

export type ReportKpi = {
  id: string;
  label: string;
  valueLabel: string;
  /** Signed delta used for tone (e.g. spend vs baseline). */
  delta: number;
  /** Optional non-currency presentation for a delta, such as +8.2 pts. */
  deltaValueLabel?: string;
  /** Decimal precision for the displayed currency delta. */
  deltaDigits?: number;
  deltaLabel: string;
  percent?: number;
  /** Cost KPIs: higher is worse. Savings / explained value: higher is better. */
  higherIsWorse: boolean;
  chipLabel?: string;
  chipTone?: "favorable" | "adverse" | "neutral";
};

/** Normalized pharmacy claims analytics snapshot for Reports + Opportunities. */
export type PbmClaimsSnapshot = {
  scope: ReportScope;
  kpis: ReportKpi[];
  drivers: SpendDriver[];
  opportunities: Opportunity[];
};

export type PbmClaimsData = {
  id: "demo" | "work";
  label: string;
  getSnapshot(): Promise<PbmClaimsSnapshot>;
  getLineage(driverId: string): Promise<LineageClaim[]>;
  listOpportunities(): Promise<Opportunity[]>;
};
