# Security Policy

`human-override-readiness-console` ships both an offline analyzer and a synthetic public dashboard surface. It reads JSON exports from override-readiness snapshots (or synthetic data) and emits structured findings, route JSON, and prerendered HTML. No live fleet credential storage, no remote fetch of production telemetry, and no execution of user-supplied code is included.

## Reporting

- Open a security advisory:
  [https://github.com/mizcausevic-dev/human-override-readiness-console/security/advisories/new](https://github.com/mizcausevic-dev/human-override-readiness-console/security/advisories/new)

## Scope notes

- sample data is synthetic and explicitly marked
- there is no live bridge into a production robot fleet
- there is no write path into control systems
- this repo is recruiter-facing proof of operator posture, not an autonomy product
