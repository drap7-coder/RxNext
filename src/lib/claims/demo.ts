import { opportunities } from "@/lib/opportunities";
import { spendDrivers } from "@/lib/report-data";
import type { PbmClaimsData, PbmClaimsSnapshot } from "@/lib/claims/types";

export const demoClaimsSnapshot: PbmClaimsSnapshot = {
  scope: {
    periodLabel: "Sep 1–30, 2026",
    populationLives: 49954,
    basis: "Paid date · Net of estimated rebates",
    comparison: "Jun–Aug normalized baseline",
  },
  kpis: [
    {
      id: "net-spend",
      label: "Net pharmacy spend",
      valueLabel: "$4.76M",
      delta: 740320,
      deltaLabel: "vs. baseline",
      percent: 18.4,
      higherIsWorse: true,
    },
    {
      id: "net-pmpm",
      label: "Net PMPM",
      valueLabel: "$95.23",
      delta: 14.82,
      deltaLabel: "vs. baseline",
      percent: 18.4,
      higherIsWorse: true,
    },
    {
      id: "forecast",
      label: "Annualized forecast",
      valueLabel: "$57.1M",
      delta: 2180000,
      deltaLabel: "above plan",
      percent: 4.0,
      higherIsWorse: true,
    },
    {
      id: "explained",
      label: "Explained variance",
      valueLabel: "91.8%",
      delta: 679846,
      deltaLabel: "attributed",
      higherIsWorse: false,
      chipLabel: "High confidence",
      chipTone: "favorable",
    },
  ],
  drivers: spendDrivers,
  opportunities,
};

/** Demo PBM claims fixtures — swap for a work claims dataset later. */
export const demoClaimsData: PbmClaimsData = {
  id: "demo",
  label: "Demo PBM claims",
  async getSnapshot() {
    return demoClaimsSnapshot;
  },
  async getLineage(driverId) {
    return spendDrivers.find((d) => d.id === driverId)?.lineage ?? [];
  },
  async listOpportunities() {
    return opportunities;
  },
};
