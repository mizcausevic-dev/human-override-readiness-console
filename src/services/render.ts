// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  operatorPosture,
  overrideLane,
  readinessGaps,
  summary,
  verification
} from "./humanOverrideReadinessConsoleService.js";

function layout(title: string, active: string, body: string) {
  const nav = [
    { href: "/", label: "Overview" },
    { href: "/override-lane", label: "Override Lane" },
    { href: "/readiness-gaps", label: "Readiness Gaps" },
    { href: "/operator-posture", label: "Operator Posture" },
    { href: "/verification", label: "Verification" },
    { href: "/docs", label: "Docs" }
  ];

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root{
        --bg:#070a0f; --panel:#0b1220; --panel2:#0a1426;
        --line:rgba(120,255,170,.18); --line2:rgba(120,255,170,.10);
        --text:#e9f3ff; --muted:rgba(233,243,255,.72); --muted2:rgba(233,243,255,.55);
        --bert:#37ff8b; --bert2:#19c7ff; --warn:#ffcc66; --bad:#ff5c7a; --good:#37ff8b;
        --shadow: 0 18px 60px rgba(0,0,0,.55);
        --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --sans: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }
      *{box-sizing:border-box} html,body{height:100%}
      body{
        margin:0; font-family:var(--sans); color:var(--text);
        background:
          radial-gradient(1200px 600px at 20% -10%, rgba(55,255,139,.18), transparent 60%),
          radial-gradient(900px 520px at 90% 0%, rgba(25,199,255,.16), transparent 55%),
          radial-gradient(1000px 600px at 50% 110%, rgba(55,255,139,.10), transparent 60%),
          linear-gradient(180deg, #05070c 0%, #070a0f 35%, #05070c 100%);
      }
      .wrap{max-width:1280px; margin:0 auto; padding:24px 22px 80px}
      .topbar{
        display:flex; justify-content:space-between; align-items:flex-start; gap:14px;
        border-bottom:1px solid var(--line2); padding-bottom:14px; margin-bottom:22px;
        font-family:var(--mono); font-size:11px; letter-spacing:.16em; color:var(--muted); text-transform:uppercase;
      }
      .topbar .left{color:var(--bert)}
      .topbar .right{text-align:right}
      .topbar .right div{margin-bottom:4px}
      .herorow{display:grid; grid-template-columns:1.5fr .9fr; gap:18px}
      @media (max-width:1000px){.herorow{grid-template-columns:1fr}}
      .hero,.card,.corr,.bluf{background:linear-gradient(180deg, rgba(11,18,32,.95), rgba(8,14,26,.92)); border:1px solid var(--line); box-shadow:var(--shadow)}
      .hero{border-radius:22px; padding:28px 28px 24px; border-top:2px solid var(--bert2)}
      .hero h1{font-size:58px; line-height:.96; margin:0 0 16px; font-weight:800; letter-spacing:-.5px}
      @media (max-width:700px){.hero h1{font-size:40px}}
      .hero p{color:var(--muted); font-size:15px; line-height:1.55; max-width:680px; margin:0 0 18px}
      .chiprow,.navrow,.footer-links{display:flex; flex-wrap:wrap; gap:8px}
      .meta-chip,.navchip{
        font-family:var(--mono); font-size:11px; color:var(--muted);
        padding:8px 12px; border-radius:999px; border:1px solid var(--line);
        background:rgba(6,10,18,.4); text-decoration:none;
      }
      .navchip.active{color:#071017;background:linear-gradient(135deg,var(--bert),var(--bert2));font-weight:700}
      .side{display:flex; flex-direction:column; gap:14px}
      .corr,.bluf{border-radius:14px; padding:16px 18px}
      .corr{border-left:4px solid var(--bert)}
      .bluf{border-left:4px solid var(--warn)}
      .corr .lbl,.bluf .lbl{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase}
      .corr .lbl{color:var(--bert)} .bluf .lbl{color:var(--warn)}
      .corr p,.bluf p,.card p,.card li,.ttbl td,.ttbl th{color:var(--muted); line-height:1.55}
      .section{margin-top:34px}
      .sh{display:flex; justify-content:space-between; align-items:baseline; gap:14px; padding-bottom:10px; border-bottom:1px solid var(--line2); margin-bottom:14px}
      .sh h2{margin:0; font-size:24px}
      .sh .note{font-family:var(--mono); font-size:11px; color:var(--muted2); letter-spacing:.16em; text-transform:uppercase}
      .kpis{display:grid; grid-template-columns:repeat(6,1fr); gap:12px}
      @media (max-width:1100px){.kpis{grid-template-columns:repeat(3,1fr)}} @media (max-width:640px){.kpis{grid-template-columns:repeat(2,1fr)}}
      .kpi{border:1px solid var(--line); border-radius:14px; padding:14px; background:linear-gradient(180deg, rgba(11,18,32,.85), rgba(8,14,26,.65))}
      .kpi .v{font-family:var(--mono); font-size:26px; font-weight:600; color:var(--bert2)}
      .kpi .lbl{font-family:var(--mono); font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); margin-top:6px}
      .kpi .h{font-size:12px; color:var(--muted); margin-top:8px}
      .stack,.board{display:grid; grid-template-columns:repeat(3,1fr); gap:14px}
      @media (max-width:1000px){.stack,.board{grid-template-columns:1fr}}
      .src,.pcard,.card{border-radius:16px; padding:18px 20px}
      .src{border:1px solid var(--line)}
      .src .src-name{font-family:var(--mono); font-size:11px; color:var(--bert); letter-spacing:.18em; text-transform:uppercase}
      .src .src-tit{margin:8px 0 6px; font-size:18px; font-weight:600}
      .ttbl{width:100%; border-collapse:separate; border-spacing:0; border:1px solid var(--line); border-radius:14px; overflow:hidden}
      .ttbl th,.ttbl td{padding:13px 14px; text-align:left; font-size:13.5px; vertical-align:top}
      .ttbl thead th{font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted2); border-bottom:1px solid var(--line); background:rgba(11,18,32,.5)}
      .st{font-family:var(--mono); font-size:10px; padding:4px 9px; border-radius:6px; letter-spacing:.1em; text-transform:uppercase; border:1px solid currentColor; display:inline-block}
      .red{color:var(--bad)} .yellow{color:var(--warn)} .green{color:var(--good)} .info{color:var(--bert2)}
      .pcard .ptop{display:flex; justify-content:space-between; align-items:center; margin-bottom:8px}
      .pcard .pnum{font-family:var(--mono); font-size:22px; font-weight:600; color:var(--bert)}
      .pcard .ppri{font-family:var(--mono); font-size:10px; padding:5px 10px; border-radius:999px; border:1px solid var(--line); color:var(--bert)}
      .pcard h3{margin:6px 0 8px; font-size:19px}
      .pcard .pdesc{font-size:13.5px; color:var(--muted); margin:0 0 14px}
      .pcard ul.check{list-style:none; padding:0; margin:0 0 14px}
      .pcard ul.check li{padding:6px 0; font-size:13.5px; color:var(--muted)}
      .footer{margin-top:30px; padding-top:14px; border-top:1px dashed var(--line2); display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; font-family:var(--mono); font-size:11px; color:var(--muted2)}
      a{color:inherit}
      code{font-family:var(--mono); font-size:12px; color:var(--bert2); background:rgba(25,199,255,.08); padding:1px 6px; border-radius:5px; border:1px solid rgba(25,199,255,.18)}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="topbar">
        <div class="left">Kinetic Gain · Human Override Readiness Console</div>
        <div class="right">
          <div>synthetic override packets · intervention posture</div>
          <div>robotics · supervisor coverage · takeover latency</div>
        </div>
      </div>
      <div class="herorow">
        <section class="hero">
          <div class="chiprow">
            <span class="meta-chip">Robotics vertical anchor</span>
            <span class="meta-chip">Human override and intervention proof</span>
            <span class="meta-chip">Synthetic sample data only</span>
          </div>
          <h1>Human override readiness that stays visible before the fleet needs a real person to step in.</h1>
          <p>This control plane turns override snapshots into one robotics surface: supervisor coverage, intervention drills, takeover latency, telemetry blind zones, handoff packet completeness, and operator training freshness.</p>
          <div class="navrow">
            ${nav.map((link) => `<a class="navchip${active === link.href ? " active" : ""}" href="${link.href}">${link.label}</a>`).join("")}
          </div>
        </section>
        <aside class="side">
          <div class="bluf">
            <div class="lbl">Commercial Front Door</div>
            <p><strong>Human override, intervention safety, and operator-readiness proof for robotics and industrial automation teams.</strong><br />Audit-safe visibility into supervisor coverage, drills, telemetry continuity, and handoff readiness without exposing live fleet credentials.</p>
          </div>
          <div class="corr">
            <div class="lbl">Proof Layer</div>
            <p><strong>Offline override analyzer plus dashboard surface.</strong><br />This repo includes a reusable analyzer that reads override exports and turns them into owner, readiness-gap, and operator-posture packets.</p>
          </div>
          <div class="corr">
            <div class="lbl">Why it matters</div>
            <p>Recruiters and buyers looking for <strong>robotics, autonomy, fleet operations, intervention safety, and industrial controls</strong> should see real override work: supervisor coverage, kill-switch drills, telemetry continuity, and operator readiness.</p>
          </div>
        </aside>
      </div>
      ${body}
      <div class="footer">
        <div>human-override-readiness-console · synthetic sample data only</div>
        <div class="footer-links">
          <a class="meta-chip" href="https://github.com/mizcausevic-dev/">GitHub</a>
          <a class="meta-chip" href="https://www.linkedin.com/in/mirzacausevic/">LinkedIn</a>
          <a class="meta-chip" href="https://kineticgain.com/">Kinetic Gain</a>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function severityClass(value: string) {
  if (value === "high" || value === "red") return "red";
  if (value === "medium" || value === "yellow") return "yellow";
  if (value === "green" || value === "low") return "green";
  return "info";
}

export function renderOverview() {
  const metrics = summary();
  return layout(
    "Human Override Readiness Console",
    "/",
    `<section class="section">
        <div class="sh"><h2>Operator Snapshot</h2><div class="note">supervisors · drills · telemetry · training</div></div>
        <div class="kpis">
          <div class="kpi"><div class="v">${metrics.fleets}</div><div class="lbl">snapshots</div><div class="h">Synthetic override readiness snapshots across fleets and routes.</div></div>
          <div class="kpi"><div class="v">${metrics.currentSnapshots}</div><div class="lbl">current</div><div class="h">Snapshots fresh enough to trust for intervention review.</div></div>
          <div class="kpi"><div class="v">${metrics.gaps}</div><div class="lbl">gaps</div><div class="h">Observed readiness deviations across supervisor, drill, telemetry, and training lanes.</div></div>
          <div class="kpi"><div class="v">${metrics.blockingGaps}</div><div class="lbl">blocking</div><div class="h">Gaps actively weakening the expected override path.</div></div>
          <div class="kpi"><div class="v">${metrics.trainingGaps}</div><div class="lbl">training</div><div class="h">Operator certification and refresh gaps still open.</div></div>
          <div class="kpi"><div class="v">${metrics.drillGaps}</div><div class="lbl">drills</div><div class="h">Emergency stop or intervention rehearsal gaps still unresolved.</div></div>
        </div>
      </section>
      <section class="section">
        <div class="sh"><h2>Why operators care</h2><div class="note">readiness proof · buyer signal</div></div>
        <div class="stack">
          <div class="src"><div class="src-name">guardrails first</div><div class="src-tit">Repair the override path before certifying autonomy</div><p>${metrics.recommendation}</p></div>
          <div class="src"><div class="src-name">control evidence</div><div class="src-tit">Turn override snapshots into operator proof</div><p>Every lane stays tied to owner, control family, route or fleet path, and the next concrete remediation move.</p></div>
          <div class="src"><div class="src-name">recruiter signal</div><div class="src-tit">Show real intervention readiness depth</div><p>This is real robotics override and operator-safety proof, not generic automation copy.</p></div>
        </div>
      </section>`
  );
}

export function renderOverrideLane() {
  return layout(
    "Human Override Readiness Console — Override Lane",
    "/override-lane",
    `<section class="section">
        <div class="sh"><h2>Override Lane</h2><div class="note">owner · focus · next action</div></div>
        <table class="ttbl">
          <thead><tr><th>Lane</th><th>Owner</th><th>Status</th><th>Related findings</th><th>Focus</th><th>Next action</th></tr></thead>
          <tbody>
            ${overrideLane().map((lane) => `<tr><td><b>${lane.lane}</b><br />${lane.note}</td><td>${lane.owner}</td><td><span class="st ${severityClass(lane.status)}">${lane.status}</span></td><td>${lane.relatedFindings}</td><td>${lane.focus}</td><td>${lane.nextAction}</td></tr>`).join("")}
          </tbody>
        </table>
      </section>`
  );
}

export function renderReadinessGaps() {
  return layout(
    "Human Override Readiness Console — Readiness Gaps",
    "/readiness-gaps",
    `<section class="section">
        <div class="sh"><h2>Readiness Gaps</h2><div class="note">severity · owner · route</div></div>
        <table class="ttbl">
          <thead><tr><th>Risk</th><th>Owner</th><th>Control family</th><th>Subject</th><th>Message</th></tr></thead>
          <tbody>
            ${readinessGaps().map((finding) => `<tr><td><span class="st ${severityClass(finding.severity)}">${finding.severity}</span><br /><b>${finding.code}</b></td><td>${finding.owner}</td><td>${finding.controlFamily ?? "—"}</td><td>${finding.subjectName ?? finding.subject}</td><td>${finding.message}</td></tr>`).join("")}
          </tbody>
        </table>
      </section>`
  );
}

export function renderOperatorPosture() {
  return layout(
    "Human Override Readiness Console — Operator Posture",
    "/operator-posture",
    `<section class="section">
        <div class="sh"><h2>Operator Posture</h2><div class="note">packet readiness · blocker · window</div></div>
        <div class="board">
          ${operatorPosture().map((packet) => `<article class="pcard">
            <div class="ptop"><div class="pnum">${packet.completenessScore}%</div><div class="ppri">${packet.owner}</div></div>
            <h3>${packet.lane}</h3>
            <p class="pdesc">${packet.decisionNote}</p>
            <ul class="check">
              <li>${packet.blocker}</li>
              <li>${packet.launchWindowHours} hours to the next remediation checkpoint</li>
              <li>Status: <span class="st ${severityClass(packet.status)}">${packet.status}</span></li>
            </ul>
            <div><code>${packet.packetId}</code></div>
          </article>`).join("")}
        </div>
      </section>`
  );
}

export function renderVerification() {
  return layout(
    "Human Override Readiness Console — Verification",
    "/verification",
    `<section class="section">
        <div class="sh"><h2>Verification</h2><div class="note">operator-safe claims only</div></div>
        <div class="stack">
          ${verification().map((item, index) => `<div class="src"><div class="src-name">verification ${index + 1}</div><div class="src-tit">${item}</div><p>This surface is built to stay honest about offline exports, synthetic sample data, and real override-readiness posture.</p></div>`).join("")}
        </div>
      </section>`
  );
}

export function renderDocs() {
  return layout(
    "Human Override Readiness Console — Docs",
    "/docs",
    `<section class="section">
        <div class="sh"><h2>Docs</h2><div class="note">routes · cli · api</div></div>
        <div class="stack">
          <div class="src"><div class="src-name">routes</div><div class="src-tit">Public control surface</div><p><code>/</code>, <code>/override-lane</code>, <code>/readiness-gaps</code>, <code>/operator-posture</code>, <code>/verification</code>, <code>/docs</code></p></div>
          <div class="src"><div class="src-name">api</div><div class="src-tit">Structured payloads</div><p><code>/api/dashboard/summary</code>, <code>/api/override-lane</code>, <code>/api/readiness-gaps</code>, <code>/api/operator-posture</code>, <code>/api/verification</code>, <code>/api/sample</code></p></div>
          <div class="src"><div class="src-name">cli</div><div class="src-tit">Offline override readiness analysis</div><p><code>npx human-override-readiness fixtures/human-override-readiness.json --format summary</code> renders the same posture the dashboard exposes.</p></div>
        </div>
      </section>`
  );
}
