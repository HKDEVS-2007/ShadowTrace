# ShadowTrace PRD 3 — Member 3
**Ownership:** Threat Detection Engine; Findings & Reports  
**Stack:** HTML5, CSS3, Vanilla JavaScript, Flask/Python, SQLite

## Mission
Own deterministic, explainable rule-based analysis and the review/export of its findings. Alerts are investigative leads, not proof of compromise.

## Module 5 — Threat Detection Engine
### Scope
- Run documented deterministic Python rules against normalized events in a selected investigation.
- Keep rule logic in testable service functions, not Flask route handlers.
- Record analysis run time and rule-set version.
- Link each finding to the exact event IDs that triggered it.
- Store rule ID/name, severity, summary, explanation, threshold, status, and timestamps.
- Make thresholds visible and configurable only if the UI and validation support it.
- Avoid claiming that an alert confirms an attack.

### Initial rule set
1. **Repeated Failed Logins:** same username + source IP has at least 3 failed login events within 5 minutes, followed by a successful login.
2. **Suspicious Access Pattern:** only implement if the source event schema contains a reliable, documented event/outcome signal; define the exact condition and severity before coding.
3. **Unusual Login Activity:** only implement if the team defines a deterministic baseline or explicit rule. Do not label arbitrary events unusual without a defensible condition.

For the first release, fully tested rules are better than three partially working rules. The threshold and event sequence must be shown in finding details.

### API proposal
- `POST /api/investigations/<id>/analyze` → `{ok:true,data:{analysis_run:{...},summary:{...},findings:[...]}}`
- Existing `/api/analyze` or upload-triggered analysis may be retained; document how it maps to the canonical workflow.
- `GET /api/investigations/<id>/analysis-runs`
- `GET /api/investigations/<id>/findings`

## Module 6 — Findings & Reports
### Scope
- List findings with ID, timestamp, rule, severity, source IP/user when available, status, and evidence count.
- Filter/search by severity, rule, status, IP, and text.
- Open finding details showing explanation, threshold, linked event IDs and event records.
- Allow analyst review status (`new`, `reviewing`, `closed` or an agreed smaller set) and notes if included in shared schema.
- Export findings/events as CSV with export timestamp and investigation context.
- CSV export must safely quote fields and guard spreadsheet formula injection for values beginning with `=`, `+`, `-`, or `@`.
- PDF export is explicitly out of MVP unless the team agrees after CSV is complete.

### Data model proposal
`analysis_runs`: `id`, `investigation_id`, `rule_set_version`, `started_at`, `completed_at`, `status`, `total_events`.
`findings`: `id`, `analysis_run_id`, `rule_id`, `severity`, `summary`, `explanation`, `status`, `created_at`, `analyst_notes`.
`finding_events`: `finding_id`, `event_id` (composite primary key).

### API proposal
- `GET /api/investigations/<id>/findings`
- `GET /api/findings/<finding_id>` (must verify investigation relationship)
- `PATCH /api/findings/<finding_id>` for review status/notes
- `GET /api/investigations/<id>/report.csv?type=findings|events|combined`

## Acceptance criteria
1. Detection is deterministic for a fixed dataset and rule-set version.
2. Every finding has a human-readable explanation and exact supporting event IDs.
3. Re-running analysis behavior is documented (new run history vs replace latest); no accidental duplicate findings.
4. Findings persist and remain linked to the correct investigation.
5. False-positive/limitations note is visible.
6. Filters, detail view, status updates and CSV export work.
7. Exported CSV opens correctly and treats untrusted values safely.

## Ownership boundaries
Member 3 owns rules, analysis, findings, review and report export. Member 2 owns parsing/normalization; Member 3 consumes the agreed canonical event model and must not create a competing parser.

## Tests
Threshold boundary (2 vs 3 failures), within/outside five-minute window, wrong user/IP, success absent/present, duplicate timestamps, empty dataset, repeated analysis, event linkage, unknown finding ID, status validation, CSV escaping and formula-injection mitigation.
