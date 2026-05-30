// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import {
  renderDocs,
  renderOperatorPosture,
  renderOverview,
  renderOverrideLane,
  renderReadinessGaps,
  renderVerification
} from "./render.js";

describe("render", () => {
  test("overview carries the human override framing", () => {
    expect(renderOverview()).toContain("Human override readiness");
  });

  test("detail pages expose their lane names", () => {
    expect(renderOverrideLane()).toContain("Override Lane");
    expect(renderReadinessGaps()).toContain("Readiness Gaps");
    expect(renderOperatorPosture()).toContain("Operator Posture");
    expect(renderVerification()).toContain("Verification");
    expect(renderDocs()).toContain("Offline override readiness analysis");
  });
});
