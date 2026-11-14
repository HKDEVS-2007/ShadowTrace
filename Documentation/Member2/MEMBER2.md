# SHADOWTRACE
## MEMBER 2 — PRODUCT REQUIREMENTS DOCUMENT (PRD) + DEVELOPMENT TASKS

**Assigned Modules:**
1. CSV Validation & Event Normalization
2. Event Explorer & Timeline

**Project:** ShadowTrace  
**Role:** Feature Developer — Member 2  
**Frontend:** HTML5, CSS3, Vanilla JavaScript  
**Backend:** Python Flask REST API  
**Database:** SQLite

---

# PART 1 — PROJECT RESPONSIBILITY

## 1.1 Role and Ownership

Member 2 is responsible for converting uploaded CSV security log evidence into structured, normalized event records and providing users with tools to explore those events chronologically.

Assigned modules:

- CSV Validation & Event Normalization
- Event Explorer & Timeline

These modules depend on Member 1's Investigation Management and Evidence Upload functionality.

Member 2 must use the shared evidence records and preserve the original uploaded files.

Member 2 must NOT:
- Modify the existing dashboard design.
- Redesign the UI/UX.
- Change global CSS or animations.
- Replace existing frontend components.
- Create a separate Flask application.
- Create a separate SQLite database.
- Modify Member 1's evidence upload functionality without coordination.
- Implement detection rules or findings management.

# PART 2 — PRODUCT REQUIREMENTS DOCUMENT

## 2. CSV Validation & Event Normalization

### 2.1 Purpose

This module processes uploaded CSV security logs and converts their contents into standardized event records.

Different log files may contain inconsistent column names, formatting, timestamps, and values.

The system must validate the CSV structure and normalize supported data into a consistent format that can be used by the Event Explorer and Detection Engine.

The original evidence must remain unchanged.

### 2.2 Initial Supported CSV Format

The initial documented CSV format requires these columns:

| Required Column | Description |
|---|---|
| timestamp | Date and time of the event |
| username | User associated with the event |
| source_ip | Source IP address |
| event_type | Type of security event |
| status | Event outcome or status |

Example:

```csv
timestamp,username,source_ip,event_type,status
2026-10-12 10:30:00,admin,192.168.1.10,login,failed
2026-10-12 10:31:00,admin,192.168.1.10,login,failed
2026-10-12 10:35:00,admin,192.168.1.10,login,success
```

The initial release should use a clearly documented schema.

Do not claim universal compatibility with every vendor's log format.

### 2.3 Functional Requirements

**FR-01: Process Uploaded Evidence**

Users must be able to initiate processing for an uploaded evidence file.

The system must:
1. Confirm that the evidence exists.
2. Confirm its associated investigation.
3. Read the original CSV.
4. Validate its structure.
5. Normalize supported records.
6. Store valid events in SQLite.
7. Record processing results.
8. Return a processing summary.

**FR-02: CSV Structure Validation**

Validate:
- Required columns.
- Column names.
- Column formatting.
- Readability.
- Row structure.
- Empty or malformed records.

Column names should be normalized for case and surrounding whitespace.

For example:
- `Timestamp`
- ` timestamp `
- `TIMESTAMP`

Should be recognized as the same column name.

Missing required columns must produce a clear validation error.

**FR-03: Timestamp Normalization**

Normalize supported timestamps into a consistent database representation.

Requirements:
- Parse supported timestamp formats.
- Handle invalid timestamps.
- Document timezone assumptions.
- Avoid silently changing timezone meaning.
- Use a consistent timestamp representation for sorting.

If a timestamp is invalid, the system must record the affected row and reason rather than crashing the entire application.

**FR-04: Event Normalization**

Every normalized event should contain:

- Event ID
- Investigation ID
- Evidence ID
- Source row number
- Timestamp
- Username
- Source IP
- Event type
- Status
- Normalized timestamp

Additional fields may be introduced only after agreement with the team.

**FR-05: Invalid Row Handling**

The system must identify invalid rows.

For each invalid row, record:
- Source row number.
- Validation reason.
- Processing result.

A malformed row must not silently become a valid event.

The system should process valid rows where possible while reporting invalid ones.

**FR-06: Duplicate Handling**

Duplicate handling must be transparent.

The system may identify duplicate records based on an agreed comparison strategy.

It must:
- Report duplicate counts.
- Avoid silently creating unintended duplicate events.
- Preserve the original evidence.
- Document the duplicate policy.

**FR-07: Processing Summary**

Every processing operation should produce a summary.

Required information:
- Total rows.
- Valid rows.
- Invalid rows.
- Duplicate rows.
- Processing status.
- Processing timestamp.

### 2.4 Processing Statuses

Recommended statuses:

| Status | Meaning |
|---|---|
| Pending | Processing has not started |
| Processing | Processing is in progress |
| Completed | Processing finished |
| Completed with Errors | Some records were rejected |
| Failed | Processing could not complete |

### 2.5 Processing Data Model

Proposed `events` fields:

- `id`
- `investigation_id`
- `evidence_id`
- `source_row_number`
- `timestamp`
- `username`
- `source_ip`
- `event_type`
- `status`
- `normalized_at`

Recommended additional table: `processing_runs`

Suggested fields:
- `id`
- `investigation_id`
- `evidence_id`
- `total_rows`
- `valid_rows`
- `invalid_rows`
- `duplicate_rows`
- `processing_status`
- `started_at`
- `completed_at`
- `error_summary`

The final schema must be jointly approved.

---

## 3. Event Explorer & Timeline

### 3.1 Purpose

The Event Explorer allows investigators to browse, search, filter, and inspect normalized security events.

The Timeline provides a chronological representation of events within an investigation.

These features help investigators understand event sequences and provide traceable data for the Detection Engine.

### 3.2 Functional Requirements

**FR-08: Event Listing**

Display normalized events belonging to the selected investigation.

Each event should show:
- Event ID
- Timestamp
- Username
- Source IP
- Event type
- Status
- Associated evidence

**FR-09: Chronological Sorting**

Users must be able to sort events:
- Oldest first.
- Newest first.

Chronological sorting must use normalized timestamps.

**FR-10: Search and Filtering**

Support filtering by:
- Username.
- Source IP.
- Event type.
- Status.
- Date range.
- Evidence file.

Users should be able to combine filters where practical.

**FR-11: Event Details**

Users must be able to inspect an individual event.

Display:
- Event ID.
- Investigation ID.
- Evidence ID.
- Source row number.
- Timestamp.
- Username.
- Source IP.
- Event type.
- Status.

**FR-12: Timeline View**

Provide a chronological timeline of normalized events.

The timeline should:
- Display event timestamps.
- Show event types.
- Show usernames and source IPs where available.
- Distinguish event outcomes.
- Allow users to inspect event details.
- Respect the selected investigation and active filters.

**FR-13: Evidence Traceability**

Every normalized event must retain a reference to:
- Its investigation.
- Its original evidence file.
- Its source row number.

This allows investigators to trace a normalized event back to the original uploaded CSV.

**FR-14: Empty and Error States**

The interface must handle:
- No evidence uploaded.
- Evidence not processed.
- No valid events.
- No search results.
- Invalid filters.
- API errors.

# PART 3 — API REQUIREMENTS

Member 2 owns the following endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/evidence/<id>/process` | Process uploaded evidence |
| GET | `/api/investigations/<id>/events` | List normalized events |
| GET | `/api/events/<id>` | Get event details |
| GET | `/api/evidence/<id>/processing-summary` | Get processing summary |

The existing shared API response format must be used.

### 4.1 Example Processing Request

```http
POST /api/evidence/1/process
```

### 4.2 Example Processing Response

```json
{
  "ok": true,
  "data": {
    "evidence_id": 1,
    "total_rows": 100,
    "valid_rows": 94,
    "invalid_rows": 4,
    "duplicate_rows": 2,
    "processing_status": "Completed with Errors"
  }
}
```

### 4.3 Example Event Response

```json
{
  "ok": true,
  "data": {
    "id": 10,
    "investigation_id": 1,
    "evidence_id": 1,
    "source_row_number": 12,
    "timestamp": "2026-10-12T10:30:00",
    "username": "admin",
    "source_ip": "192.168.1.10",
    "event_type": "login",
    "status": "failed"
  }
}
```

### 4.4 Event Filtering

The event listing endpoint should support query parameters such as:

- `username`
- `source_ip`
- `event_type`
- `status`
- `start_date`
- `end_date`
- `evidence_id`
- `sort`

Example:

```http
GET /api/investigations/1/events?username=admin&sort=oldest
```

Use parameterized SQL queries.

# PART 4 — FRONTEND REQUIREMENTS

## 5. Existing UI Integration

The current ShadowTrace interface is already developed.

Member 2 must preserve:
- Dashboard.
- Existing design system.
- Existing sidebar and navigation.
- Existing global CSS.
- Existing components.
- Existing animations.
- Existing theme.

New functionality must match the existing visual language.

Do not introduce a new UI framework or redesign existing pages.

## 5.1 CSV Processing Interface

Required functionality:
- Evidence selection.
- Processing action.
- Processing status.
- Processing summary.
- Validation error details.
- Invalid row information.

## 5.2 Event Explorer Interface

Required functionality:
- Event listing.
- Search.
- Filters.
- Sorting.
- Event details.
- Evidence traceability.

## 5.3 Timeline Interface

Required functionality:
- Chronological event representation.
- Timestamp display.
- Event type identification.
- Event detail interaction.
- Filtering integration.

The timeline must use existing styling and components wherever possible.

# PART 5 — DEVELOPMENT TASKS

## TASK 1 — Repository and Integration Inspection

- [ ] Pull the latest shared development branch.
- [ ] Inspect Member 1's investigation and evidence implementation.
- [ ] Understand the shared database connection.
- [ ] Review the evidence metadata structure.
- [ ] Identify the original evidence storage method.
- [ ] Inspect existing frontend components.
- [ ] Confirm the agreed CSV schema.
- [ ] Confirm API response conventions.

**Deliverable:** Integration notes and confirmed data contract.

## TASK 2 — CSV Validation

- [ ] Implement safe CSV reading.
- [ ] Validate required columns.
- [ ] Normalize column names.
- [ ] Detect missing columns.
- [ ] Handle empty files.
- [ ] Validate row structures.
- [ ] Handle invalid values.
- [ ] Implement timestamp parsing.
- [ ] Document timezone assumptions.
- [ ] Return meaningful validation errors.

**Deliverable:** CSV Validation Service.

## TASK 3 — Event Normalization

- [ ] Implement event normalization.
- [ ] Map source columns to standardized fields.
- [ ] Generate event records.
- [ ] Associate events with investigations.
- [ ] Associate events with evidence files.
- [ ] Preserve source row numbers.
- [ ] Handle invalid rows.
- [ ] Implement duplicate identification.
- [ ] Store valid events in SQLite.
- [ ] Use appropriate database transactions.

**Deliverable:** Event Normalization Service.

## TASK 4 — Processing Summary

- [ ] Implement processing run records.
- [ ] Count total rows.
- [ ] Count valid rows.
- [ ] Count invalid rows.
- [ ] Count duplicate rows.
- [ ] Record processing status.
- [ ] Record processing timestamps.
- [ ] Return a processing summary.
- [ ] Test successful and unsuccessful processing.

**Deliverable:** Processing Summary API.

## TASK 5 — Event Explorer Backend

- [ ] Implement event listing.
- [ ] Implement event details.
- [ ] Implement chronological sorting.
- [ ] Implement username filtering.
- [ ] Implement source IP filtering.
- [ ] Implement event type filtering.
- [ ] Implement status filtering.
- [ ] Implement date range filtering.
- [ ] Implement evidence filtering.
- [ ] Test combined filters.

**Deliverable:** Event Explorer API.

## TASK 6 — Timeline Backend and Data Integration

- [ ] Prepare chronological event data.
- [ ] Ensure consistent timestamp sorting.
- [ ] Preserve evidence references.
- [ ] Preserve source row references.
- [ ] Confirm event data is scoped to the correct investigation.
- [ ] Test timeline data with multiple evidence files.

**Deliverable:** Timeline-ready event data.

## TASK 7 — Frontend Implementation

- [ ] Implement the CSV processing interface.
- [ ] Connect processing to the backend.
- [ ] Display processing summaries.
- [ ] Display invalid row information.
- [ ] Implement Event Explorer.
- [ ] Connect search and filters.
- [ ] Implement event details.
- [ ] Implement Timeline.
- [ ] Connect timeline interactions.
- [ ] Reuse existing components and animations.

**Deliverable:** Functional CSV Processing, Event Explorer, and Timeline interfaces.

## TASK 8 — Testing and Integration

- [ ] Test valid CSV files.
- [ ] Test missing required columns.
- [ ] Test invalid timestamps.
- [ ] Test empty files.
- [ ] Test duplicate records.
- [ ] Test partially invalid CSV files.
- [ ] Test event search.
- [ ] Test combined filters.
- [ ] Test chronological sorting.
- [ ] Test evidence traceability.
- [ ] Verify that original evidence remains unchanged.
- [ ] Test integration with Member 1's modules.

**Deliverable:** Tested Member 2 modules.

# PART 6 — ACCEPTANCE CRITERIA

Member 2's work is accepted when:

1. Uploaded CSV evidence can be processed.
2. Required columns are validated.
3. Column names are normalized.
4. Timestamps are handled consistently.
5. Valid rows become normalized event records.
6. Invalid rows are reported with reasons.
7. Duplicate handling is transparent.
8. Processing summaries are saved.
9. Events are associated with the correct investigation and evidence.
10. Users can browse normalized events.
11. Search and filters work.
12. Chronological sorting works.
13. Timeline displays events correctly.
14. Event-to-evidence traceability works.
15. The original evidence remains unchanged.
16. Existing dashboard and UI/UX remain unaffected.
17. All assigned features are integrated and tested.

# PART 7 — HANDOFF TO OTHER MEMBERS

Member 2 must provide Member 3 with:

- Normalized event schema.
- Event ID format.
- Investigation ID relationship.
- Evidence ID relationship.
- Timestamp representation.
- Username field.
- Source IP field.
- Event type field.
- Status field.
- Event retrieval API.
- Processing summary structure.

Member 3 will use normalized events as input for the Rule-Based Detection Engine.

Member 2 must not implement detection rules or findings management.

# PART 8 — OUT OF SCOPE

- Investigation Management.
- Evidence Upload.
- SHA-256 calculation.
- Detection Engine.
- Findings Management.
- Reports and exports.
- Audit Trail.
- Settings.
- Dashboard redesign.
- Global UI/UX changes.

# PART 9 — DEFINITION OF DONE

The assigned features are complete when:
- CSV validation works.
- Event normalization works.
- Processing results are stored.
- Event Explorer works.
- Timeline works.
- Search and filtering work.
- Evidence traceability works.
- Frontend and backend are integrated.
- Existing interface is preserved.
- Tests pass.
- Changes are committed to the assigned feature branch.
- Integration documentation is provided.

**Final Deliverable:** Two fully functional ShadowTrace modules: CSV Validation & Event Normalization and Event Explorer & Timeline.