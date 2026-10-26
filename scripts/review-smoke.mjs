import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const OUT = "/opt/cursor/artifacts/screenshots";
mkdirSync(OUT, { recursive: true });

const results = [];

async function shot(page, name) {
  const path = `${OUT}/review-${name}.png`;
  await page.screenshot({ path, fullPage: true });
  results.push(`screenshot:${path}`);
}

async function runViewport(browser, label, size) {
  const page = await browser.newPage({ viewport: size });
  const log = (msg) => results.push(`[${label}] ${msg}`);

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Overview" }).waitFor();
  log("Reports Overview loaded");

  // Lineage + driver selection
  await page.getByRole("button", { name: /Specialty site of care/ }).first().click();
  await page.getByRole("heading", { name: "Specialty site of care", exact: true }).waitFor();
  const lineage = await page.locator(".report-lineage .trow").count();
  if (lineage < 2) throw new Error(`Expected lineage rows, got ${lineage}`);
  log(`Lineage rows for specialty: ${lineage}`);

  await page.getByRole("button", { name: "Create opportunity" }).click();
  await page.getByText(/created and added to the decision pipeline/).waitFor();
  log("Create opportunity toast shown");

  const stored = await page.evaluate(() => localStorage.getItem("rxnext-opportunities"));
  if (!stored || !stored.includes("Specialty site of care")) {
    throw new Error("localStorage opportunity missing");
  }
  log("localStorage opportunity written");

  await shot(page, `${label}-reports`);

  // Opportunities portfolio
  await page.getByRole("link", { name: "Opportunities" }).click();
  await page.getByRole("heading", { name: "Opportunity pipeline" }).waitFor();
  log("Opportunities portfolio loaded");

  await page.getByRole("button", { name: /Specialty site of care/ }).first().waitFor();
  log("Created opportunity visible in portfolio");

  await page.getByRole("button", { name: /GLP-1 cost and access strategy/ }).click();
  await page.getByRole("heading", { name: "GLP-1 cost and access strategy" }).waitFor();
  log("Opened GLP-1 workspace");

  await page.getByRole("button", { name: /Candidates/ }).click();
  await page.getByRole("heading", { name: "Evidence-ranked shortlist" }).waitFor();
  const cards = await page.locator(".candidate-card").count();
  if (cards < 1) throw new Error("No candidate cards");
  log(`Candidates: ${cards}`);

  await page.getByRole("button", { name: /Diligence/ }).click();
  await page.getByRole("heading", { name: /Waltz|Levrx|Scripta|Free Market|Amazon|Navitus|Smith|Rightway|Cost Plus|GLP-1|Judi/i }).first().waitFor();
  await page.getByLabel("Evidence note").fill("Review smoke note");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page.getByText("Evidence note added to the decision record.").waitFor();
  log("Diligence note added");

  await page.getByRole("button", { name: /Economics/ }).click();
  await page.getByRole("heading", { name: "Year-one intervention case" }).waitFor();
  const before = await page.locator(".scenario-results .base strong").innerText();
  await page.locator('input[type="range"]').first().fill("50");
  const after = await page.locator(".scenario-results .base strong").innerText();
  log(`Economics base before=${before} after=${after}`);

  await page.getByRole("button", { name: /Decision/ }).click();
  await page.getByRole("heading", { name: "Evaluation gates" }).waitFor();
  const gates = await page.locator(".gates > div").count();
  if (gates !== 7) throw new Error(`Expected 7 gates, got ${gates}`);
  log(`Decision gates: ${gates}`);

  await shot(page, `${label}-workspace`);
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  await runViewport(browser, "desktop", { width: 1440, height: 900 });
  await runViewport(browser, "mobile", { width: 390, height: 844 });
  console.log(JSON.stringify({ ok: true, results }, null, 2));
} catch (err) {
  console.error(JSON.stringify({ ok: false, error: String(err), results }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
