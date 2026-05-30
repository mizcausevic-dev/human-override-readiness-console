import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  operatorPosture,
  overrideLane,
  payload,
  readinessGaps,
  summary,
  verification
} from "../src/services/humanOverrideReadinessConsoleService.js";
import {
  renderDocs,
  renderOperatorPosture,
  renderOverview,
  renderOverrideLane,
  renderReadinessGaps,
  renderVerification
} from "../src/services/render.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = path.join(root, "site");

mkdirSync(site, { recursive: true });

const pages: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("override-lane", "index.html")]: renderOverrideLane(),
  [path.join("readiness-gaps", "index.html")]: renderReadinessGaps(),
  [path.join("operator-posture", "index.html")]: renderOperatorPosture(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs()
};

for (const [relative, html] of Object.entries(pages)) {
  const target = path.join(site, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, html);
}

const apis: Record<string, unknown> = {
  [path.join("api", "dashboard", "summary.json")]: summary(),
  [path.join("api", "override-lane.json")]: overrideLane(),
  [path.join("api", "readiness-gaps.json")]: readinessGaps(),
  [path.join("api", "operator-posture.json")]: operatorPosture(),
  [path.join("api", "verification.json")]: verification(),
  [path.join("api", "sample.json")]: payload()
};

for (const [relative, data] of Object.entries(apis)) {
  const target = path.join(site, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(data, null, 2));
}

writeFileSync(
  path.join(site, "robots.txt"),
  "User-agent: *\nAllow: /\nSitemap: https://override.kineticgain.com/sitemap.xml\n"
);
writeFileSync(
  path.join(site, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://override.kineticgain.com/</loc></url>
  <url><loc>https://override.kineticgain.com/override-lane/</loc></url>
  <url><loc>https://override.kineticgain.com/readiness-gaps/</loc></url>
  <url><loc>https://override.kineticgain.com/operator-posture/</loc></url>
  <url><loc>https://override.kineticgain.com/verification/</loc></url>
  <url><loc>https://override.kineticgain.com/docs/</loc></url>
</urlset>`
);

const cname = path.join(root, "CNAME");
if (existsSync(cname)) {
  copyFileSync(cname, path.join(site, "CNAME"));
}
