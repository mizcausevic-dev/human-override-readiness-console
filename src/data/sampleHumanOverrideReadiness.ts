import type { HumanOverrideReadinessExport } from "../types.js";

export const sampleHumanOverrideReadinessPayload: HumanOverrideReadinessExport = {
  snapshots: [
    {
      id: "fleet-warehouse",
      name: "Warehouse autonomy fleet",
      scope: "FLEET",
      readinessStatus: "WATCH",
      snapshotStatus: "CURRENT",
      controlPath: "/fleets/warehouse-a/override-readiness",
      supervisorCount: 6,
      owner: "Robotics Operations",
      drillCount: 4,
      collectedAt: "2026-05-30T14:00:00Z"
    },
    {
      id: "route-yard",
      name: "Yard inspection route set",
      scope: "ROUTE",
      readinessStatus: "CRITICAL",
      snapshotStatus: "STALE",
      controlPath: "/routes/yard-west/override-readiness",
      supervisorCount: 2,
      owner: "Field Robotics Ops",
      drillCount: 1,
      collectedAt: "2026-05-27T09:20:00Z"
    }
  ],
  gaps: [
    {
      id: "gap-supervisor-coverage",
      snapshotId: "route-yard",
      resourcePath: "yard-west / after-hours supervisor rotation",
      scope: "SUPERVISOR_GROUP",
      controlFamily: "Supervisor",
      status: "DEGRADED",
      expectedState: "Two independent supervisors remain reachable for every live route window.",
      observedState: "Only one on-call supervisor is available during the overnight window.",
      gapWindowHours: 18,
      blocksOverride: true,
      note: "Single-point supervisor coverage is active."
    },
    {
      id: "gap-kill-switch-drill",
      snapshotId: "route-yard",
      resourcePath: "yard-west emergency stop drill",
      scope: "ROUTE",
      controlFamily: "Drill",
      status: "CHANGED",
      expectedState: "Emergency stop drill refreshed within the last 14 days.",
      observedState: "Last successful drill is 39 days old.",
      gapWindowHours: 39,
      blocksOverride: true
    },
    {
      id: "gap-telemetry-blind-zone",
      snapshotId: "fleet-warehouse",
      resourcePath: "dock-17 manual takeover telemetry",
      scope: "CELL",
      controlFamily: "Telemetry",
      status: "DEGRADED",
      expectedState: "Operator video and command telemetry remain visible through takeover.",
      observedState: "Video feed drops during the first 12 seconds of manual override.",
      gapWindowHours: 12,
      blocksOverride: true
    },
    {
      id: "gap-takeover-latency",
      snapshotId: "fleet-warehouse",
      resourcePath: "picker-cluster north / manual takeover timing",
      scope: "ROBOT",
      controlFamily: "Latency",
      status: "CHANGED",
      expectedState: "Median operator takeover stays under 4 seconds.",
      observedState: "Median operator takeover rose to 7.2 seconds during congestion.",
      gapWindowHours: 9,
      blocksOverride: false
    },
    {
      id: "gap-training-stale",
      snapshotId: "fleet-warehouse",
      resourcePath: "warehouse override certification cohort",
      scope: "SUPERVISOR_GROUP",
      controlFamily: "Training",
      status: "DEGRADED",
      expectedState: "Override operators stay current on quarterly intervention training.",
      observedState: "Three operators are beyond the training refresh window.",
      gapWindowHours: 21,
      blocksOverride: false
    },
    {
      id: "gap-handoff-playbook",
      snapshotId: "route-yard",
      resourcePath: "yard-west override handoff packet",
      scope: "ROUTE",
      controlFamily: "Handoff",
      status: "REMOVED",
      expectedState: "Active route playbook contains the current override contact tree and post-event handoff path.",
      observedState: "Published playbook is missing the updated field escalation path.",
      gapWindowHours: 28,
      blocksOverride: true
    }
  ]
};

export const overrideLanePackets = [
  {
    id: "supervisor-path",
    lane: "Supervisor coverage lane",
    owner: "Field Robotics Ops",
    focus: "Reachable humans, fallback rotations, and live route ownership",
    status: "red",
    note: "Overnight route coverage is operating with a single-point supervisor path.",
    nextAction: "Restore dual-supervisor coverage before the next overnight release window."
  },
  {
    id: "drill-readiness",
    lane: "Drill readiness lane",
    owner: "Safety Engineering",
    focus: "Emergency stop drills, intervention repetitions, and sign-off freshness",
    status: "red",
    note: "Kill-switch rehearsal has aged past the trusted window for yard operations.",
    nextAction: "Run and record a fresh emergency stop drill with current operators."
  },
  {
    id: "telemetry-handoff",
    lane: "Telemetry and handoff lane",
    owner: "Platform Reliability",
    focus: "Video continuity, control telemetry, and post-event packet completeness",
    status: "yellow",
    note: "Takeover telemetry is incomplete during the first seconds of intervention.",
    nextAction: "Repair the dock-17 video gap and republish the handoff packet."
  },
  {
    id: "operator-readiness",
    lane: "Operator readiness lane",
    owner: "Robotics Operations",
    focus: "Takeover latency, operator training, and certification confidence",
    status: "yellow",
    note: "Training drift and takeover latency are both moving away from the safe baseline.",
    nextAction: "Refresh operator cohort training and reduce congestion-time takeover delay."
  }
] as const;

export const operatorPosturePackets = [
  {
    packetId: "OVR-11",
    lane: "Supervisor recovery",
    owner: "Field Robotics Ops",
    status: "red",
    completenessScore: 56,
    decisionNote: "Supervisor reachability is not strong enough to call the overnight yard route override-safe.",
    blocker: "Single-supervisor coverage remains active in a live route window.",
    launchWindowHours: 6
  },
  {
    packetId: "OVR-19",
    lane: "Drill restoration",
    owner: "Safety Engineering",
    status: "red",
    completenessScore: 61,
    decisionNote: "Emergency stop posture cannot be trusted while the current drill evidence is stale.",
    blocker: "Kill-switch drill is overdue and no fresh evidence packet is attached.",
    launchWindowHours: 10
  },
  {
    packetId: "OVR-24",
    lane: "Telemetry continuity",
    owner: "Platform Reliability",
    status: "yellow",
    completenessScore: 74,
    decisionNote: "Manual takeover is mostly supported, but telemetry continuity still breaks on the dock edge case.",
    blocker: "First-12-second video loss prevents a fully trustworthy replay trail.",
    launchWindowHours: 14
  },
  {
    packetId: "OVR-31",
    lane: "Operator certification repair",
    owner: "Robotics Operations",
    status: "yellow",
    completenessScore: 79,
    decisionNote: "Override skill exists, but the current operator cohort is drifting outside the training freshness window.",
    blocker: "Three operators need certification refresh before the next audit-safe publish.",
    launchWindowHours: 24
  }
] as const;
