import { describe, expect, it } from "vitest";
import {
  demoClaimsData,
  demoClaimsSnapshot,
  getPbmClaimsData,
  getPbmClaimsSnapshot,
  resolveClaimsDataMode,
} from "@/lib/claims";

describe("resolveClaimsDataMode", () => {
  it("defaults to demo", () => {
    expect(resolveClaimsDataMode({})).toBe("demo");
    expect(resolveClaimsDataMode({ CLAIMS_DATA: "demo" })).toBe("demo");
    expect(resolveClaimsDataMode({ NEXT_PUBLIC_CLAIMS_DATA: "demo" })).toBe("demo");
  });

  it("detects work mode from either env key", () => {
    expect(resolveClaimsDataMode({ CLAIMS_DATA: "work" })).toBe("work");
    expect(resolveClaimsDataMode({ NEXT_PUBLIC_CLAIMS_DATA: "work" })).toBe("work");
  });
});

describe("getPbmClaimsData", () => {
  it("returns demo claims data in demo mode", () => {
    expect(getPbmClaimsData({ CLAIMS_DATA: "demo" })).toBe(demoClaimsData);
    expect(getPbmClaimsData({})).toBe(demoClaimsData);
  });

  it("fails closed for work mode instead of silently serving demo", () => {
    expect(() => getPbmClaimsData({ CLAIMS_DATA: "work" })).toThrow(/not configured yet/i);
    expect(() => getPbmClaimsData({ NEXT_PUBLIC_CLAIMS_DATA: "work" })).toThrow(
      /not configured yet/i,
    );
  });
});

describe("getPbmClaimsSnapshot", () => {
  it("returns the demo snapshot in demo mode", () => {
    expect(getPbmClaimsSnapshot({})).toBe(demoClaimsSnapshot);
  });

  it("does not silently resolve work mode to demo", () => {
    expect(() => getPbmClaimsSnapshot({ CLAIMS_DATA: "work" })).toThrow(/not configured yet/i);
  });
});
