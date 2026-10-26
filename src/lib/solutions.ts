export type Objective =
  | "lower-cost"
  | "member-experience"
  | "specialty"
  | "glp1"
  | "transparency"
  | "fast-launch";

export type Solution = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  model: string;
  description: string;
  bestFor: string;
  strengths: string[];
  considerations: string[];
  scores: Record<Objective, number>;
  implementation: "Light" | "Moderate" | "Strategic";
  accent: string;
  url: string;
};

export const objectives: { id: Objective; label: string; eyebrow: string }[] = [
  { id: "lower-cost", label: "Lower net Rx cost", eyebrow: "Economics" },
  { id: "member-experience", label: "Simplify member experience", eyebrow: "Experience" },
  { id: "specialty", label: "Transform specialty", eyebrow: "High cost" },
  { id: "glp1", label: "Build a GLP-1 strategy", eyebrow: "Trend" },
  { id: "transparency", label: "Increase transparency", eyebrow: "Control" },
  { id: "fast-launch", label: "Launch quickly", eyebrow: "Execution" },
];

export const solutions: Solution[] = [
  {
    id: "levrx",
    name: "Levrx",
    shortName: "LR",
    category: "Navigation & engagement",
    model: "Experience layer",
    description: "Connects PBMs, pharmacy programs, benefits and fulfillment pathways in one member navigation experience.",
    bestFor: "Employers with multiple Rx point solutions that need one front door and better program utilization.",
    strengths: ["Real-time pricing guidance", "Preferred-channel navigation", "Digital and clinical engagement"],
    considerations: ["Value depends on integration depth", "Complements rather than replaces the core PBM"],
    scores: { "lower-cost": 4, "member-experience": 5, specialty: 3, glp1: 3, transparency: 5, "fast-launch": 3 },
    implementation: "Moderate",
    accent: "#6FACDE",
    url: "https://levrx.com/",
  },
  {
    id: "scripta",
    name: "Scripta Insights",
    shortName: "SI",
    category: "Rx savings analytics",
    model: "Claims-driven navigation",
    description: "Analyzes prescription claims and surfaces clinically appropriate, lower-cost medication and channel alternatives.",
    bestFor: "Self-funded employers seeking measurable savings without replacing their existing PBM.",
    strengths: ["Personalized savings opportunities", "Works alongside the PBM", "Employer and member savings focus"],
    considerations: ["Requires claims data", "Member action and prescriber acceptance influence realized savings"],
    scores: { "lower-cost": 5, "member-experience": 4, specialty: 2, glp1: 2, transparency: 4, "fast-launch": 4 },
    implementation: "Light",
    accent: "#E07E3C",
    url: "https://www.scriptainsights.com/",
  },
  {
    id: "waltz",
    name: "Waltz Health",
    shortName: "WH",
    category: "Pharmacy marketplace",
    model: "Dynamic routing",
    description: "Marketplace technology spanning cash-price search, payer solutions and specialty prescription routing.",
    bestFor: "Plans seeking a flexible marketplace across funded, cash and specialty pharmacy pathways.",
    strengths: ["Multi-card cash search", "Dynamic specialty marketplace", "Payer and pharmacy integrations"],
    considerations: ["Product fit varies by selected Waltz module", "Contracting and workflow design require diligence"],
    scores: { "lower-cost": 5, "member-experience": 4, specialty: 5, glp1: 4, transparency: 5, "fast-launch": 3 },
    implementation: "Moderate",
    accent: "#0075BC",
    url: "https://waltzhealth.com/our-solutions",
  },
  {
    id: "glp1-direct",
    name: "GLP-1 Direct Access",
    shortName: "G1",
    category: "Obesity & metabolic health",
    model: "D2C + direct-to-employer",
    description: "A design pattern combining clinical eligibility, prescribing, transparent drug access and longitudinal support.",
    bestFor: "Employers creating a deliberate GLP-1 access strategy outside—or integrated with—the traditional benefit.",
    strengths: ["Focused member journey", "Transparent access pathways", "Can pair clinical care with fulfillment"],
    considerations: ["Clinical model and continuity vary", "Coordinate eligibility, safety, coverage and outcomes measurement"],
    scores: { "lower-cost": 3, "member-experience": 5, specialty: 2, glp1: 5, transparency: 4, "fast-launch": 4 },
    implementation: "Strategic",
    accent: "#F0B323",
    url: "https://www.novocare.com/hcp/pharmacy.html",
  },
  {
    id: "fmh",
    name: "Free Market Health",
    shortName: "FM",
    category: "Specialty orchestration",
    model: "Care-driven marketplace",
    description: "Routes specialty prescriptions based on payer design, pharmacy capabilities, cost and patient needs.",
    bestFor: "Payers and employers that need control, visibility and accountability across specialty pharmacy fulfillment.",
    strengths: ["Intentional pharmacy routing", "Prescription journey visibility", "Works with existing networks"],
    considerations: ["Specialty-specific rather than broad retail Rx", "Requires payer and network workflow alignment"],
    scores: { "lower-cost": 4, "member-experience": 4, specialty: 5, glp1: 2, transparency: 5, "fast-launch": 2 },
    implementation: "Strategic",
    accent: "#00263E",
    url: "https://www.freemarkethealth.com/",
  },
  {
    id: "cost-plus",
    name: "Mark Cuban Cost Plus Drugs",
    shortName: "CP",
    category: "Transparent pharmacy",
    model: "Cost-plus pricing",
    description: "Direct pharmacy access built around visible acquisition cost, a defined markup and transparent fulfillment pricing.",
    bestFor: "Employers adding a transparent option for eligible generics and select medications.",
    strengths: ["Simple cost-plus story", "Direct consumer access", "Employer-sponsored programs available"],
    considerations: ["Medication coverage is not universal", "Benefit integration and deductible treatment should be confirmed"],
    scores: { "lower-cost": 5, "member-experience": 4, specialty: 1, glp1: 1, transparency: 5, "fast-launch": 5 },
    implementation: "Light",
    accent: "#C6AA76",
    url: "https://www.markcubancostplusdrugcompany.com/",
  },
  {
    id: "amazon",
    name: "Amazon Pharmacy",
    shortName: "AP",
    category: "Home pharmacy",
    model: "Digital fulfillment",
    description: "Nationwide home delivery with insurance, cash pricing, coupons, auto-refill and 24/7 pharmacist access.",
    bestFor: "Employers prioritizing familiar digital access, home delivery and simple prescription management.",
    strengths: ["Consumer-grade experience", "Insurance and cash comparisons", "Broad home-delivery footprint"],
    considerations: ["Not every medication is available", "Channel strategy should account for local and urgent fills"],
    scores: { "lower-cost": 3, "member-experience": 5, specialty: 2, glp1: 3, transparency: 4, "fast-launch": 5 },
    implementation: "Light",
    accent: "#A4C8E1",
    url: "https://pharmacy.amazon.com/how-it-works",
  },
  {
    id: "judi-health",
    name: "Judi Health",
    shortName: "JH",
    category: "Transparent PBM",
    model: "Technology-led pass-through",
    description: "A modern PBM platform designed around visible economics, configurable plan design and integrated pharmacy infrastructure.",
    bestFor: "Employers exploring a technology-forward core PBM alternative with transparent operating economics.",
    strengths: ["Modern claims platform", "Configurable benefit design", "Transparent model positioning"],
    considerations: ["Validate current product scope and guarantees", "Model member and implementation change carefully"],
    scores: { "lower-cost": 5, "member-experience": 4, specialty: 4, glp1: 4, transparency: 5, "fast-launch": 3 },
    implementation: "Strategic",
    accent: "#6FACDE",
    url: "https://www.judi.health/",
  },
  {
    id: "smithrx",
    name: "SmithRx",
    shortName: "SR",
    category: "Transparent PBM",
    model: "Pass-through + sourcing",
    description: "A transparent PBM model combining claims administration with alternative sourcing and member support pathways.",
    bestFor: "Self-funded employers seeking clearer economics and active routing to lower-cost access options.",
    strengths: ["Pass-through positioning", "Alternative sourcing pathways", "Member support model"],
    considerations: ["Validate savings methodology", "Assess operational complexity across sourcing channels"],
    scores: { "lower-cost": 5, "member-experience": 4, specialty: 4, glp1: 3, transparency: 5, "fast-launch": 3 },
    implementation: "Strategic",
    accent: "#E07E3C",
    url: "https://smithrx.com/",
  },
  {
    id: "navitus",
    name: "Navitus",
    shortName: "NV",
    category: "Transparent PBM",
    model: "Full-service pass-through",
    description: "A full-service PBM centered on pass-through economics, formulary management and integrated specialty capabilities.",
    bestFor: "Sponsors seeking a mature transparent PBM with national scale and broad core administration.",
    strengths: ["Full-service PBM scope", "Pass-through model", "Integrated specialty capabilities"],
    considerations: ["Compare guarantees on a net-cost basis", "Validate formulary and specialty alignment"],
    scores: { "lower-cost": 5, "member-experience": 4, specialty: 5, glp1: 3, transparency: 5, "fast-launch": 3 },
    implementation: "Strategic",
    accent: "#0075BC",
    url: "https://www.navitus.com/",
  },
  {
    id: "rightway",
    name: "Rightway",
    shortName: "RW",
    category: "PBM + navigation",
    model: "Pass-through experience",
    description: "Combines a transparent PBM structure with member navigation intended to connect economics and experience.",
    bestFor: "Employers that want a core PBM alternative with an integrated member-guidance layer.",
    strengths: ["PBM and navigation together", "Pass-through positioning", "Consumer-oriented experience"],
    considerations: ["Validate scope across complex specialty", "Test integration with the wider benefits ecosystem"],
    scores: { "lower-cost": 4, "member-experience": 5, specialty: 4, glp1: 3, transparency: 5, "fast-launch": 3 },
    implementation: "Strategic",
    accent: "#C6AA76",
    url: "https://www.rightwayhealthcare.com/",
  },
];

export function solutionScore(solution: Solution, selected: Objective[]) {
  const active = selected.length ? selected : (["lower-cost", "member-experience", "transparency"] as Objective[]);
  return Math.round((active.reduce((sum, objective) => sum + solution.scores[objective], 0) / (active.length * 5)) * 100);
}
