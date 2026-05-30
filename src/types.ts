export type ScopeKind = "FLEET" | "ROBOT" | "ROUTE" | "CELL" | "SUPERVISOR_GROUP";
export type ReadinessHealth = "HEALTHY" | "WATCH" | "CRITICAL";
export type SnapshotStatus = "CURRENT" | "STALE";
export type GapStatus = "ADDED" | "REMOVED" | "CHANGED" | "DEGRADED";
export type ControlFamily =
  | "Supervisor"
  | "Drill"
  | "Telemetry"
  | "Handoff"
  | "Latency"
  | "Safety"
  | "Training";

export interface OverrideSnapshot {
  id: string;
  name: string;
  scope: ScopeKind;
  readinessStatus: ReadinessHealth;
  snapshotStatus: SnapshotStatus;
  controlPath: string;
  supervisorCount: number;
  owner: string;
  drillCount: number;
  collectedAt: string;
}

export interface OverrideGap {
  id: string;
  snapshotId: string;
  resourcePath: string;
  scope: ScopeKind;
  controlFamily: ControlFamily;
  status: GapStatus;
  expectedState: string;
  observedState: string;
  gapWindowHours: number;
  blocksOverride?: boolean;
  note?: string;
}

export interface HumanOverrideReadinessExport {
  snapshots?: OverrideSnapshot[];
  gaps?: OverrideGap[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-override-snapshot"
  | "stale-override-snapshot"
  | "supervisor-coverage-gap"
  | "manual-takeover-latency"
  | "operator-training-stale"
  | "kill-switch-drill-overdue"
  | "telemetry-blind-zone"
  | "handoff-playbook-gap"
  | "stale-gap-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  controlFamily?: ControlFamily;
}

export interface PostureReport {
  generatedAt: string;
  fleets: number;
  currentSnapshots: number;
  gaps: number;
  blockingGaps: number;
  trainingGaps: number;
  drillGaps: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface PostureOptions {
  now?: string;
  staleGapAfterHours?: number;
}
