# ShadowTrace Development Tasks

## Team ownership
- Member 1: Dashboard & Analytics; Investigation Management.
- Member 2: Evidence Management & CSV Import; Log Analyzer & Event Explorer.
- Member 3: Threat Detection Engine; Findings & Reports.

## Phase 0 — Shared foundation (all members)
- [ ] Clone repository and run existing app on each member's machine.
- [ ] Inspect current folders, routes, database schema and CSS/JS dependencies.
- [ ] Record current working behavior and known bugs before changing code.
- [ ] Agree canonical event fields, investigation scope, response envelope and route names.
- [ ] Agree SQLite migration strategy and upload-size limit.
- [ ] Add fictional sample CSV and expected findings to tests/data (no real logs).
- [ ] Create feature branches and issue owners.

## Member 1 tasks
### Dashboard & Analytics
- [ ] Map existing `/api/stats` response and frontend consumers.
- [ ] Confirm definitions for total events, suspicious count, critical count and latest run.
- [ ] Ensure dashboard values come from persisted data.
- [ ] Integrate/update Chart.js datasets and empty/error states.
- [ ] Verify refresh and post-analysis update.
### Investigation Management
- [ ] Agree investigation schema with team.
- [ ] Implement create/list/detail/update service and routes.
- [ ] Build investigation list and create form using existing design.
- [ ] Add active investigation selection and selected-case context.
- [ ] Add validation, loading, empty and error states.
- [ ] Add service/API tests and UI screenshot.

## Member 2 tasks
### Evidence Management & CSV Import
- [ ] Agree canonical CSV header aliases and required columns.
- [ ] Enforce `.csv` and backend file-size limit.
- [ ] Implement safe upload handling and SHA-256 calculation.
- [ ] Validate rows and return import summary with row-level errors.
- [ ] Persist evidence metadata and normalized events transactionally.
- [ ] Add evidence list/detail UI.
- [ ] Test malformed, empty, oversized and valid files.
### Log Analyzer & Event Explorer
- [ ] Confirm canonical event schema and timestamp policy.
- [ ] Implement event list/filter/search/pagination query.
- [ ] Preserve existing log table, severity filter and pager.
- [ ] Add username/IP/event type/time filters as agreed.
- [ ] Ensure untrusted fields render safely.
- [ ] Test sorting, filters, pagination and same-timestamp ordering.

## Member 3 tasks
### Threat Detection Engine
- [ ] Agree exact rule definitions, severities and thresholds.
- [ ] Implement pure Python detection service(s).
- [ ] Link each finding to exact event IDs.
- [ ] Persist analysis run, rule-set version and findings.
- [ ] Define repeated-analysis behavior.
- [ ] Add deterministic boundary and false-positive tests.
### Findings & Reports
- [ ] Implement findings list/detail/filter API.
- [ ] Implement analyst status/notes if approved in schema.
- [ ] Build findings UI consistent with existing Threat Detection view.
- [ ] Implement CSV export for findings/events.
- [ ] Protect export against CSV formula injection.
- [ ] Add tests and screenshots.

## Integration tasks (shared)
- [ ] Keep existing landing intro and Three Bugs animations working.
- [ ] Confirm `app.js` and `three_bugs.js` load without console errors.
- [ ] Verify all navigation items and view IDs.
- [ ] Verify all API routes and JSON response contracts.
- [ ] Verify SQLite foreign keys and persistence after restart.
- [ ] Test empty DB, malformed CSV, unknown IDs and API failure.
- [ ] Test on each member's machine from a clean clone.
- [ ] Update README with exact install/run commands.
- [ ] Rehearse a 5–7 minute demo using fictional sample data.
- [ ] Freeze features before final presentation; prioritize bug fixes after freeze.

## Suggested integration sequence
1. Shared schema/API agreement.
2. Investigation CRUD and event/evidence data contracts.
3. CSV import and normalized event persistence.
4. Event explorer.
5. Detection run and finding persistence.
6. Findings/report export.
7. Dashboard aggregation and charts.
8. Full UI/animation regression and demo rehearsal.

## Definition of done
A task is done only when it is implemented, integrated, tested, documented, and merged through a reviewed PR. A screenshot alone or an unconnected UI is not completion.
