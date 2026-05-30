import { describe, expect, test } from "vitest";

import {
  operatorPosture,
  overrideLane,
  readinessGaps,
  summary,
  verification
} from "./humanOverrideReadinessConsoleService.js";

describe("humanOverrideReadinessConsoleService", () => {
  test("summary reflects the sample posture", () => {
    expect(summary()).toMatchObject({
      fleets: 2,
      currentSnapshots: 1,
      gaps: 6,
      blockingGaps: 4,
      trainingGaps: 1,
      drillGaps: 1
    });
  });

  test("override lane stays mapped to owners", () => {
    const lanes = overrideLane();
    expect(lanes).toHaveLength(4);
    expect(lanes.some((lane) => lane.lane === "Supervisor coverage lane" && lane.owner === "Field Robotics Ops")).toBe(true);
  });

  test("readiness gaps sort high severity first", () => {
    const gaps = readinessGaps();
    expect(gaps[0]?.severity).toBe("high");
    expect(gaps.some((gap) => gap.code === "supervisor-coverage-gap")).toBe(true);
  });

  test("operator posture and verification stay populated", () => {
    expect(operatorPosture()).toHaveLength(4);
    expect(verification().length).toBeGreaterThan(3);
  });
});
