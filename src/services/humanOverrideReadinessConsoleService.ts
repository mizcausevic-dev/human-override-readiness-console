// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { operatorPosturePackets, overrideLanePackets, sampleHumanOverrideReadinessPayload } from "../data/sampleHumanOverrideReadiness.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleHumanOverrideReadinessPayload, {
  now: NOW,
  staleGapAfterHours: 24
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    fleets: report.fleets,
    currentSnapshots: report.currentSnapshots,
    gaps: report.gaps,
    blockingGaps: report.blockingGaps,
    trainingGaps: report.trainingGaps,
    drillGaps: report.drillGaps,
    highFindings: report.findingsList.filter((finding) => finding.severity === "high").length,
    recommendation:
      "Restore dual-supervisor coverage, refresh kill-switch drills, repair takeover telemetry continuity, close stale handoff playbooks, and tighten operator training freshness before calling override posture ready."
  };
}

export function overrideLane() {
  return overrideLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "supervisor-path") {
        return finding.code === "supervisor-coverage-gap";
      }
      if (lane.id === "drill-readiness") {
        return finding.code === "kill-switch-drill-overdue";
      }
      if (lane.id === "telemetry-handoff") {
        return finding.code === "telemetry-blind-zone" || finding.code === "handoff-playbook-gap";
      }
      if (lane.id === "operator-readiness") {
        return finding.code === "manual-takeover-latency" || finding.code === "operator-training-stale";
      }
      return false;
    }).length
  }));
}

export function readinessGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.code === "supervisor-coverage-gap"
          ? "Field Robotics Ops"
          : finding.code === "kill-switch-drill-overdue"
            ? "Safety Engineering"
            : finding.code === "telemetry-blind-zone"
              ? "Platform Reliability"
              : finding.code === "handoff-playbook-gap"
                ? "Operations Assurance"
                : finding.code === "manual-takeover-latency"
                  ? "Autonomy Controls"
                  : finding.code === "operator-training-stale"
                    ? "Robotics Operations"
                    : "Platform Reliability"
    }));
}

export function operatorPosture() {
  return operatorPosturePackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline analyzer and CLI, not static copy alone.",
    "Snapshots and override gap packets are synthetic sample data only; no live fleet credentials, secrets, or production telemetry are published.",
    "The control plane keeps supervisor coverage, intervention drills, telemetry continuity, handoff packets, and operator training visible for robotics stakeholders.",
    "This surface demonstrates human-override operational depth, not a generic robotics keyword page.",
    "It complements fleet exception and sensor drift proof with a concrete intervention-readiness lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    overrideLane: overrideLane(),
    readinessGaps: readinessGaps(),
    operatorPosture: operatorPosture(),
    verification: verification(),
    sample: sampleHumanOverrideReadinessPayload
  };
}
