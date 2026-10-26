export type Opportunity = {
  id: string;
  code: string;
  name: string;
  driver: string;
  value: number;
  annual: number;
  owner: string;
  stage: string;
  confidence: number;
  due: string;
};

export const opportunities: Opportunity[] = [
  {
    id: "glp1",
    code: "OPP-2094",
    name: "GLP-1 cost and access strategy",
    driver: "GLP-1 utilization",
    value: 286412,
    annual: 3440000,
    owner: "Clinical strategy",
    stage: "Evidence review",
    confidence: 94,
    due: "Nov 14",
  },
  {
    id: "site",
    code: "OPP-2088",
    name: "Specialty site-of-care optimization",
    driver: "Hospital outpatient migration",
    value: 184930,
    annual: 2219000,
    owner: "Network strategy",
    stage: "Requirements set",
    confidence: 91,
    due: "Nov 21",
  },
  {
    id: "rebate",
    code: "OPP-2079",
    name: "Rebate settlement controls",
    driver: "Q3 settlement timing",
    value: 121600,
    annual: 486400,
    owner: "Finance",
    stage: "Monitoring",
    confidence: 99,
    due: "Oct 31",
  },
  {
    id: "biosimilar",
    code: "OPP-2071",
    name: "Biosimilar conversion pathway",
    driver: "Reference-product leakage",
    value: 86904,
    annual: 1043000,
    owner: "Formulary",
    stage: "Market screened",
    confidence: 88,
    due: "Nov 28",
  },
];

export const portfolioTotals = {
  identifiedValue: opportunities.reduce((sum, item) => sum + item.value, 0),
  annualExposure: opportunities.reduce((sum, item) => sum + item.annual, 0),
  inDecision: opportunities.filter((item) => item.stage !== "Monitoring").length,
  nextDeadline: "Oct 31",
  nextDeadlineLabel: "Rebate settlement controls",
};
