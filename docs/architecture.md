# Architecture

`human-override-readiness-console` is a TypeScript + Express operator surface for turning raw override-readiness exports into durable supervisor, drill, telemetry, and handoff posture.

Core layers:

- `overview`
  - aggregate override posture
  - blocking gaps
  - intervention recommendation
- `override-lane`
  - owner-level override lanes
  - focus and next action
  - related finding counts
- `readiness-gaps`
  - severity-ranked readiness findings
  - route, supervisor, drill, and telemetry context
- `operator-posture`
  - packet readiness
  - blocker and launch-window posture
- `verification`
  - operator-safe claims
  - synthetic-data guardrails

The repo complements the broader robotics surfaces:

- `robots.kineticgain.com` shows fleet exception posture
- `sensor.kineticgain.com` shows narrow sensor drift pressure
- `override.kineticgain.com` shows whether a real human can step in safely when autonomy needs help
