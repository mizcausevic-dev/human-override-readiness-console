import fs from "node:fs";
import path from "node:path";

const domain = process.argv[2];
const siteDir = path.resolve("site");

if (!domain || !fs.existsSync(siteDir)) {
  process.exit(0);
}

for (const file of fs.readdirSync(siteDir)) {
  if (!file.endsWith(".html")) continue;
  const full = path.join(siteDir, file);
  const html = fs.readFileSync(full, "utf8");
  const pathname = file === "index.html" ? "/" : `/${file.replace(/\.html$/, "")}`;
  const url = `https://${domain}${pathname}`;

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const pageTitle = titleMatch ? titleMatch[1] : "Human Override Readiness Console";
  const pageDesc = descMatch
    ? descMatch[1]
    : "Operator surface for robotics human-override readiness, supervisor coverage, intervention drills, telemetry blind zones, and handoff-safe remediation posture.";

  const meta = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="Human Override Readiness Console" />`,
    `<meta property="og:title" content="${pageTitle}" />`,
    `<meta property="og:description" content="${pageDesc}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${pageTitle}" />`,
    `<meta name="twitter:description" content="${pageDesc}" />`
  ].join("\n    ");

  fs.writeFileSync(full, html.replace("</head>", `    ${meta}\n  </head>`));
}
