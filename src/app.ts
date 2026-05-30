// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  operatorPosture,
  overrideLane,
  payload,
  readinessGaps,
  summary,
  verification
} from "./services/humanOverrideReadinessConsoleService.js";
import {
  renderDocs,
  renderOperatorPosture,
  renderOverview,
  renderOverrideLane,
  renderReadinessGaps,
  renderVerification
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5521);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/override-lane", (_req, res) => res.type("html").send(renderOverrideLane()));
app.get("/readiness-gaps", (_req, res) => res.type("html").send(renderReadinessGaps()));
app.get("/operator-posture", (_req, res) => res.type("html").send(renderOperatorPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/override-lane", (_req, res) => res.json(overrideLane()));
app.get("/api/readiness-gaps", (_req, res) => res.json(readinessGaps()));
app.get("/api/operator-posture", (_req, res) => res.json(operatorPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Human Override Readiness Console listening on http://${host}:${port}`);
  });
}

export default app;
