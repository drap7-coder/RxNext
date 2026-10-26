"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  active: "reports" | "solutions";
  contextLeft: ReactNode;
  contextRight?: ReactNode;
  children: ReactNode;
  className?: string;
  organizationName?: string;
};

export function AppShell({
  active,
  contextLeft,
  contextRight,
  children,
  className = "",
  organizationName = "ACME Holdings",
}: AppShellProps) {
  return (
    <main className={`beta-app ${className}`.trim()}>
      <header className="beta-top">
        <Link className="beta-logo" href="/">
          <b>RxNext</b>
          <span>Benefit intelligence</span>
        </Link>
        <nav aria-label="Primary">
          <Link className={active === "reports" ? "active" : undefined} href="/">
            Reports
          </Link>
          <Link
            className={active === "solutions" ? "active" : undefined}
            href="/solutions"
          >
            Opportunities
          </Link>
          <button type="button" disabled title="Coming soon">
            Actions
          </button>
        </nav>
        <div className="beta-org">
          <span>{organizationName}</span>
          <i>Illustrative demo</i>
          <b>{organizationName.slice(0, 2).toUpperCase()}</b>
        </div>
      </header>
      <div className="beta-context">
        <div>{contextLeft}</div>
        <div>{contextRight}</div>
      </div>
      {children}
    </main>
  );
}
