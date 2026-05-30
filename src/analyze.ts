import type { Finding, HumanOverrideReadinessExport, OverrideSnapshot, PostureOptions, PostureReport } from "./types.js";

function isCurrent(snapshot: OverrideSnapshot): boolean {
  return snapshot.snapshotStatus === "CURRENT";
}

function includesAny(text: string, needles: string[]): boolean {
  const haystack = text.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

export function analyze(payload: HumanOverrideReadinessExport, options: PostureOptions = {}): PostureReport {
  const now = options.now ?? new Date().toISOString();
  const staleGapAfterHours = options.staleGapAfterHours ?? 24;
  const snapshots = payload.snapshots ?? [];
  const gaps = payload.gaps ?? [];
  const findingsList: Finding[] = [];

  const currentSnapshots = snapshots.filter(isCurrent).length;
  if (currentSnapshots === 0) {
    findingsList.push({
      code: "no-current-override-snapshot",
      severity: "high",
      message: "No current human-override readiness snapshot is available for fleet review.",
      subject: "override-snapshot-currentness"
    });
  }

  for (const snapshot of snapshots) {
    if (snapshot.snapshotStatus === "STALE") {
      findingsList.push({
        code: "stale-override-snapshot",
        severity: snapshot.readinessStatus === "CRITICAL" ? "high" : "medium",
        message: `Override readiness snapshot for "${snapshot.name}" is stale and should be refreshed before certifying intervention posture.`,
        subject: snapshot.id,
        subjectName: snapshot.controlPath,
        scope: snapshot.scope
      });
    }
  }

  for (const gap of gaps) {
    const observed = gap.observedState.toLowerCase();

    if (gap.controlFamily === "Supervisor" && includesAny(observed, ["one", "single", "not available", "unreachable"])) {
      findingsList.push({
        code: "supervisor-coverage-gap",
        severity: gap.blocksOverride ? "high" : "medium",
        message: `Human supervisor coverage is too thin on "${gap.resourcePath}" for a trustworthy override path.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Latency" && includesAny(observed, ["7.", "slow", "delay", "rose"])) {
      findingsList.push({
        code: "manual-takeover-latency",
        severity: gap.blocksOverride ? "high" : "medium",
        message: `Manual takeover latency is above the expected envelope on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Training" && includesAny(observed, ["beyond", "stale", "expired", "refresh"])) {
      findingsList.push({
        code: "operator-training-stale",
        severity: gap.blocksOverride ? "high" : "medium",
        message: `Operator override training is stale on "${gap.resourcePath}" and should be refreshed before the next route certification.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Drill" && includesAny(observed, ["39 days", "overdue", "old", "stale"])) {
      findingsList.push({
        code: "kill-switch-drill-overdue",
        severity: gap.blocksOverride ? "high" : "medium",
        message: `Emergency stop drill evidence is overdue on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Telemetry" && includesAny(observed, ["drops", "blind", "missing", "loss"])) {
      findingsList.push({
        code: "telemetry-blind-zone",
        severity: gap.blocksOverride ? "high" : "medium",
        message: `Manual takeover telemetry is incomplete on "${gap.resourcePath}", weakening replay and operator confidence.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Handoff" && includesAny(observed, ["missing", "removed", "not updated"])) {
      findingsList.push({
        code: "handoff-playbook-gap",
        severity: gap.blocksOverride ? "high" : "medium",
        message: `Override handoff playbook coverage is incomplete on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.gapWindowHours > staleGapAfterHours) {
      findingsList.push({
        code: "stale-gap-window",
        severity: gap.gapWindowHours > staleGapAfterHours * 2 ? "medium" : "low",
        message: `Gap on "${gap.resourcePath}" has remained unresolved for ${gap.gapWindowHours} hours.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }
  }

  const blockingGaps = gaps.filter((gap) => gap.blocksOverride).length;
  const trainingGaps = gaps.filter((gap) => gap.controlFamily === "Training").length;
  const drillGaps = gaps.filter((gap) => gap.controlFamily === "Drill").length;
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    fleets: snapshots.length,
    currentSnapshots,
    gaps: gaps.length,
    blockingGaps,
    trainingGaps,
    drillGaps,
    findingsList,
    ok
  };
}
