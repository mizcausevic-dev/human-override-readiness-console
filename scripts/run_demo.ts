import { overrideLane, readinessGaps, summary } from "../src/services/humanOverrideReadinessConsoleService.js";

console.log("human-override-readiness-console demo");
console.log(summary());
console.log(overrideLane().map((lane) => ({ lane: lane.lane, owner: lane.owner, status: lane.status })));
console.log(readinessGaps().slice(0, 3));
