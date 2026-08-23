# Known Uncertainties and Conflicts

| Item | Status | Evidence | Required resolution |
| --- | --- | --- | --- |
| Current semantic version | Unknown | Public news reaches v1.4.0; installed build ID is 24333424, updated August 21. | Read an official release label or keep the build ID. |
| Complete current Prestige graph | Resolved for build 24333424 | 102 native constructors plus live screen comparison. | Re-extract when the installed build changes. |
| Node costs, coordinate layout, prerequisites, rank caps | Resolved for build 24333424 | YYC constructor fields, native registration table, tier thresholds, save deltas, and current screen. | Snapshot tests prevent structural drift; re-extract on update. |
| Node-by-node screen coordinate recheck | High-confidence derived | Coordinates follow native constructor order within each tier; all row shapes were compared with the live screen. | Hover all 102 live nodes only if a future patch suggests the native ordering rule changed. |
| Key Master | Conflict resolved in favor of local build | Local: 4 ranks, 40/80/120/160%; wiki: 3 ranks, 25/50/75%. | Keep both in provenance history; use local values. |
| Mountain HP formula | Inferred | Community mechanics reference. | Extract/test against local runtime values. |
| Mithril formula | Inferred | Community mechanics reference. | Extract/test against local runtime values. |
| Prestige optimizer scoring | Not yet a formula | User supplied strategic expectations only. | Implement later as labeled transparent heuristic, then calibrate from run history. |
| Conditional effect evaluators | Not encoded | Exact installed description text contains values and conditional formulas, but not every effect is represented as executable data. | Add only evidence-backed evaluators in later mechanic/optimizer phases. |
| Prestige-screen visual fidelity | Verified structure, intentionally original assets | Official screenshot plus current installed screen establish composition and exact layout. | Keep generated placeholders unless independently licensed art is provided. |

## Guardrail

Any unresolved field is nullable in the data schema. The UI must say what is missing and name the evidence gap; it must not substitute a plausible value.
