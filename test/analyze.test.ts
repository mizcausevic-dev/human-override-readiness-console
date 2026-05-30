import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { HumanOverrideReadinessExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): HumanOverrideReadinessExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as HumanOverrideReadinessExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts snapshots and gaps", () => {
    const report = analyze(fixture("human-override-readiness.json"), { now: NOW });
    expect(report.fleets).toBe(2);
    expect(report.gaps).toBe(6);
  });

  it("flags stale override snapshots", () => {
    const report = analyze(fixture("human-override-readiness.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "stale-override-snapshot")?.subjectName).toContain("yard-west");
  });

  it("flags supervisor, drill, telemetry, and handoff gaps", () => {
    const report = analyze(fixture("human-override-readiness.json"), { now: NOW, staleGapAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "supervisor-coverage-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "kill-switch-drill-overdue")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "telemetry-blind-zone")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "handoff-playbook-gap")).toBeDefined();
  });

  it("reports ok=true on a clean fixture", () => {
    const report = analyze(fixture("human-override-clean.json"), { now: NOW });
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
    expect(report.ok).toBe(true);
  });
});

describe("formatters", () => {
  it("toMarkdown lists findings", () => {
    const markdown = toMarkdown(analyze(fixture("human-override-readiness.json"), { now: NOW }));
    expect(markdown).toContain("Human override posture");
    expect(markdown).toContain("supervisor-coverage-gap");
  });

  it("toSummary emits the compact one-liner", () => {
    const summary = toSummary(analyze(fixture("human-override-readiness.json"), { now: NOW }));
    expect(summary).toMatch(/^2 snapshots · 6 gaps/);
  });
});
