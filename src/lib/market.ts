export type PbmModel = {
  id: string;
  name: string;
  marker: string;
  thesis: string;
  economics: string;
  control: string;
  member: string;
  bestFor: string;
};

export const pbmModels: PbmModel[] = [
  {
    id: "traditional",
    name: "Traditional bundled",
    marker: "01",
    thesis: "Scale, guarantees and integrated assets in one contract.",
    economics: "Rebates + guarantees",
    control: "Moderate",
    member: "Lower disruption",
    bestFor: "Sponsors prioritizing scale, broad networks and operational simplicity.",
  },
  {
    id: "pass-through",
    name: "Transparent pass-through",
    marker: "02",
    thesis: "Disclosed administration with manufacturer revenue returned to the plan.",
    economics: "Admin fee",
    control: "High",
    member: "Moderate change",
    bestFor: "Sponsors seeking clearer economics, data access and auditability.",
  },
  {
    id: "cost-plus",
    name: "Cost-plus / acquisition",
    marker: "03",
    thesis: "Drug cost is tied to an acquisition benchmark plus a visible service fee.",
    economics: "Benchmark + fee",
    control: "High",
    member: "Model dependent",
    bestFor: "Sponsors willing to trade familiar guarantees for price-level clarity.",
  },
  {
    id: "unbundled",
    name: "Unbundled architecture",
    marker: "04",
    thesis: "Separate contracts for claims, network, rebates, specialty and navigation.",
    economics: "Component pricing",
    control: "Highest",
    member: "Design critical",
    bestFor: "Sophisticated sponsors that want autonomy and can govern multiple partners.",
  },
];

export const contractChecks = [
  { label: "All revenue disclosed", detail: "Rebates, fees, credits, GPO and affiliate economics" },
  { label: "No spread ambiguity", detail: "Clear pharmacy reimbursement versus plan charge" },
  { label: "Full audit rights", detail: "Claims, rebates, guarantees and downstream arrangements" },
  { label: "Plan owns its data", detail: "Timely, complete and portable claims-level access" },
  { label: "Specialty conflicts visible", detail: "Steering, affiliated assets and acquisition benchmarks" },
  { label: "Exit rights are workable", detail: "Termination, implementation support and data transition" },
];

export const strategySignals = [
  { code: "SP", title: "Specialty control", stat: "55%", label: "of Rx spend in one national dataset", action: "Unify pharmacy + medical visibility, site of care and specialty generics." },
  { code: "GL", title: "GLP-1 sustainability", stat: "90%", label: "of covering employers use prior authorization", action: "Model eligibility, clinical support, persistence and direct-access scenarios." },
  { code: "BI", title: "Biosimilar conversion", stat: "2×", label: "benefits to inspect", action: "Find exposure under both pharmacy and medical benefits before redesigning formulary." },
  { code: "CG", title: "Cell + gene readiness", stat: "$4M", label: "possible single-therapy cost", action: "Map pipeline exposure, stop-loss terms and treatment-center pathways." },
];
