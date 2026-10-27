import type { DemoProjectionInputs } from "@/lib/claims";
import type { Opportunity } from "@/lib/opportunities";
import { solutionScore, type Objective, type Solution } from "@/lib/solutions";

export type GapSignal = {
  id: string;
  label: string;
  observed: string;
  target: string;
  difference: string;
  objectives: Objective[];
};

function signed(value: number, suffix: string) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}${suffix}`;
}

export function detectOpportunityGaps(
  opportunity: Opportunity,
  projection: DemoProjectionInputs,
): GapSignal[] {
  const text = `${opportunity.name} ${opportunity.driver}`.toLowerCase();
  const trendGap = projection.trendPercent - 8;
  const specialtyGap = projection.specialtySharePercent - 48;

  if (/glp|obesity|diabetes/.test(text)) {
    return [
      {
        id: "glp-trend",
        label: "GLP-1 trend pressure",
        observed: `${projection.trendPercent.toFixed(1)}% projected trend`,
        target: "≤8.0% managed trend",
        difference: signed(trendGap, " pts"),
        objectives: ["glp1", "lower-cost", "member-experience"],
      },
      {
        id: "glp-pathway",
        label: "Access pathway",
        observed: "Fragmented coverage journey",
        target: "Clinical eligibility + guided access",
        difference: "Workflow gap",
        objectives: ["glp1", "member-experience", "transparency"],
      },
    ];
  }

  if (/site.of.care|specialty|infusion/.test(text)) {
    return [
      {
        id: "specialty-share",
        label: "Specialty concentration",
        observed: `${projection.specialtySharePercent.toFixed(0)}% of pharmacy spend`,
        target: "48% reference share",
        difference: signed(specialtyGap, " pts"),
        objectives: ["specialty", "lower-cost", "transparency"],
      },
      {
        id: "site-routing",
        label: "Site-of-care routing",
        observed: "Hospital outpatient leakage",
        target: "Lowest appropriate care setting",
        difference: "Routing gap",
        objectives: ["specialty", "lower-cost", "member-experience"],
      },
    ];
  }

  if (/biosimilar|formulary|reference.product/.test(text)) {
    return [
      {
        id: "preferred-use",
        label: "Preferred-product adoption",
        observed: "84.7% modeled utilization",
        target: "≥90% preferred utilization",
        difference: "-5.3 pts",
        objectives: ["lower-cost", "specialty", "fast-launch"],
      },
      {
        id: "member-routing",
        label: "Member and prescriber routing",
        observed: "Passive formulary signal",
        target: "Active lower-cost navigation",
        difference: "Action gap",
        objectives: ["lower-cost", "member-experience", "fast-launch"],
      },
    ];
  }

  if (/rebate|guarantee|contract|settlement/.test(text)) {
    return [
      {
        id: "rebate-timing",
        label: "Settlement timing",
        observed: "Post-close reconciliation",
        target: "In-period guarantee visibility",
        difference: "Control gap",
        objectives: ["transparency", "lower-cost", "fast-launch"],
      },
      {
        id: "contract-proof",
        label: "Guarantee proof",
        observed: "92% modeled confidence",
        target: "100% claim-level reconciliation",
        difference: "8 pts uncertain",
        objectives: ["transparency", "lower-cost"],
      },
    ];
  }

  return [
    {
      id: "net-cost",
      label: "Net-cost trend",
      observed: `${projection.trendPercent.toFixed(1)}% projected trend`,
      target: "≤8.0% reference trend",
      difference: signed(trendGap, " pts"),
      objectives: ["lower-cost", "transparency", "fast-launch"],
    },
  ];
}

export function rankSolutionsForGaps(
  catalog: Solution[],
  gaps: GapSignal[],
): Array<{ solution: Solution; fit: number; reasons: string[] }> {
  const objectives = [...new Set(gaps.flatMap((gap) => gap.objectives))];
  return catalog
    .map((solution) => ({
      solution,
      fit: solutionScore(solution, objectives),
      reasons: gaps.slice(0, 2).map((gap) => {
        const bestObjective = gap.objectives
          .map((objective) => ({ objective, score: solution.scores[objective] }))
          .sort((a, b) => b.score - a.score)[0];
        return `${gap.label}: ${bestObjective.score}/5 ${bestObjective.objective.replaceAll("-", " ")} fit`;
      }),
    }))
    .sort((a, b) => b.fit - a.fit || a.solution.name.localeCompare(b.solution.name));
}
