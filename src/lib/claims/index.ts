import { demoClaimsData } from "@/lib/claims/demo";
import type { PbmClaimsData } from "@/lib/claims/types";

export type {
  PbmClaimsData,
  PbmClaimsSnapshot,
  ReportKpi,
  ReportScope,
} from "@/lib/claims/types";
export { demoClaimsData, demoClaimsSnapshot } from "@/lib/claims/demo";

/**
 * Active PBM claims data for the app.
 * Today: demo fixtures. Next: work claims dataset via CLAIMS_DATA=work.
 *
 * Competitive design benchmarks (not partners): Aon, PSG.
 */
export function getPbmClaimsData(): PbmClaimsData {
  const mode = process.env.NEXT_PUBLIC_CLAIMS_DATA ?? process.env.CLAIMS_DATA ?? "demo";
  if (mode === "work") {
    // Placeholder until a safe work claims connector ships.
    return demoClaimsData;
  }
  return demoClaimsData;
}

