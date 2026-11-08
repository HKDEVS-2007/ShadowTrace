# ShadowTrace Architecture

## 1. Product definition
ShadowTrace is a learning-focused digital-forensics and incident-reconstruction workflow. It imports permitted CSV logs, validates and normalizes records, builds a chronological event view, detects documented suspicious patterns, and exports explainable findings. It is not an enterprise SIEM or a full forensic suite.

## 2. Confirmed technology
- Frontend: HTML5, CSS3, Vanilla JavaScript.
- Backend: Python + Flask.
- Database: SQLite.
- API transport: HTTP REST-style endpoints; JSON for data responses; multipart form-data for file upload.
- Existing UI dependencies visible in the current template: Chart.js 4.4.1, Lucide icons, Google Fonts Inter and JetBrains Mono.
- Existing Flask template references: `static/css/style.css`, `static/css/three_bugs.css`, `static/js/app.js`, `static/js/three_bugs.js`, `static/3Bugs.mp4`, `static/logo.jpeg`, and character images.
- Existing backend capabilities described by repository README/context: `app.py`, CSV processing, detection, SQLite, `/api/stats`, `/api/logs`, `/api/detections`, `/api/upload`. Verify exact current implementations before modifying.

## 3. Existing interface and motion are product requirements
The supplied `index.html` establishes:
- Full-screen landing intro with looping muted `3Bugs.mp4`, logo, “The Three Bugs” team title, three character cards (Bit, Glitch, Cipher), Enter Console and Skip Intro.
- Animated background layers: `cyberCanvas`, grid, three glow orbs, scanline.
- Sidebar brand video, ShadowTrace wordmark, Operations navigation, System/Settings, engine status and version.
- Topbar breadcrumb, page title, latest-run label, refresh control and team avatar.
- Dashboard KPI cards, Chart.js canvases, activity table and quick actions.
- Log Analyzer uploader/dropzone, processing pipeline, log table, search, severity filter and pagination.
- Threat Detection table, severity filters and three rule legend chips.
- Settings page with replay-intro action.
- Toast stack, loader overlay and custom cyber cursor.
- `three_bugs.js` is loaded after `app.js`; preserve this integration unless deliberately refactored and tested.

Do not remove, rename, or restyle these elements without team approval. All new screens must use the same shell, spacing logic, typography, color tokens, borders, glow, cards, controls, and motion intensity as the existing design. The actual CSS source is the final authority for exact color/spacing values; do not guess missing token values.

## 4. Layered architecture
Browser UI → Flask route/controller → service layer → database helper/repository → SQLite.
- UI: render views, collect input, call API, show state.
- Routes: HTTP parsing, authentication/authorization if added, validation boundary, response envelope.
- Services: CSV parsing, normalization, detection, reporting and business rules; pure/testable where possible.
- Database: connection lifecycle, schema initialization, parameterized queries, transactions and foreign keys.
- SQLite: persistent investigations, evidence, events, analysis runs, findings and finding-event links.

Routes must not contain large business algorithms or raw SQL. Services must not depend on Flask request globals.

## 5. Canonical workflow
1. Create/select investigation.
2. Upload CSV evidence.
3. Validate file and headers.
4. Calculate SHA-256 over original uploaded bytes and store metadata.
5. Parse/normalize rows into canonical event records.
6. Persist evidence and events transactionally.
7. Browse/filter chronological events.
8. Run deterministic rules.
9. Persist analysis run, findings and event links.
10. Review finding details and export CSV.

## 6. Canonical data model
Suggested tables (reconcile with existing DB before migration):
- `investigations(id, title, case_reference, notes, status, created_at, updated_at)`
- `evidence_files(id, investigation_id, original_name, stored_name, sha256, size_bytes, imported_at, row_count, valid_count, invalid_count, status)`
- `events(id, investigation_id, evidence_id, timestamp_utc, username, source_ip, event_type, outcome, raw_data_json)`
- `analysis_runs(id, investigation_id, rule_set_version, started_at, completed_at, status, total_events)`
- `findings(id, analysis_run_id, rule_id, severity, summary, explanation, status, analyst_notes, created_at)`
- `finding_events(finding_id, event_id)`.

Use SQLite foreign keys. Add indexes for investigation IDs, timestamps, source IP, username, event type, and foreign-key columns as appropriate. Store UTC timestamps in a consistent ISO-8601 representation. Migrations must be deliberate and preserve existing data.

## 7. API response contract
Success:
```json
{"ok": true, "data": {"item": {}}}
```
Error:
```json
{"ok": false, "error": {"code": "VALIDATION_ERROR", "message": "A clear message", "details": {}}}
```
Use appropriate HTTP status codes. Do not leak stack traces or filesystem paths to the browser.

Proposed canonical routes (existing endpoints may be retained as compatibility adapters):
- `GET /api/stats`
- `GET /api/investigations`
- `POST /api/investigations`
- `GET /api/investigations/<id>`
- `PATCH /api/investigations/<id>`
- `POST /api/investigations/<id>/evidence`
- `GET /api/investigations/<id>/evidence`
- `GET /api/investigations/<id>/events`
- `POST /api/investigations/<id>/analyze`
- `GET /api/investigations/<id>/findings`
- `GET /api/findings/<finding_id>`
- `PATCH /api/findings/<finding_id>`
- `GET /api/investigations/<id>/report.csv`

Every endpoint that accepts an ID must return 404 for unknown resources and verify parent-child ownership.

## 8. File handling
- CSV only for MVP; backend allowlist and size limit are mandatory.
- The current HTML says maximum 16 MB; keep frontend and backend limits aligned.
- Use generated safe filenames if files are stored; never join a user-provided filename into a path.
- Hash original bytes with SHA-256 before any transformation.
- Do not commit real evidence or live databases containing personal/organizational data.

## 9. Error and state handling
Every async UI action needs loading, success, empty, and error behavior as applicable. Disable duplicate submission while requests are in flight. Preserve entered form values after recoverable errors. Escape untrusted content; do not use unsafe `innerHTML` for imported log values.

## 10. Integration notes
Before implementing new endpoints or schema, inspect the current repository and map existing routes/tables. Update this document when the team agrees on changes. Avoid parallel edits to the same shared files. All PRs must target the agreed integration branch and include tests.
