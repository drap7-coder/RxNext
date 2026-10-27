"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  buildProjectionSnapshot,
  defaultProjectionInputs,
  sanitizeProjectionInputs,
  type DemoProjectionInputs,
} from "@/lib/claims";
import { compactMoney, money } from "@/lib/format";
import { opportunities, portfolioTotals } from "@/lib/opportunities";
import "./product.css";

const projectionStorageKey = "rxnext-demo-projection";

const workspaces = [
  [
    "01",
    "Reports",
    "Observe",
    "Understand spend, trend, utilization, specialty, and guarantees.",
    "/reports",
    "Open reporting",
    "blue",
  ],
  [
    "02",
    "Opportunities",
    "Prioritize",
    "Turn material variances into an ordered pipeline of value at risk.",
    "/solutions",
    "Review pipeline",
    "amber",
  ],
  [
    "03",
    "Solution matching",
    "Resolve",
    "Diff each gap against the capabilities required to close it.",
    "/solutions",
    "Compare solutions",
    "violet",
  ],
  [
    "04",
    "Decisions",
    "Decide",
    "Carry evidence, economics, gates, and rationale into one record.",
    "/solutions",
    "Enter workspace",
    "emerald",
  ],
] as const;

function readProjection() {
  try {
    const saved = localStorage.getItem(projectionStorageKey);
    return saved
      ? sanitizeProjectionInputs(JSON.parse(saved) as DemoProjectionInputs)
      : defaultProjectionInputs;
  } catch {
    return defaultProjectionInputs;
  }
}

export default function Home() {
  const [projection, setProjection] = useState(defaultProjectionInputs);
  const [hasSavedProjection, setHasSavedProjection] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasSavedProjection(Boolean(localStorage.getItem(projectionStorageKey)));
      setProjection(readProjection());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const claims = useMemo(
    () => buildProjectionSnapshot(projection),
    [projection],
  );
  const projectedTrendDollars = Math.round(
    projection.annualSpend * (projection.trendPercent / 100),
  );

  return (
    <AppShell
      active="home"
      className="command-app"
      organizationName={projection.planName}
      contextLeft={
        <>
          <span>Enterprise</span>
          <b>/</b>
          <strong>Pharmacy command center</strong>
        </>
      }
      contextRight={
        <>
          <i className="demo-dot" />
          Demo mode · illustrative projection
          <Link href="/reports">Edit assumptions</Link>
        </>
      }
    >
      <div className="command-shell">
        <header className="command-hero">
          <div>
            <span>RXNEXT OPERATING SYSTEM · OCTOBER 2026</span>
            <h1>From pharmacy signal to accountable decision.</h1>
            <p>
              One operating layer to observe performance, find material gaps,
              match the right intervention, and carry the decision through
              execution.
            </p>
          </div>
          <div className="command-hero-status">
            <span>Operating status</span>
            <strong>
              <i /> Demo environment ready
            </strong>
            <small>
              {hasSavedProjection
                ? "Saved plan assumptions applied"
                : "Reference assumptions applied"}
            </small>
          </div>
        </header>

        <section
          className="command-kpis"
          aria-label="Executive pharmacy summary"
        >
          <article>
            <span>Annual Rx spend</span>
            <strong>{compactMoney(projection.annualSpend)}</strong>
            <small>{projection.lives.toLocaleString()} eligible lives</small>
          </article>
          <article>
            <span>Projected trend</span>
            <strong>{projection.trendPercent.toFixed(1)}%</strong>
            <small>{money(projectedTrendDollars)} annual pressure</small>
          </article>
          <article>
            <span>Identified value</span>
            <strong>{money(portfolioTotals.identifiedValue)}</strong>
            <small>Across {opportunities.length} active opportunities</small>
          </article>
          <article>
            <span>In decision</span>
            <strong>{portfolioTotals.inDecision}</strong>
            <small>Next gate · {portfolioTotals.nextDeadline}</small>
          </article>
          <article className="data-status">
            <span>Data status</span>
            <strong>
              <i /> Illustrative demo
            </strong>
            <small>{claims.scope.periodLabel} · ingestion-ready</small>
          </article>
        </section>

        <section className="command-section">
          <header>
            <div>
              <span>WORKSPACES</span>
              <h2>Choose where to work</h2>
            </div>
            <p>
              Each workspace preserves the evidence and assumptions behind the
              next one.
            </p>
          </header>
          <div className="workspace-grid">
            {workspaces.map(
              ([index, title, eyebrow, description, href, action, accent]) => (
                <Link
                  className={`workspace-card ${accent}`}
                  href={href}
                  key={title}
                >
                  <div className="workspace-card-top">
                    <i>{index}</i>
                    <span>{eyebrow}</span>
                    <b>↗</b>
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <footer>
                    <span>{action}</span>
                    <b>→</b>
                  </footer>
                </Link>
              ),
            )}
          </div>
        </section>

        <section className="command-bottom">
          <article className="command-flow">
            <header>
              <div>
                <span>OPERATOR LOOP</span>
                <h2>One connected decision chain</h2>
              </div>
              <Link href="/solutions">View active work →</Link>
            </header>
            <div>
              {[
                ["Observe", "Claims + assumptions"],
                ["Diff", "Observed vs target"],
                ["Match", "Gap vs capability"],
                ["Decide", "Economics + gates"],
                ["Write back", "Action + outcome"],
              ].map(([label, detail], index) => (
                <div key={label}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <b>{label}</b>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="command-operations">
            <header>
              <span>FOUNDATION</span>
              <h2>Ready now, extensible later</h2>
            </header>
            <Link href="/reports">
              <div>
                <i className="ready" />
                <b>Data foundation</b>
                <span>Demo projection active</span>
              </div>
              <strong>Configure →</strong>
            </Link>
            <Link href="/solutions">
              <div>
                <i className="active" />
                <b>Action queue</b>
                <span>{portfolioTotals.inDecision} decisions moving</span>
              </div>
              <strong>Review →</strong>
            </Link>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
