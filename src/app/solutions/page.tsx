"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { compactMoney, money } from "@/lib/format";
import { metricTone, toneClass } from "@/lib/metric-tone";
import {
  opportunities as seedOpportunities,
  portfolioTotals as seedTotals,
  type Opportunity,
} from "@/lib/opportunities";
import { solutions, type Solution } from "@/lib/solutions";
import "../product.css";

const weights = [
  { key: "economic", label: "Economic impact", weight: 30 },
  { key: "clinical", label: "Clinical fit", weight: 20 },
  { key: "experience", label: "Member experience", weight: 15 },
  { key: "implementation", label: "Implementation", weight: 15 },
  { key: "data", label: "Data readiness", weight: 10 },
  { key: "contract", label: "Contract transparency", weight: 10 },
];

const evidence: Record<
  string,
  { score: number; confidence: string; reviewed: string; facts: string[] }
> = {
  waltz: {
    score: 86,
    confidence: "Medium-high",
    reviewed: "Oct 18, 2026",
    facts: [
      "Specialty routing capability documented",
      "Marketplace model aligns to channel intervention",
      "Commercial terms require validation",
    ],
  },
  levrx: {
    score: 82,
    confidence: "Medium",
    reviewed: "Oct 16, 2026",
    facts: [
      "Strong member navigation fit",
      "Works alongside incumbent PBM",
      "Savings attribution requires diligence",
    ],
  },
  scripta: {
    score: 79,
    confidence: "Medium-high",
    reviewed: "Oct 17, 2026",
    facts: [
      "Claims-driven savings identification",
      "Lower implementation burden",
      "Limited specialty orchestration",
    ],
  },
};

const defaults = {
  score: 74,
  confidence: "Preliminary",
  reviewed: "Oct 14, 2026",
  facts: [
    "Public product information reviewed",
    "Economic assumptions not yet validated",
    "RFI evidence required",
  ],
};

type ModelFilter = "all" | "navigation" | "specialty" | "transparent";
type WorkspaceTab = "candidates" | "diligence" | "economics" | "decision";

const modelFilters: {
  id: ModelFilter;
  label: string;
  match: (solution: Solution) => boolean;
}[] = [
  { id: "all", label: "All models", match: () => true },
  {
    id: "navigation",
    label: "Navigation",
    match: (s) =>
      /navigation|experience|home pharmacy|claims-driven/i.test(`${s.category} ${s.model}`),
  },
  {
    id: "specialty",
    label: "Specialty",
    match: (s) => /specialty/i.test(`${s.category} ${s.model} ${s.description}`),
  },
  {
    id: "transparent",
    label: "Transparent PBM",
    match: (s) => /transparent pbm/i.test(s.category),
  },
];

const gates = [
  "Problem validated",
  "Requirements set",
  "Market screened",
  "Evidence diligence",
  "Commercial modeling",
  "Clinical approval",
  "Decision recorded",
];

function readCreatedOpportunities(): Opportunity[] {
  try {
    const raw = localStorage.getItem("rxnext-opportunities");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<Opportunity> & { name?: string; value?: number }>;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item.name && typeof item.value === "number")
      .map((item, index) => {
        const code = item.code || item.id || `OPP-LOCAL-${index + 1}`;
        return {
          id: item.id || code,
          code,
          name: item.name as string,
          driver: item.driver || "Created from Reports",
          value: item.value as number,
          annual: item.annual ?? Math.round((item.value as number) * 12),
          owner: item.owner || "Unassigned",
          stage: item.stage || "Identified",
          confidence: item.confidence ?? 80,
          due: item.due || "TBD",
        };
      });
  } catch {
    return [];
  }
}

export default function Solutions() {
  const [active, setActive] = useState<Solution | null>(
    solutions.find((s) => s.id === "waltz") ?? null,
  );
  const [query, setQuery] = useState("");
  const [modelFilter, setModelFilter] = useState<ModelFilter>("all");
  const [workspace, setWorkspace] = useState<WorkspaceTab>("candidates");
  const [opportunityId, setOpportunityId] = useState<string | null>(null);
  const [stage, setStage] = useState(3);
  const [adoption, setAdoption] = useState(35);
  const [reduction, setReduction] = useState(18);
  const [fee, setFee] = useState(420000);
  const [implementation, setImplementation] = useState(180000);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [createdOpps] = useState<Opportunity[]>(() =>
    typeof window === "undefined" ? [] : readCreatedOpportunities(),
  );

  const opportunities = useMemo(() => {
    const seedNames = new Set(seedOpportunities.map((item) => item.name.toLowerCase()));
    const extras = createdOpps.filter((item) => !seedNames.has(item.name.toLowerCase()));
    return [...extras, ...seedOpportunities].sort((a, b) => b.value - a.value);
  }, [createdOpps]);

  const portfolioTotals = useMemo(() => {
    if (createdOpps.length === 0) return seedTotals;
    return {
      identifiedValue: opportunities.reduce((sum, item) => sum + item.value, 0),
      annualExposure: opportunities.reduce((sum, item) => sum + item.annual, 0),
      inDecision: opportunities.filter((item) => item.stage !== "Monitoring").length,
      nextDeadline: seedTotals.nextDeadline,
      nextDeadlineLabel: seedTotals.nextDeadlineLabel,
    };
  }, [createdOpps.length, opportunities]);

  const opportunity = opportunities.find((item) => item.id === opportunityId) ?? null;
  const annualBase = opportunity?.annual ?? 3440000;

  const ranked = useMemo(() => {
    const matcher =
      modelFilters.find((filter) => filter.id === modelFilter)?.match ?? modelFilters[0].match;
    return solutions
      .map((s) => ({ s, e: evidence[s.id] ?? defaults }))
      .filter(
        (x) =>
          matcher(x.s) &&
          (!query ||
            `${x.s.name} ${x.s.category} ${x.s.model}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      )
      .sort((a, b) => b.e.score - a.e.score);
  }, [query, modelFilter]);

  const gross = annualBase * (adoption / 100) * (reduction / 100);
  const totalCost = fee + implementation;
  const net = gross - totalCost;
  const low = Math.round(gross * 0.68 - totalCost);
  const high = Math.round(gross * 1.31 - totalCost);
  const activeEvidence = active ? evidence[active.id] ?? defaults : defaults;

  function changeModelFilter(next: ModelFilter) {
    setModelFilter(next);
    const matcher =
      modelFilters.find((filter) => filter.id === next)?.match ?? modelFilters[0].match;
    const first = solutions
      .map((s) => ({ s, e: evidence[s.id] ?? defaults }))
      .filter((x) => matcher(x.s))
      .sort((a, b) => b.e.score - a.e.score)[0];
    setActive(first?.s ?? null);
  }

  function advance() {
    const next = Math.min(stage + 1, 6);
    setStage(next);
    localStorage.setItem(
      "rxnext-decision",
      JSON.stringify({
        stage: next,
        solution: active?.name,
        opportunity: opportunity?.code,
        net,
        updated: new Date().toISOString(),
      }),
    );
    setNotice(
      `${active?.name} advanced to ${
        next === 4 ? "commercial modeling" : next === 5 ? "clinical approval" : "decision recorded"
      }.`,
    );
    setWorkspace(next === 4 ? "economics" : "decision");
  }

  function addNote() {
    if (!note.trim()) return;
    setNotes((current) => [note.trim(), ...current]);
    setNote("");
    setNotice("Evidence note added to the decision record.");
  }

  function openOpportunity(id: string) {
    setOpportunityId(id);
    setWorkspace("candidates");
    setStage(3);
    setNotes([]);
    setNotice("");
  }

  return (
    <AppShell
      active="solutions"
      contextLeft={
        <>
          <span>Decision pipeline</span>
          <b>/</b>
          <strong>{opportunity ? opportunity.code : "Solution evaluation"}</strong>
        </>
      }
      contextRight={
        <>
          <i className="warn" />
          Assessment evidence current through Oct 18
          <button type="button">Methodology</button>
        </>
      }
    >
      <section className="beta-page">
        <header className="beta-title">
          <div>
            <span>
              {opportunity
                ? `DECISION WORKSPACE · ${opportunity.code}`
                : "PORTFOLIO DECISIONS · OCTOBER 2026"}
            </span>
            <h1>{opportunity ? opportunity.name : "Opportunity pipeline"}</h1>
            <p>
              {opportunity
                ? `Evaluate interventions against the ${money(opportunity.value)} identified variance`
                : "Prioritize pharmacy interventions across cost, clinical impact, and execution readiness"}
            </p>
          </div>
          <div className="beta-title-actions">
            {opportunity ? (
              <>
                <button type="button" onClick={() => setOpportunityId(null)}>
                  Back to portfolio
                </button>
                <button
                  type="button"
                  className="dark"
                  onClick={() => setNotice(`RFI draft created for ${active?.name}.`)}
                >
                  Create RFI
                </button>
              </>
            ) : (
              <>
                <button type="button">Portfolio brief</button>
                <Link className="button-link" href="/">
                  Review spend drivers
                </Link>
              </>
            )}
          </div>
        </header>

        {opportunity ? (
          <div className="decision-summary">
            <div>
              <span>Opportunity value</span>
              <strong>{money(opportunity.value)}</strong>
              <small>Identified variance</small>
            </div>
            <div>
              <span>Annualized exposure</span>
              <strong>{compactMoney(opportunity.annual)}</strong>
              <small>Unmitigated run-rate</small>
            </div>
            <div>
              <span>Decision owner</span>
              <b>{opportunity.owner}</b>
              <small>Due {opportunity.due}</small>
            </div>
            <div>
              <span>Stage</span>
              <b className="stage">
                {stage === 3
                  ? opportunity.stage
                  : stage === 4
                    ? "Commercial modeling"
                    : stage === 5
                      ? "Clinical approval"
                      : "Decision recorded"}
              </b>
              <small>
                {stage} of {gates.length} gates complete
              </small>
            </div>
          </div>
        ) : null}

        {!opportunity ? (
          <section className="portfolio-pipeline">
            <div className="portfolio-overview">
              <article>
                <span>Identified value</span>
                <strong>{money(portfolioTotals.identifiedValue)}</strong>
                <small>
                  Across {opportunities.length} active opportunit
                  {opportunities.length === 1 ? "y" : "ies"}
                </small>
              </article>
              <article>
                <span>Annualized exposure</span>
                <strong>{compactMoney(portfolioTotals.annualExposure)}</strong>
                <small>Before intervention</small>
              </article>
              <article>
                <span>In decision</span>
                <strong>{portfolioTotals.inDecision}</strong>
                <small>One item in monitoring</small>
              </article>
              <article>
                <span>Next deadline</span>
                <strong>{portfolioTotals.nextDeadline}</strong>
                <small>{portfolioTotals.nextDeadlineLabel}</small>
              </article>
            </div>

            <div className="opportunity-list">
              <header>
                <div>
                  <span>ACTIVE OPPORTUNITIES</span>
                  <h2>Ranked by identified value</h2>
                </div>
                <button type="button">Value at risk ↓</button>
              </header>
              {opportunities.map((item, index) => (
                <button
                  className="opportunity-row"
                  key={item.id}
                  type="button"
                  onClick={() => openOpportunity(item.id)}
                >
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <div>
                    <b>{item.name}</b>
                    <span>
                      {item.driver} · {item.code}
                    </span>
                  </div>
                  <strong>{money(item.value)}</strong>
                  <span>{item.owner}</span>
                  <em>{item.stage}</em>
                  <small>{item.confidence}% confidence</small>
                  <u>Open →</u>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {opportunity ? (
          <>
            <nav className="workspace-tabs" aria-label="Decision workspace views">
              {(
                [
                  ["candidates", "Candidates"],
                  ["diligence", "Diligence"],
                  ["economics", "Economics"],
                  ["decision", "Decision"],
                ] as [WorkspaceTab, string][]
              ).map(([id, label], index) => (
                <button
                  key={id}
                  type="button"
                  className={workspace === id ? "active" : undefined}
                  onClick={() => setWorkspace(id)}
                >
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <span>{label}</span>
                  {id === "diligence" && notes.length > 0 ? <b>{notes.length}</b> : null}
                </button>
              ))}
            </nav>

            {workspace === "candidates" ? (
              <div className="candidate-workspace">
                <section className="beta-panel market">
                  <header>
                    <div>
                      <span>CANDIDATE SOLUTIONS · {ranked.length} RESULTS</span>
                      <h2>Evidence-ranked shortlist</h2>
                    </div>
                    <label>
                      <span>⌕</span>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search solutions"
                        aria-label="Search solutions"
                      />
                    </label>
                  </header>
                  <div className="market-controls">
                    {modelFilters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        className={modelFilter === filter.id ? "active" : undefined}
                        aria-pressed={modelFilter === filter.id}
                        onClick={() => changeModelFilter(filter.id)}
                      >
                        {filter.label}
                      </button>
                    ))}
                    <select aria-label="Filter by diligence stage" defaultValue="all">
                      <option value="all">All stages</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="diligence">In diligence</option>
                    </select>
                  </div>
                  {ranked.length ? (
                    <div className="candidate-grid">
                      {ranked.map(({ s, e }) => (
                        <button
                          key={s.id}
                          type="button"
                          className={active?.id === s.id ? "candidate-card active" : "candidate-card"}
                          onClick={() => setActive(s)}
                          aria-pressed={active?.id === s.id}
                        >
                          <div className="card-top">
                            <span>{s.category}</span>
                            <i>{active?.id === s.id ? "Selected" : "Review"}</i>
                          </div>
                          <h3>{s.name}</h3>
                          <p>{s.model}</p>
                          <div className="card-score">
                            <div>
                              <strong>{e.score}</strong>
                              <span>Evidence score</span>
                            </div>
                            <i>
                              <em style={{ width: `${e.score}%` }} />
                            </i>
                          </div>
                          <footer>
                            <span>
                              <i /> {e.confidence}
                            </span>
                            <b>Updated {e.reviewed.replace(", 2026", "")}</b>
                            <em>→</em>
                          </footer>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="candidate-empty">
                      <b>No matching candidates</b>
                      <span>Clear the search or choose another solution model.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          changeModelFilter("all");
                        }}
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </section>
                <div className="selected-candidate">
                  <span>Selected candidate</span>
                  <b>{active?.name}</b>
                  <button type="button" onClick={() => setWorkspace("diligence")}>
                    Open diligence →
                  </button>
                </div>
              </div>
            ) : null}

            {workspace === "diligence" ? (
              <aside className="beta-panel diligence standalone">
                {active ? (
                  <>
                    <header>
                      <div>
                        <span>SOLUTION OBJECT</span>
                        <h2>{active.name}</h2>
                      </div>
                      <button type="button" aria-label="More solution actions">
                        •••
                      </button>
                    </header>
                    <div className="diligence-status">
                      <span>Assessment status</span>
                      <b>{stage === 3 ? "Evidence review" : "In diligence"}</b>
                      <small>Last reviewed {activeEvidence.reviewed}</small>
                    </div>
                    <section>
                      <span>Potential role</span>
                      <p>{active.bestFor}</p>
                    </section>
                    <section>
                      <span>Evidence on file</span>
                      {activeEvidence.facts.map((f) => (
                        <p className="fact" key={f}>
                          <i /> {f}
                        </p>
                      ))}
                      {notes.map((item, index) => (
                        <p className="fact user" key={`${item}-${index}`}>
                          <i /> {item}
                        </p>
                      ))}
                    </section>
                    <div className="weighted">
                      <span>Weighted assessment</span>
                      {weights.map((w) => (
                        <div key={w.key}>
                          <b>{w.label}</b>
                          <small>{w.weight}%</small>
                          <i>
                            <em
                              style={{
                                width: `${Math.max(54, activeEvidence.score - (w.weight % 13))}%`,
                              }}
                            />
                          </i>
                        </div>
                      ))}
                    </div>
                    <div className="evidence-entry">
                      <input
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Add an evidence note…"
                        aria-label="Evidence note"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") addNote();
                        }}
                      />
                      <button type="button" onClick={addNote}>
                        Add
                      </button>
                    </div>
                    <div className="diligence-actions">
                      <button type="button" className="primary-action" onClick={advance}>
                        {stage >= 6 ? "Decision recorded" : "Advance stage"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setNotice(`${active.name} added to the working shortlist.`)
                        }
                      >
                        Shortlist
                      </button>
                    </div>
                  </>
                ) : null}
              </aside>
            ) : null}

            {workspace === "economics" ? (
              <section className="beta-panel scenario standalone">
                <header>
                  <div>
                    <span>SCENARIO ECONOMICS</span>
                    <h2>Year-one intervention case</h2>
                  </div>
                  <span>Editable assumptions · Base case</span>
                </header>
                <div className="scenario-body">
                  <div className="assumptions">
                    <label>
                      <span>Eligible adoption</span>
                      <b>{adoption}%</b>
                      <input
                        type="range"
                        min={10}
                        max={80}
                        value={adoption}
                        onChange={(e) => setAdoption(Number(e.target.value))}
                      />
                    </label>
                    <label>
                      <span>Net cost reduction</span>
                      <b>{reduction}%</b>
                      <input
                        type="range"
                        min={5}
                        max={35}
                        value={reduction}
                        onChange={(e) => setReduction(Number(e.target.value))}
                      />
                    </label>
                    <label>
                      <span>Annual vendor fee</span>
                      <b>{money(fee)}</b>
                      <input
                        type="number"
                        value={fee}
                        onChange={(e) => setFee(Number(e.target.value))}
                      />
                    </label>
                    <label>
                      <span>Implementation cost</span>
                      <b>{money(implementation)}</b>
                      <input
                        type="number"
                        value={implementation}
                        onChange={(e) => setImplementation(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div className="scenario-results">
                    <div>
                      <span>Low</span>
                      <strong className={toneClass(metricTone(low, { higherIsWorse: false }))}>
                        {money(low)}
                      </strong>
                      <small>Net year-one value</small>
                    </div>
                    <div className="base">
                      <span>Base</span>
                      <strong className={toneClass(metricTone(Math.round(net), { higherIsWorse: false }))}>
                        {money(Math.round(net))}
                      </strong>
                      <small>
                        {net > 0
                          ? `${(net / totalCost).toFixed(1)}× return on investment`
                          : "Negative year-one value"}
                      </small>
                    </div>
                    <div>
                      <span>High</span>
                      <strong className={toneClass(metricTone(high, { higherIsWorse: false }))}>
                        {money(high)}
                      </strong>
                      <small>Net year-one value</small>
                    </div>
                    <footer>
                      <span>Gross savings</span>
                      <b>{money(Math.round(gross))}</b>
                      <span>Total cost</span>
                      <b>{money(totalCost)}</b>
                    </footer>
                  </div>
                </div>
              </section>
            ) : null}

            {workspace === "decision" ? (
              <section className="beta-panel pipeline standalone">
                <header>
                  <div>
                    <span>DECISION RECORD</span>
                    <h2>Evaluation gates</h2>
                  </div>
                  <span>
                    {stage} of {gates.length} complete
                  </span>
                </header>
                <div className="gates">
                  {gates.map((g, i) => (
                    <div className={i < stage ? "complete" : i === stage ? "current" : undefined} key={g}>
                      <i>{i < stage ? "✓" : i + 1}</i>
                      <b>{g}</b>
                      <span>
                        {i < stage ? "Complete" : i === stage ? "In progress" : "Not started"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : null}

        {notice ? (
          <div className="beta-toast">
            <b>Decision record updated</b>
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">
              ×
            </button>
          </div>
        ) : null}
      </section>
    </AppShell>
  );
}
