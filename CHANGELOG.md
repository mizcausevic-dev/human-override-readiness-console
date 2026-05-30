# Changelog

## v0.1-shipped

- Initial release: operator surface for robotics human-override readiness, supervisor coverage, intervention drills, telemetry blind zones, handoff-safe remediation, and operator training posture.
- Added public dashboard routes:
  - `/`
  - `/override-lane`
  - `/readiness-gaps`
  - `/operator-posture`
  - `/verification`
  - `/docs`
- Added synthetic override snapshots and readiness-gap packets covering supervisor drift, stale drills, takeover latency, telemetry blind zones, stale operator training, and handoff playbook gaps.
- Added `docs/KINETIC_GAIN_EMBEDDED.md`, `robots.txt`, `sitemap.xml`, and README proof screenshots.
- Added CLI: `human-override-readiness <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-gap-after-hours N`, `--fail-on-high`, and `--out FILE`.
