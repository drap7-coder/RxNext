import { demoClaimsData, demoClaimsSnapshot } from "@/lib/claims/demo";
import type { PbmClaimsData, PbmClaimsSnapshot } from "@/lib/claims/types";

export type {
  PbmClaimsData,
  PbmClaimsSnapshot,
  ReportKpi,
  ReportScope,
} from "@/lib/claims/types";
export { demoClaimsData, demoClaimsSnapshot } from "@/lib/claims/demo";
export {
  buildProjectionSnapshot,
  defaultProjectionInputs,
  sanitizeProjectionInputs,
  type DemoProjectionInputs,
} from "@/lib/claims/projection";

export type ClaimsDataMode = "demo" | "work";

type EnvLike = Record<string, string | undefined>;

/**
 * Resolve claims-data mode from env.
 * Competitive design benchmarks (not partners): Aon, PSG.
 */
export function resolveClaimsDataMode(
  env: EnvLike = {
    NEXT_PUBLIC_CLAIMS_DATA: process.env.NEXT_PUBLIC_CLAIMS_DATA,
    CLAIMS_DATA: process.env.CLAIMS_DATA,
  },
): ClaimsDataMode {
  const raw = env.NEXT_PUBLIC_CLAIMS_DATA ?? env.CLAIMS_DATA ?? "demo";
  return raw === "work" ? "work" : "demo";
}

/**
 * Active PBM claims data.
 * Demo only today. `CLAIMS_DATA=work` fails closed until a work connector exists —
 * never silently serve demo under a work-mode label.
 */
export function getPbmClaimsData(
  env?: EnvLike,
): PbmClaimsData {
  if (resolveClaimsDataMode(env) === "work") {
    throw new Error(
      "CLAIMS_DATA=work is not configured yet. Omit CLAIMS_DATA (or set demo) until a work PBM claims connector ships.",
    );
  }
  return demoClaimsData;
}

/** Synchronous demo snapshot for UI. Honors mode resolution (throws on work). */
export function getPbmClaimsSnapshot(env?: EnvLike): PbmClaimsSnapshot {
  getPbmClaimsData(env); // enforce fail-closed work mode
  return demoClaimsSnapshot;
}
