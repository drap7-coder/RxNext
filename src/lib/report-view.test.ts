import { describe, expect, it } from "vitest";
import { buildProjectionSnapshot, defaultProjectionInputs } from "@/lib/claims";
import { buildReportViewModel } from "@/lib/report-view";
import { reportViews } from "@/lib/report-data";

describe("report view models", () => {
  const claims = buildProjectionSnapshot(defaultProjectionInputs);

  it("provides a distinct, complete model for every report tab", () => {
    const models = reportViews.map((view) => buildReportViewModel(view, defaultProjectionInputs, claims));
    expect(models.every((model) => model.kpis.length === 4 && model.drivers.length === 4)).toBe(true);
    expect(new Set(models.map((model) => model.description)).size).toBe(reportViews.length);
  });

  it("prioritizes specialty and rebate drivers in their respective views", () => {
    expect(buildReportViewModel("Specialty", defaultProjectionInputs, claims).drivers[0].id).toBe("specialty");
    expect(buildReportViewModel("Rebates", defaultProjectionInputs, claims).drivers[0].id).toBe("rebate");
  });
});
