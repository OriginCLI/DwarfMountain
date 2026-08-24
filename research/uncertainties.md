# Known Uncertainties and Conflicts

| Item | Status | Evidence | Required resolution |
| --- | --- | --- | --- |
| Current semantic version | Unknown | Public news reaches v1.4.0; installed build ID is 24333424, updated August 21. | Read an official release label or keep the build ID. |
| Complete current Prestige graph | Resolved for build 24333424 | 102 native constructors plus live screen comparison. | Re-extract when the installed build changes. |
| Node costs, prerequisites, rank caps | Resolved for build 24333424 | YYC constructor fields, native registration table, tier thresholds, save deltas, and current screen. | Snapshot tests prevent structural drift; re-extract on update. |
| Tier 1–5 screen coordinates | Verified | All 82 visible nodes identified by read-only live tooltip hovering on August 24; tracked order record drives snapshot generation. | Recheck after an installed-build update. |
| Tier 6 screen coordinates | Unresolved | Tier 6 is locked in the observed save; tooltip hovering cannot identify its nodes. Constructor order is retained only as an explicitly unverified placeholder. | Observe Tier 6 after the user unlocks it, then replace the 20 placeholder positions. |
| Key Master | Conflict resolved in favor of local build | Local: 4 ranks, 40/80/120/160%; wiki: 3 ranks, 25/50/75%. | Keep both in provenance history; use local values. |
| Mountain HP formula | Inferred | Community mechanics reference. | Extract/test against local runtime values. |
| Mithril formula | Inferred | Community mechanics reference. | Extract/test against local runtime values. |
| Prestige optimizer scoring | Not yet a formula | User supplied strategic expectations only. | Implement later as labeled transparent heuristic, then calibrate from run history. |
| Conditional effect evaluators | Not encoded | Exact installed description text contains values and conditional formulas, but not every effect is represented as executable data. | Add only evidence-backed evaluators in later mechanic/optimizer phases. |
| Prestige-screen visual fidelity | Verified for Tiers 1–5; intentionally original assets | Official screenshot plus current installed screen establish composition; Tier 6 order is pending. | Verify Tier 6 after unlock. Keep generated placeholders unless independently licensed art is provided. |

## Guardrail

Any unresolved field is nullable in the data schema. The UI must say what is missing and name the evidence gap; it must not substitute a plausible value.
