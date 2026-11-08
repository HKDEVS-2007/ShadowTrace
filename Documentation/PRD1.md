# ShadowTrace PRD 1 — Member 1
**Ownership:** Dashboard & Analytics; Investigation Management  
**Stack:** HTML5, CSS3, Vanilla JavaScript, Flask/Python, SQLite

## Mission
Own the overview and case lifecycle. Extend the existing application and preserve its established UI. Do not rebuild the shell.

## Module 1 — Dashboard & Analytics
### Scope
- Show persisted totals for log events, suspicious events/findings, critical findings, and latest analysis status/time.
- Show event classification, severity breakdown, and event activity over time using the existing Chart.js dependency.
- Show latest 10 activity records and navigation/quick actions.
- Refresh data from the API; never present hard-coded demo numbers as live results.
- Provide loading, empty, and recoverable error states.

### Data definitions
- Total Log Events: count of persisted normalized events.
- Suspicious Events: use the existing project definition consistently; document whether it counts flagged events or findings. Do not mix the two.
- Critical Alerts: count findings with severity `critical`.
- Last Analysis: latest persisted analysis run; if none, show `No analysis yet`.

### Acceptance criteria
1. On page load, dashboard values are fetched from Flask.
2. Counts match SQLite for the selected scope (global or active investigation); label the scope.
3. Charts update after import/analysis and on refresh.
4. Empty database displays zero/empty states without JS exceptions.
5. API failure shows a non-blocking error and retry path.
6. Existing visual language and Three Bugs motion/branding are preserved.

## Module 2 — Investigation Management
### Scope
- List investigations with title, optional case reference, status, created/updated timestamps, event/evidence/finding counts where available.
- Create investigation with required title and optional case reference/notes.
- Open/select an investigation and persist the active selection for the current session using the existing app's state approach.
- Update editable metadata and status if supported by the shared schema.
- Show empty, validation, loading, success, and error states.
- Prevent deletion if it would orphan evidence/events/findings unless a deliberate cascade policy is approved and implemented.

### Suggested fields
`id`, `title`, `case_reference`, `notes`, `status` (`open`, `closed`, `archived` only if implemented), `created_at`, `updated_at`.

### API contract proposal
- `GET /api/investigations` → `{ok:true,data:{items:[...]}}`
- `POST /api/investigations` body `{title,case_reference?,notes?}` → `{ok:true,data:{item:{...}}}`
- `GET /api/investigations/<id>` → `{ok:true,data:{item:{...}}}`
- `PATCH /api/investigations/<id>` body with allowed editable fields → same envelope.
These are proposed contracts. Reconcile with existing routes before implementation; document any agreed change in `ARCHITECTURE.md`.

### Acceptance criteria
- Create/list/open work against SQLite, including after server restart.
- Blank title and invalid IDs return clear 4xx errors.
- All queries use parameterized SQL.
- Investigation ownership is checked on related-resource requests.
- Dashboard can display investigation totals and selected-case context consistently.

## Ownership boundaries
Member 1 owns dashboard and investigation UI/service/routes. Shared database schema changes require agreement and review. Do not edit another member's module files without coordination.

## Tests
Test create/list/get/update, blank title, long title, unknown ID, persistence after restart, empty dashboard, chart data, and API unavailable states.
