export type LineageClaim = {
  id: string;
  member: string;
  drug: string;
  date: string;
  paid: number;
  delta: number;
};

export type SpendDriver = {
  id: string;
  name: string;
  detail: string;
  dollars: number;
  pmpm: number;
  confidence: number;
  claims: number;
  owner: string;
  status: string;
  evidence: string;
  lineage: LineageClaim[];
};

export const reportViews = [
  "Overview",
  "Spend performance",
  "Utilization",
  "Specialty",
  "Formulary",
  "Rebates",
] as const;

export type ReportView = (typeof reportViews)[number];

export const spendDrivers: SpendDriver[] = [
  {
    id: "glp1",
    name: "GLP-1 utilization",
    detail: "New starts and persistence",
    dollars: 286412,
    pmpm: 5.73,
    confidence: 94,
    claims: 447,
    owner: "Clinical strategy",
    status: "Ready to evaluate",
    evidence: "126 incremental utilizers; unit cost stable within 1.2%.",
    lineage: [
      { id: "CLM-847210", member: "MBR-02914", drug: "Zepbound 10mg", date: "Sep 18", paid: 1049.22, delta: 1049.22 },
      { id: "CLM-846992", member: "MBR-10473", drug: "Wegovy 2.4mg", date: "Sep 17", paid: 978.44, delta: 978.44 },
      { id: "CLM-846104", member: "MBR-08831", drug: "Zepbound 7.5mg", date: "Sep 15", paid: 1032.81, delta: 516.41 },
    ],
  },
  {
    id: "specialty",
    name: "Specialty site of care",
    detail: "Hospital outpatient migration",
    dollars: 184930,
    pmpm: 3.7,
    confidence: 91,
    claims: 31,
    owner: "Network strategy",
    status: "Validation needed",
    evidence: "Nine infusions moved from ambulatory suites to HOPD settings.",
    lineage: [
      { id: "CLM-840192", member: "MBR-13008", drug: "Skyrizi infusion", date: "Sep 09", paid: 18622.4, delta: 9048.1 },
      { id: "CLM-838447", member: "MBR-04316", drug: "Entyvio infusion", date: "Sep 05", paid: 15218.7, delta: 7282.2 },
    ],
  },
  {
    id: "rebate",
    name: "Rebate timing",
    detail: "Q3 settlement after close",
    dollars: 121600,
    pmpm: 2.43,
    confidence: 99,
    claims: 0,
    owner: "Finance",
    status: "Known timing item",
    evidence: "Manufacturer credits posted eight days after the September close.",
    lineage: [
      { id: "REB-Q3-018", member: "—", drug: "Diabetes portfolio", date: "Oct 08", paid: 0, delta: 74200 },
      { id: "REB-Q3-024", member: "—", drug: "Inflammatory portfolio", date: "Oct 08", paid: 0, delta: 47400 },
    ],
  },
  {
    id: "biosimilar",
    name: "Biosimilar leakage",
    detail: "Non-preferred reference products",
    dollars: 86904,
    pmpm: 1.74,
    confidence: 88,
    claims: 26,
    owner: "Formulary",
    status: "Ready to evaluate",
    evidence: "Reference products remained in use where preferred alternatives were available.",
    lineage: [
      { id: "CLM-842110", member: "MBR-11903", drug: "Humira", date: "Sep 11", paid: 6684.31, delta: 3921.18 },
      { id: "CLM-839501", member: "MBR-02271", drug: "Herceptin", date: "Sep 07", paid: 7210.54, delta: 3644.8 },
    ],
  },
];
