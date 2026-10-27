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
  capabilityTerms: string[];
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
        capabilityTerms: [
          "glp",
          "clinical",
          "eligibility",
          "navigation",
          "routing",
        ],
      },
      {
        id: "glp-pathway",
        label: "Access pathway",
        observed: "Fragmented coverage journey",
        target: "Clinical eligibility + guided access",
        difference: "Workflow gap",
        objectives: ["glp1", "member-experience", "transparency"],
        capabilityTerms: [
          "glp",
          "clinical",
          "eligibility",
          "navigation",
          "prescribing",
        ],
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
        capabilityTerms: ["specialty", "routing", "marketplace", "network"],
      },
      {
        id: "site-routing",
        label: "Site-of-care routing",
        observed: "Hospital outpatient leakage",
        target: "Lowest appropriate care setting",
        difference: "Routing gap",
        objectives: ["specialty", "lower-cost", "member-experience"],
        capabilityTerms: ["specialty", "routing", "marketplace", "network"],
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
        capabilityTerms: [
          "formulary",
          "specialty",
          "claims",
          "navigation",
          "prescriber",
        ],
      },
      {
        id: "member-routing",
        label: "Member and prescriber routing",
        observed: "Passive formulary signal",
        target: "Active lower-cost navigation",
        difference: "Action gap",
        objectives: ["lower-cost", "member-experience", "fast-launch"],
        capabilityTerms: [
          "formulary",
          "claims",
          "navigation",
          "routing",
          "prescriber",
        ],
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
        capabilityTerms: [
          "pbm",
          "claims",
          "pass-through",
          "analytics",
          "administration",
        ],
      },
      {
        id: "contract-proof",
        label: "Guarantee proof",
        observed: "92% modeled confidence",
        target: "100% claim-level reconciliation",
        difference: "8 pts uncertain",
        objectives: ["transparency", "lower-cost"],
        capabilityTerms: [
          "pbm",
          "claims",
          "pass-through",
          "analytics",
          "administration",
        ],
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
      capabilityTerms: ["claims", "analytics", "pbm", "navigation", "routing"],
    },
  ];
}

export function rankSolutionsForGaps(
  catalog: Solution[],
  gaps: GapSignal[],
): Array<{ solution: Solution; fit: number; reasons: string[] }> {
  const objectives = [...new Set(gaps.flatMap((gap) => gap.objectives))];
  return catalog
    .map((solution) => {
      const solutionText = [
        solution.category,
        solution.model,
        solution.description,
      ]
        .join(" ")
        .toLowerCase();
      const capabilityScore = Math.round(
        gaps.reduce((total, gap) => {
          const [primary, ...supporting] = gap.capabilityTerms;
          const primaryScore = solutionText.includes(primary.toLowerCase())
            ? 50
            : 0;
          const supportingMatches = supporting.filter((term) =>
            solutionText.includes(term.toLowerCase()),
          ).length;
          const supportingScore =
            (Math.min(supportingMatches, 2) / Math.min(supporting.length, 2)) *
            50;
          return total + primaryScore + supportingScore;
        }, 0) / gaps.length,
      );
      const objectiveScore = solutionScore(solution, objectives);

      return {
        solution,
        fit: Math.round(objectiveScore * 0.6 + capabilityScore * 0.4),
        reasons: gaps.slice(0, 2).map((gap) => {
          const matched = gap.capabilityTerms.filter((term) =>
            solutionText.includes(term.toLowerCase()),
          );
          const bestObjective = gap.objectives
            .map((objective) => ({
              objective,
              score: solution.scores[objective],
            }))
            .sort((a, b) => b.score - a.score)[0];
          return matched.length
            ? `${gap.label}: ${matched.slice(0, 2).join(" + ")} capability`
            : `${gap.label}: ${bestObjective.score}/5 ${bestObjective.objective.replaceAll("-", " ")} fit`;
        }),
      };
    })
    .sort(
      (a, b) => b.fit - a.fit || a.solution.name.localeCompare(b.solution.name),
    );
}
