import { describe, expect, it } from "vitest";
import { defaultProjectionInputs } from "@/lib/claims";
import { opportunities } from "@/lib/opportunities";
import { detectOpportunityGaps, rankSolutionsForGaps } from "@/lib/solution-matching";
import { solutions } from "@/lib/solutions";

describe("gap-to-solution matching", () => {
  it("detects specialty gaps from the site-of-care opportunity", () => {
    const opportunity = opportunities.find((item) => item.id === "site")!;
    const gaps = detectOpportunityGaps(opportunity, defaultProjectionInputs);
    expect(gaps.map((gap) => gap.id)).toContain("specialty-share");
    expect(gaps.map((gap) => gap.id)).toContain("site-routing");
  });

  it("ranks GLP-1-specific solutions from the detected objectives", () => {
    const opportunity = opportunities.find((item) => item.id === "glp1")!;
    const gaps = detectOpportunityGaps(opportunity, defaultProjectionInputs);
    const ranked = rankSolutionsForGaps(solutions, gaps);
    expect(ranked[0].fit).toBeGreaterThanOrEqual(ranked.at(-1)!.fit);
    expect(ranked.slice(0, 3).some((item) => item.solution.id === "glp1-direct")).toBe(true);
  });
});
