# ShadowTrace — AI Project Memory

## Project identity
- Name: ShadowTrace.
- Team identity/branding in current UI: The Three Bugs.
- Product type: learning-focused Digital Forensics & Incident Reconstruction / security log analysis application.
- Purpose: import permitted CSV logs, normalize and chronologically explore events, detect explainable suspicious patterns, review findings, and export reports.
- It is not an enterprise SIEM or a complete forensic suite.
- BreachPath is out of scope. Do not mention or reintroduce it in project implementation.

## Team
Exactly 3 members. Six modules total, two per member:
- Member 1: Dashboard & Analytics; Investigation Management.
- Member 2: Evidence Management & CSV Import; Log Analyzer & Event Explorer.
- Member 3: Threat Detection Engine; Findings & Reports.

## Technology constraints
- Frontend: HTML5 + CSS3 + Vanilla JavaScript.
- Backend/API: Python + Flask.
- Database: SQLite.
- Existing project dependencies include Chart.js, Lucide, Inter and JetBrains Mono as visible in current template.
- Do not add a frontend framework or replace the backend/database without explicit team agreement.

## Existing UI baseline
The supplied `index.html` is the source of truth for current structure:
- Intro overlay with looping `3Bugs.mp4`, logo, The Three Bugs title, Bit/Glitch/Cipher cards, Enter Console and Skip Intro.
- Animated cyber background: canvas, grid, ambient orbs, scanline.
- Sidebar with ShadowTrace/Three Bugs branding, Dashboard, Log Analyzer, Threat Detection, Settings, engine status.
- Topbar with breadcrumb, page title, last run, refresh and logo/avatar.
- Dashboard: four KPIs, three Chart.js chart areas, recent activity, quick actions.
- Log Analyzer: CSV dropzone, template/sample buttons, pipeline, event table, search/severity filters, pagination.
- Threat Detection: findings table, severity filters, three rule chips.
- Settings: replay intro action.
- Toast, loader overlay and custom cursor.
- CSS/JS assets referenced: `static/css/style.css`, `static/css/three_bugs.css`, `static/js/app.js`, `static/js/three_bugs.js`.
Preserve all current visual design and animations. New modules extend the existing shell; do not redesign from scratch. Exact tokens must be read from actual CSS.

## Existing backend context to verify
Repository README/context references `app.py`, CSV processor, detector, SQLite and APIs such as `/api/stats`, `/api/logs`, `/api/detections`, `/api/upload`. Always inspect the current branch before changing files; do not assume README exactly matches code.

## Core workflow
Create investigation → import CSV → validate → SHA-256 evidence metadata → normalize events → persist → browse timeline → run rules → review linked findings → export CSV.

## Canonical event fields
`id`, `investigation_id`, `evidence_id`, `timestamp_utc`, `username`, `source_ip`, `event_type`, `outcome`, `raw_data_json`.
Use UTC ISO-8601 internally and display timezone clearly.

## Proposed entities
- investigations
- evidence_files
- events
- analysis_runs
- findings
- finding_events

Coordinate all schema changes and migrations. Use parameterized SQL and SQLite foreign keys.

## Initial detection example
At least 3 failed logins for same user and source IP within 5 minutes, followed by a successful login. Explain threshold and linked events. Label as suspicious pattern requiring review, not confirmed compromise.

## API convention
Preferred JSON success: `{"ok":true,"data":{...}}`
Preferred JSON error: `{"ok":false,"error":{"code":"...","message":"..."}}`
Proposed routes are documented in ARCHITECTURE.md. Preserve existing routes as adapters where possible.

## Collaboration rules
- Read assigned PRD + ARCHITECTURE.md + RULES.md + DESIGN.md before coding.
- Keep `main` stable; use focused feature branches and PRs.
- Do not overwrite shared files or change API/schema contracts without coordination.
- Include tests, screenshots for UI changes, and test results in PRs.
- Never commit secrets, real logs, personal data or live DB.
- Validate uploads server-side; escape untrusted log content; protect CSV exports from formula injection.

## AI assistant behavior
When asked to implement a feature:
1. Inspect the current repository files before proposing edits.
2. Identify existing functions/routes/classes to reuse.
3. State which member owns the affected module.
4. Respect this documentation and existing visual style.
5. Make the smallest compatible change.
6. Include exact run/test commands and explain changed files.
7. Do not claim tests passed unless actually run.
