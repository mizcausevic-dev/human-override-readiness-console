# Origin

We already had robotics surfaces for fleet exceptions and sensor drift, but the intervention layer was still missing.

The right split was:

- fleet exceptions in a broader control plane
- sensor drift in a narrow telemetry surface
- human override readiness in a dedicated operator console

That makes this repo a real systems complement instead of another generic robotics dashboard.
