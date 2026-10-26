"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { money } from "@/lib/format";
import {
  reportViews,
  spendDrivers,
  type ReportView,
} from "@/lib/report-data";
import "./product.css";

const railIcons = ["◫", "⌁", "⌇", "◇", "≡", "↙"];

export default function Home() {
  const [activeId, setActiveId] = useState("glp1");
  const [notice, setNotice] = useState("");
  const [reportView, setReportView] = useState<ReportView>("Overview");
  const active = useMemo(
    () => spendDrivers.find((d) => d.id === activeId) ?? spendDrivers[0],
    [activeId],
  );

  function createOpportunity() {
    const item = {
      id: `OPP-${Date.now().toString().slice(-5)}`,
      name: active.name,
      value: active.dollars,
      stage: "Identified",
      owner: active.owner,
      created: new Date().toISOString(),
    };
    const current = JSON.parse(localStorage.getItem("rxnext-opportunities") || "[]");
    localStorage.setItem(
      "rxnext-opportunities",
      JSON.stringify([item, ...current.filter((x: { name: string }) => x.name !== item.name)]),
    );
    setNotice(`${item.id} created and added to the decision pipeline.`);
  }

  return (
    <AppShell
      active="reports"
      className="report-app"
      contextLeft={
        <>
          <span>Enterprise</span>
          <b>/</b>
          <span>Benefits</span>
          <b>/</b>
          <strong>Pharmacy reporting</strong>
        </>
      }
      contextRight={
        <>
          <i className="ok" />
          8 sources healthy · refreshed 04:12 ET
          <button type="button">View data health</button>
        </>
      }
    >
      <div className="report-shell">
        <aside className="report-rail">
          <div className="rail-heading">
            <span>Report center</span>
            <button type="button" aria-label="New report">
              ＋
            </button>
          </div>
          <nav aria-label="Report views">
            {reportViews.map((item, i) => (
              <button
                key={item}
                type="button"
                className={reportView === item ? "active" : undefined}
                onClick={() => setReportView(item)}
              >
                <i>{railIcons[i]}</i>
                <span>{item}</span>
                {item === "Overview" ? <b>LIVE</b> : null}
              </button>
            ))}
          </nav>
          <div className="rail-section">
            <span>Saved views</span>
            <button type="button">
              <i>☆</i>
              <span>Finance monthly close</span>
            </button>
            <button type="button">
              <i>☆</i>
              <span>Clinical exceptions</span>
            </button>
            <button type="button">
              <i>☆</i>
              <span>Board quarterly pack</span>
            </button>
          </div>
          <div className="rail-footer">
            <span>Data foundation</span>
            <p>
              <i />
              Claims ledger <b>v42</b>
            </p>
            <p>
              <i />
              Eligibility <b>v19</b>
            </p>
            <p>
              <i />
              Rebate contracts <b>v18</b>
            </p>
          </div>
        </aside>

        <section className="report-canvas">
          <header className="report-header">
            <div>
              <span>Pharmacy performance · Executive report</span>
              <h1>{reportView}</h1>
              <p>Net cost, utilization, and opportunity performance across the pharmacy benefit.</p>
            </div>
            <div className="report-actions">
              <button type="button">Sep 1–30, 2026 ⌄</button>
              <button type="button">Share</button>
              <button type="button" className="dark">
                Export report
              </button>
            </div>
          </header>

          <div className="report-scope">
            <div>
              <b>Reporting basis</b>
              <span>Paid date · Net of estimated rebates</span>
            </div>
            <div>
              <b>Population</b>
              <span>49,954 eligible lives</span>
            </div>
            <div>
              <b>Comparison</b>
              <span>Jun–Aug normalized baseline</span>
            </div>
            <button type="button">Change scope</button>
          </div>

          <div className="report-kpis">
            <article>
              <span>Net pharmacy spend</span>
              <strong>$4.76M</strong>
              <p>
                <b>+$740,320</b> vs. baseline
              </p>
              <small>+18.4%</small>
            </article>
            <article>
              <span>Net PMPM</span>
              <strong>$95.23</strong>
              <p>
                <b>+$14.82</b> vs. baseline
              </p>
              <small>+18.4%</small>
            </article>
            <article>
              <span>Annualized forecast</span>
              <strong>$57.1M</strong>
              <p>
                <b>+$2.18M</b> above plan
              </p>
              <small>+4.0%</small>
            </article>
            <article>
              <span>Explained variance</span>
              <strong>91.8%</strong>
              <p>$679,846 attributed</p>
              <small className="good">High confidence</small>
            </article>
          </div>

          <div className="report-grid">
            <section className="report-panel trend-panel">
              <header>
                <div>
                  <span>Net paid trend</span>
                  <h2>Cost performance</h2>
                </div>
                <div className="report-segments">
                  <button type="button" className="active">
                    Net paid
                  </button>
                  <button type="button">PMPM</button>
                  <button type="button">Claims</button>
                </div>
              </header>
              <div className="chart-meta">
                <div>
                  <span>September actual</span>
                  <strong>$4.76M</strong>
                </div>
                <div>
                  <span>Expected range</span>
                  <b>$3.86–4.18M</b>
                </div>
                <i>
                  <b />
                  Actual <b />
                  Baseline
                </i>
              </div>
              <svg
                className="report-chart"
                viewBox="0 0 760 210"
                role="img"
                aria-label="Monthly net paid trend rising above baseline in September"
              >
                <defs>
                  <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#2563eb" stopOpacity=".28" />
                    <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g className="chart-grid">
                  <path d="M48 20H735M48 70H735M48 120H735M48 170H735" />
                  <path d="M48 20V180M162 20V180M276 20V180M390 20V180M504 20V180M618 20V180M735 20V180" />
                </g>
                <path
                  className="baseline-line"
                  d="M48 139 C120 135 135 126 162 129 S242 116 276 120 S348 105 390 111 S467 100 504 103 S579 91 618 96 S700 86 735 91"
                />
                <path
                  className="cost-area"
                  d="M48 146 C101 141 120 128 162 134 S234 110 276 119 S345 99 390 108 S463 83 504 96 S570 67 618 75 S690 30 735 39 L735 180 L48 180Z"
                />
                <path
                  className="cost-line"
                  d="M48 146 C101 141 120 128 162 134 S234 110 276 119 S345 99 390 108 S463 83 504 96 S570 67 618 75 S690 30 735 39"
                />
                <g className="chart-labels">
                  <text x="48" y="202">
                    APR
                  </text>
                  <text x="162" y="202">
                    MAY
                  </text>
                  <text x="276" y="202">
                    JUN
                  </text>
                  <text x="390" y="202">
                    JUL
                  </text>
                  <text x="504" y="202">
                    AUG
                  </text>
                  <text x="618" y="202">
                    SEP
                  </text>
                  <text x="711" y="202">
                    OCT
                  </text>
                </g>
                <circle cx="735" cy="39" r="5" />
                <text className="chart-callout" x="670" y="25">
                  $4.76M
                </text>
              </svg>
            </section>

            <aside className="report-panel alert-panel">
              <header>
                <div>
                  <span>Attention queue</span>
                  <h2>Material exceptions</h2>
                </div>
                <b>4 open</b>
              </header>
              {spendDrivers.map((d, i) => (
                <button
                  key={d.id}
                  type="button"
                  className={activeId === d.id ? "alert active" : "alert"}
                  onClick={() => setActiveId(d.id)}
                >
                  <i>{String(i + 1).padStart(2, "0")}</i>
                  <div>
                    <b>{d.name}</b>
                    <span>{d.detail}</span>
                  </div>
                  <strong>+{money(d.dollars)}</strong>
                  <em>{d.confidence}%</em>
                </button>
              ))}
              <Link href="/solutions">
                Open opportunity pipeline <b>→</b>
              </Link>
            </aside>
          </div>

          <div className="report-detail">
            <section className="report-panel drivers">
              <header>
                <div>
                  <span>Variance decomposition</span>
                  <h2>September drivers</h2>
                </div>
                <button type="button">Absolute dollars ↓</button>
              </header>
              <div className="driver-head">
                <span>Driver</span>
                <span>Net variance</span>
                <span>PMPM</span>
                <span>Confidence</span>
              </div>
              {spendDrivers.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={activeId === d.id ? "driver active" : "driver"}
                  onClick={() => setActiveId(d.id)}
                >
                  <div>
                    <b>{d.name}</b>
                    <span>
                      {d.detail} · {d.claims ? `${d.claims} claims` : "financial event"}
                    </span>
                  </div>
                  <strong>{money(d.dollars)}</strong>
                  <em>+${d.pmpm.toFixed(2)}</em>
                  <i>{d.confidence}%</i>
                </button>
              ))}
            </section>

            <aside className="report-panel evidence">
              <header>
                <div>
                  <span>Selected object</span>
                  <h2>{active.name}</h2>
                </div>
                <i className="status">{active.status}</i>
              </header>
              <div className="evidence-value">
                <span>Attributed variance</span>
                <strong>{money(active.dollars)}</strong>
                <b>+${active.pmpm.toFixed(2)} PMPM</b>
              </div>
              <section>
                <span>Finding</span>
                <p>{active.evidence}</p>
              </section>
              <dl>
                <div>
                  <dt>Owner</dt>
                  <dd>{active.owner}</dd>
                </div>
                <div>
                  <dt>Population</dt>
                  <dd>{active.claims ? `${active.claims} claims` : "2 settlement events"}</dd>
                </div>
                <div>
                  <dt>Lineage</dt>
                  <dd>3 linked sources</dd>
                </div>
              </dl>
              <button type="button" className="primary-action" onClick={createOpportunity}>
                Create opportunity
              </button>
            </aside>
          </div>

          <section className="report-panel report-lineage">
            <header>
              <div>
                <span>Object lineage</span>
                <h2>Claims supporting {active.name.toLowerCase()}</h2>
              </div>
              <div className="lineage-tabs">
                <button type="button" className="active">
                  Claims
                </button>
                <button type="button">Definition</button>
                <button type="button">Audit log</button>
              </div>
            </header>
            <div className="lineage-meta">
              <span>
                <b>Paid claim</b> PBM adjudication
              </span>
              <i>→</i>
              <span>
                <b>Drug + class</b> NDC normalization
              </span>
              <i>→</i>
              <span>
                <b>Contract ledger</b> Rebate allocation
              </span>
              <i>→</i>
              <span>
                <b>Net PMPM</b> 49,954 lives
              </span>
            </div>
            <div className="beta-table">
              <div className="trow thead">
                <span>Object ID</span>
                <span>Member</span>
                <span>Drug / event</span>
                <span>Service date</span>
                <span>Net paid</span>
                <span>Variance</span>
              </div>
              {active.lineage.map((c) => (
                <button className="trow" type="button" key={c.id}>
                  <b>{c.id}</b>
                  <span>{c.member}</span>
                  <span>{c.drug}</span>
                  <span>{c.date}</span>
                  <span>{money(c.paid)}</span>
                  <strong>+{money(c.delta)}</strong>
                </button>
              ))}
            </div>
          </section>
        </section>
      </div>

      {notice ? (
        <div className="beta-toast">
          <b>Opportunity created</b>
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
            ×
          </button>
        </div>
      ) : null}
    </AppShell>
  );
}
