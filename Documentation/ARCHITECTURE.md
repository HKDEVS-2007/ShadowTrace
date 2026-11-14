# SHADOWTRACE
# COMPLETE SYSTEM ARCHITECTURE & TECHNICAL BLUEPRINT

**Architecture Version:** 2.0  
**Project Type:** Learning-Focused Digital Forensics & Incident Reconstruction  
**Frontend:** HTML5, CSS3, Vanilla JavaScript  
**Backend:** Python + Flask  
**Database:** SQLite  
**API Communication:** HTTP REST-style endpoints  
**Data Format:** JSON  
**File Upload:** Multipart Form Data  
**Integrity Verification:** SHA-256  
**Version Control:** Git + GitHub

---

# 1. PRODUCT DEFINITION

ShadowTrace is a learning-focused digital-forensics and incident-reconstruction workflow.

It allows users to:

1. Create and manage investigations.
2. Import permitted CSV security logs.
3. Validate uploaded evidence.
4. Calculate SHA-256 hashes of original evidence.
5. Normalize log records into structured events.
6. Build chronological event views.
7. Detect documented suspicious patterns.
8. Review explainable findings.
9. Export investigation information and findings.

ShadowTrace is designed to demonstrate practical defensive cybersecurity, security log analysis, evidence handling, and incident reconstruction concepts.

It is NOT:
- An enterprise SIEM.
- A complete forensic investigation suite.
- An automated breach-confirmation platform.
- A replacement for professional forensic tools.

All detection results must remain explainable and traceable to their supporting events.

# 2. CONFIRMED TECHNOLOGY STACK

## 2.1 Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js 4.4.1
- Lucide Icons
- Google Fonts — Inter
- Google Fonts — JetBrains Mono

No frontend framework is required for the current implementation.

Do not introduce React, Vue, Angular, or another framework without explicit team approval.

## 2.2 Backend

- Python
- Flask
- Flask REST-style API routes
- Python CSV processing
- Python hashlib for SHA-256
- Python sqlite3 for database operations

## 2.3 Database

SQLite is the shared database for the entire application.

It stores:
- Investigations.
- Evidence metadata.
- Normalized events.
- Analysis runs.
- Findings.
- Finding-event relationships.
- Other agreed supporting records.

## 2.4 API Communication

Frontend-to-backend communication uses HTTP requests.

- JSON for normal data requests and responses.
- Multipart form-data for file uploads.
- Appropriate HTTP status codes.
- One standardized API response contract.

# 3. EXISTING REPOSITORY CONTEXT

The existing project already contains an application structure and working visual components.

The known backend entry point is:

```text
app.py
```

Existing frontend template references include:

```text
static/
├── css/
│   ├── style.css
│   └── three_bugs.css
│
├── js/
│   ├── app.js
│   └── three_bugs.js
│
├── 3Bugs.mp4
├── logo.jpeg
└── character images/
```

The actual repository must be inspected before modifying any path.

These are known references from the existing project context, not permission to recreate or replace those files.

## 3.1 Existing Backend Capabilities

The repository context identifies existing functionality for:

- CSV processing.
- Detection.
- SQLite storage.
- Dashboard statistics.
- Log retrieval.
- Detection retrieval.
- File uploads.

Known API endpoints:

```text
/api/stats
/api/logs
/api/detections
/api/upload
```

Their exact implementation, request formats, response structures, and database dependencies must be verified from the current source code.

Existing endpoints must not be removed or replaced without an agreed migration plan.

# 4. EXISTING UI/UX AND THREE BUGS ANIMATION SYSTEM

## 4.1 UI/UX Is an Existing Product Requirement

The existing interface is already designed and implemented.

The supplied `index.html` establishes the current application experience.

It must be treated as the source of truth for the existing visual identity.

The following elements must be preserved:

### A. Landing Introduction

- Full-screen landing intro.
- Muted looping `3Bugs.mp4` video.
- Existing logo.
- "The Three Bugs" team title.
- Three character cards:
  - Bit
  - Glitch
  - Cipher
- Enter Console action.
- Skip Intro action.

### B. Animated Background

- `cyberCanvas`.
- Grid background.
- Three glow orbs.
- Scanline effect.
- Existing cyber visual atmosphere.

### C. Sidebar

- Brand video.
- ShadowTrace wordmark.
- Operations navigation.
- System/Settings section.
- Engine status.
- Application version.

### D. Topbar

- Breadcrumb.
- Page title.
- Latest-run label.
- Refresh control.
- Team avatar.

### E. Dashboard

- KPI cards.
- Chart.js visualizations.
- Activity table.
- Quick actions.

### F. Log Analyzer

- File uploader.
- Dropzone.
- Processing pipeline.
- Log table.
- Search.
- Severity filter.
- Pagination.

### G. Threat Detection

- Detection table.
- Severity filters.
- Three detection-rule legend chips.

### H. Settings

- Existing settings page.
- Replay-intro action.

### I. Global Interface Components

- Toast stack.
- Loader overlay.
- Custom cyber cursor.
- Existing transitions and animation behavior.

## 4.2 Three Bugs Animation Preservation — CRITICAL

The Three Bugs animation system is part of ShadowTrace's identity.

It must remain integrated across the application.

The existing integration:

```html
<script src="static/js/app.js"></script>
<script src="static/js/three_bugs.js"></script>
```

The actual script order must be preserved unless the team deliberately refactors it and tests the complete application.

### Mandatory Animation Rules

1. Do not remove `3Bugs.mp4`.
2. Do not remove `three_bugs.js`.
3. Do not remove `three_bugs.css`.
4. Do not remove the existing animated background.
5. Do not replace the existing character assets.
6. Do not disable existing transitions.
7. Do not introduce a different animation language for individual modules.
8. Do not recreate the Three Bugs system separately inside each feature.
9. Do not break the existing landing intro or replay-intro functionality.
10. Do not change animation timing or behavior without approval.

### Animation Consistency Across All Modules

Every new module must use the existing ShadowTrace application shell and visual language.

The same animation identity must remain consistent across:

- Investigation Management.
- Evidence Upload.
- CSV Processing.
- Event Explorer.
- Timeline.
- Threat Detection.
- Findings Management.
- Reports.
- Audit Trail.

This means:
- Preserve the shared animated background and visual effects.
- Preserve existing transitions and interaction behavior.
- Use existing loaders and toast animations.
- Use existing cards, borders, glow effects, and visual treatments.
- Keep motion intensity consistent.
- Reuse existing components wherever possible.

**Important:** The intro video and intro sequence should remain part of the existing landing experience. Do not unnecessarily replay the full intro whenever a user navigates between modules.

New pages must integrate with the existing animated shell rather than creating independent animation systems.

## 4.3 UI/UX Freeze

No member may independently:
- Redesign the dashboard.
- Replace the sidebar.
- Change the color palette.
- Replace typography.
- Remove character identity.
- Change global spacing.
- Rewrite global CSS.
- Remove existing animations.
- Replace the landing intro.
- Change the overall visual identity.

Any necessary global UI or animation change requires team approval.

The existing CSS source is the final authority for exact colors, spacing, glow values, borders, and motion behavior.

Do not guess missing design tokens.

# 5. LAYERED SYSTEM ARCHITECTURE

ShadowTrace follows a three-layer modular architecture:

```text
                  BROWSER / FRONTEND
                          |
                          v
                 FLASK ROUTE LAYER
                          |
                          v
                    SERVICE LAYER
                          |
                          v
              DATABASE HELPER / REPOSITORY
                          |
                          v
                    SQLITE DATABASE
```

Evidence file storage is handled through the backend and remains separate from the public frontend.

## 5.1 Presentation Layer — Browser UI

Technologies:
- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js
- Lucide Icons

Responsibilities:
- Render existing pages.
- Display investigation data.
- Collect user input.
- Upload CSV evidence.
- Call backend APIs.
- Display events and findings.
- Display charts and summaries.
- Show loading, empty, success, and error states.

The frontend must not implement authoritative business rules that belong in the backend.

## 5.2 Route / Controller Layer — Flask

Responsibilities:
- Receive HTTP requests.
- Parse JSON and multipart form-data.
- Validate request structure.
- Verify resource identifiers.
- Enforce parent-child resource ownership.
- Call appropriate services.
- Return standardized responses.
- Apply authentication and authorization if introduced later.

Routes must remain thin.

Do not put large CSV-processing algorithms, detection logic, or report-generation logic directly inside route functions.

## 5.3 Service Layer

Responsibilities:
- CSV validation.
- CSV parsing.
- Event normalization.
- SHA-256 calculation.
- Evidence handling.
- Detection rules.
- Findings management.
- Report preparation.
- Export generation.
- Business validation.

Services should be independently testable.

Where possible, services should use ordinary Python functions and classes rather than depending on Flask request globals.

## 5.4 Database Helper / Repository Layer

Responsibilities:
- Database connection lifecycle.
- Query execution.
- Parameterized SQL.
- Transactions.
- Foreign key enforcement.
- Database initialization.
- Migrations.
- Data retrieval and persistence.

Database logic should not be duplicated across feature modules.

## 5.5 Persistence Layer

SQLite stores persistent application data.

Original evidence files and generated reports are stored in backend-controlled storage locations.

# 6. CANONICAL INVESTIGATION WORKFLOW

The main workflow is:

```text
1. Create or Select Investigation
              |
              v
2. Upload CSV Evidence
              |
              v
3. Validate File and Headers
              |
              v
4. Calculate SHA-256
   Over Original Uploaded Bytes
              |
              v
5. Parse and Normalize CSV Rows
              |
              v
6. Persist Evidence Metadata
   and Normalized Events
              |
              v
7. Browse and Filter Events
              |
              v
8. Run Deterministic Detection Rules
              |
              v
9. Save Analysis Run and Findings
              |
              v
10. Review Finding Details
              |
              v
11. Export CSV and Investigation Data
```

The system should maintain consistent relationships throughout this workflow.

Evidence, events, findings, and reports must remain associated with the correct investigation.

# 7. CANONICAL DATA MODEL

The following tables are proposed logical structures.

Before implementation, inspect the existing SQLite database and reconcile the proposed schema with existing tables.

Do not create duplicate tables or destroy existing data.

## 7.1 investigations

Suggested fields:

```text
id
title
case_reference
notes
status
created_at
updated_at
```

Purpose:
Stores investigation information.

## 7.2 evidence_files

Suggested fields:

```text
id
investigation_id
original_name
stored_name
sha256
size_bytes
imported_at
row_count
valid_count
invalid_count
status
```

Purpose:
Stores uploaded evidence metadata and integrity information.

## 7.3 events

Suggested fields:

```text
id
investigation_id
evidence_id
timestamp_utc
username
source_ip
event_type
outcome
raw_data_json
```

Purpose:
Stores normalized security events.

`raw_data_json` may preserve relevant source-row fields when needed for traceability.

## 7.4 analysis_runs

Suggested fields:

```text
id
investigation_id
rule_set_version
started_at
completed_at
status
total_events
```

Purpose:
Stores detection analysis execution history.

## 7.5 findings

Suggested fields:

```text
id
analysis_run_id
rule_id
severity
summary
explanation
status
analyst_notes
created_at
```

Purpose:
Stores explainable detection findings.

## 7.6 finding_events

Suggested fields:

```text
finding_id
event_id
```

Purpose:
Connects findings to supporting normalized events.

## 7.7 Supporting Tables

The team may add supporting tables such as:
- `processing_runs`
- `finding_notes`
- `reports`
- `audit_logs`

These must be agreed upon and documented before implementation.

## 7.8 Database Constraints and Indexes

Use:
- SQLite foreign keys.
- Primary keys.
- Appropriate unique constraints.
- NOT NULL constraints where appropriate.
- Indexes for investigation IDs.
- Indexes for timestamps.
- Indexes for source IP.
- Indexes for username.
- Indexes for event type.
- Indexes for foreign-key columns.

Use consistent UTC timestamps represented in ISO-8601 format.

Migrations must be deliberate and preserve existing data.

# 8. API RESPONSE CONTRACT

All API endpoints must follow one response structure.

## 8.1 Success Response

```json
{
  "ok": true,
  "data": {
    "item": {}
  }
}
```

## 8.2 Error Response

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A clear message",
    "details": {}
  }
}
```

## 8.3 HTTP Status Codes

- `200` — Successful request.
- `201` — Resource created.
- `400` — Invalid request.
- `404` — Resource not found.
- `409` — Conflict.
- `413` — File too large.
- `415` — Unsupported media type.
- `422` — Semantically invalid data, if used consistently.
- `500` — Internal server error.

Do not leak stack traces, SQL errors, or filesystem paths to the browser.

# 9. CANONICAL API ROUTES

The following are the proposed canonical routes.

Existing routes may be retained as compatibility adapters.

## 9.1 Existing Dashboard Routes

```http
GET /api/stats
GET /api/logs
GET /api/detections
```

Preserve existing behavior unless an agreed change is required.

## 9.2 Investigation Routes

```http
GET /api/investigations
POST /api/investigations
GET /api/investigations/<id>
PATCH /api/investigations/<id>
```

## 9.3 Evidence Routes

```http
POST /api/investigations/<id>/evidence
GET /api/investigations/<id>/evidence
```

## 9.4 Event Routes

```http
GET /api/investigations/<id>/events
```

## 9.5 Detection Routes

```http
POST /api/investigations/<id>/analyze
```

## 9.6 Findings Routes

```http
GET /api/investigations/<id>/findings
GET /api/findings/<finding_id>
PATCH /api/findings/<finding_id>
```

## 9.7 Reporting Routes

```http
GET /api/investigations/<id>/report.csv
```

Additional endpoints for processing summaries, report generation, activity history, and integrity verification may be introduced through team agreement.

### Resource Ownership Rule

Every endpoint that accepts an ID must:
1. Validate that the resource exists.
2. Return 404 for unknown resources.
3. Verify parent-child ownership.
4. Prevent access to records belonging to another investigation.
5. Avoid returning unrelated investigation data.

# 10. FILE HANDLING AND EVIDENCE STORAGE

## 10.1 Supported Format

CSV only for the MVP.

The backend must enforce:
- File type allowlist.
- Maximum file size.
- CSV readability.
- Required file validation.

## 10.2 Maximum File Size

The current frontend specifies a maximum file size of 16 MB.

Keep frontend and backend upload limits aligned.

The backend must enforce the limit independently.

Do not rely only on browser-side validation.

## 10.3 Secure Storage

If files are stored on disk:
- Generate safe internal filenames.
- Never use the original uploaded filename as a filesystem path.
- Keep evidence outside the public frontend directory.
- Never execute uploaded files.
- Do not expose absolute storage paths.
- Do not overwrite existing evidence silently.

## 10.4 SHA-256 Calculation

Calculate SHA-256 from the original uploaded bytes before any transformation.

The original hash must not be calculated from:
- Normalized CSV data.
- Re-serialized CSV.
- Transformed event records.
- A modified copy of the file.

A matching hash confirms that the stored bytes match the recorded hash reference. It does not independently establish the source or authenticity of the evidence.

## 10.5 Sensitive Data

Do not commit:
- Real evidence files.
- Live databases containing personal or organizational data.
- Credentials.
- API keys.
- Private configuration secrets.

Use fictional or explicitly authorized datasets for development and demonstration.

# 11. ERROR AND UI STATE HANDLING

Every asynchronous frontend action must handle the appropriate states.

### Loading State

- Display the existing loader or loading indicator.
- Disable duplicate submission while a request is in flight.
- Prevent repeated upload or analysis actions.

### Success State

- Display the result.
- Update relevant views.
- Use existing toast notifications where appropriate.

### Empty State

Examples:
- No investigations.
- No evidence.
- No events.
- No findings.
- No activity history.

Use existing empty-state patterns.

### Error State

- Display readable errors.
- Preserve entered form values after recoverable errors.
- Allow users to correct invalid input.
- Avoid exposing backend internals.

### Security Requirement

Escape untrusted content.

Do not use unsafe `innerHTML` to render imported log values or other untrusted data.

Use safe DOM text rendering such as `textContent` wherever appropriate.

# 12. FOUR-MEMBER FEATURE DISTRIBUTION

Each member owns exactly two core features.

## MEMBER 1

**Feature 1:** Investigation Management

**Feature 2:** Evidence Upload & Integrity Verification

Ownership:
- Investigation CRUD.
- Investigation metadata.
- Status handling.
- CSV upload.
- File validation.
- SHA-256.
- Evidence metadata.
- Evidence integrity verification.

## MEMBER 2

**Feature 3:** CSV Validation & Event Normalization

**Feature 4:** Event Explorer & Timeline

Ownership:
- CSV structure validation.
- Timestamp normalization.
- Event normalization.
- Invalid row reporting.
- Duplicate handling.
- Event search.
- Filtering.
- Sorting.
- Timeline.
- Evidence traceability.

## MEMBER 3

**Feature 5:** Rule-Based Detection Engine

**Feature 6:** Findings Management

Ownership:
- Detection rule definitions.
- Rule execution.
- Analysis runs.
- Suspicious pattern detection.
- Finding generation.
- Severity classification.
- Supporting event references.
- Finding review.
- Finding notes.

## MEMBER 4

**Feature 7:** Investigation Reports & Export

**Feature 8:** Audit Trail & Activity History

Ownership:
- Report preview.
- Report generation.
- CSV exports.
- Investigation summaries.
- Activity recording.
- Activity history.
- Activity filtering.

Settings, profile management, theme controls, and general utilities are outside the eight core features.

# 13. GIT AND INTEGRATION ARCHITECTURE

Recommended branch structure:

```text
main
  |
  └── develop
        |
        ├── feature/member-1-investigations-evidence
        |
        ├── feature/member-2-csv-events
        |
        ├── feature/member-3-detection-findings
        |
        └── feature/member-4-reports-audit
```

Development process:

1. Pull the latest integration branch.
2. Create or update the assigned feature branch.
3. Inspect existing implementation.
4. Develop assigned features.
5. Test locally.
6. Commit meaningful changes.
7. Push the feature branch.
8. Open a pull request.
9. Review and resolve conflicts.
10. Merge into the agreed integration branch after approval.

All pull requests must include relevant tests.

Avoid parallel uncoordinated modifications to shared files.

# 14. INTEGRATION NOTES

Before implementing a new endpoint or schema:

1. Inspect the current repository.
2. Map existing routes.
3. Map existing tables.
4. Identify existing services.
5. Identify reusable frontend components.
6. Identify existing CSS and animation dependencies.
7. Confirm whether the functionality already exists.
8. Propose the smallest compatible change.
9. Coordinate shared-file modifications.
10. Update the architecture document after team approval.

Existing endpoints may be retained as compatibility adapters while newer canonical routes are introduced.

Do not break existing dashboard functionality during API migration.

# 15. TESTING ARCHITECTURE

Each feature must have relevant tests.

Recommended coverage:

**Member 1**
- Investigation creation and updates.
- Evidence upload.
- File validation.
- SHA-256 calculation.
- Integrity verification.

**Member 2**
- CSV header validation.
- Invalid rows.
- Timestamp normalization.
- Duplicate handling.
- Event retrieval.
- Event filtering.
- Chronological sorting.

**Member 3**
- Detection rule execution.
- Finding generation.
- Supporting event references.
- Analysis history.
- Finding status updates.

**Member 4**
- Report data aggregation.
- CSV export.
- Report download.
- Activity recording.
- Activity filtering.

Integration tests must verify the complete investigation workflow.

# 16. ARCHITECTURE COMPLETION CRITERIA

The architecture is correctly implemented when:

1. All four members use the same repository.
2. The existing Flask application remains the central backend.
3. The existing frontend template remains the application shell.
4. The existing Three Bugs animation system is preserved.
5. All eight features work within the same application.
6. All modules use the same SQLite database.
7. All API responses follow the shared contract.
8. Evidence and events remain traceable.
9. Findings remain linked to supporting events.
10. Reports use saved investigation data.
11. Existing dashboard functionality continues to work.
12. Existing animations and transitions remain intact.
13. No unapproved global UI redesign occurs.
14. All integration tests pass.

# 17. FINAL ARCHITECTURE PRINCIPLES

**One application.**

**One shared codebase.**

**One Flask backend.**

**One SQLite database.**

**One existing UI/UX system.**

**One consistent Three Bugs animation identity.**

**Four independent feature owners.**

**Eight integrated core features.**

**Original evidence preserved and traceable.**

**All findings explainable and linked to supporting events.**

The final ShadowTrace product must feel like the original application expanded with new capabilities, not a collection of independently designed modules.