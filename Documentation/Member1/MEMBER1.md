# SHADOWTRACE
## MEMBER 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD) + DEVELOPMENT TASKS

**Assigned Modules:**
1. Investigation Management
2. Evidence Upload & Integrity Verification (SHA-256)

**Project:** ShadowTrace  
**Role:** Feature Developer — Member 1  
**Development Model:** Individual feature branch  
**Frontend:** HTML5, CSS3, Vanilla JavaScript  
**Backend:** Python Flask REST API  
**Database:** SQLite

---

# PART 1 — PROJECT RESPONSIBILITY

## 1.1 Role and Ownership

Member 1 is responsible for implementing the first two core features of ShadowTrace:

- Investigation Management
- Evidence Upload & Integrity Verification

These features establish the foundation for the remaining modules. Every investigation acts as a container for its associated evidence, processed events, findings, and reports.

Member 1 must implement the assigned functionality inside the existing ShadowTrace codebase.

Member 1 must NOT:
- Redesign the dashboard.
- Change the existing UI/UX.
- Replace the existing frontend structure.
- Modify the global design system.
- Replace existing CSS or animation systems.
- Rebuild existing navigation or sidebar components.
- Introduce a separate database.
- Create a separate application architecture.
- Modify another member's assigned features without coordination.

New components must reuse the existing UI components, styles, layout, and interaction patterns.

# PART 2 — PRODUCT REQUIREMENTS DOCUMENT

## 2. Investigation Management

### 2.1 Purpose

The Investigation Management module allows users to create, organize, view, update, search, and manage digital investigations.

An investigation is the central entity of ShadowTrace. Evidence files, normalized events, findings, reports, and activity records must be associated with an investigation.

### 2.2 Functional Requirements

**FR-01: Create Investigation**

The system must allow users to create an investigation.

Required information:
- Investigation title
- Description (optional)
- Status
- Automatically generated unique investigation identifier
- Creation timestamp
- Last updated timestamp

Default status: `Open`

**FR-02: View Investigations**

The system must display investigations in the existing application interface.

Each investigation should expose:
- Investigation ID
- Title
- Description
- Status
- Creation date
- Last updated date
- Associated evidence count, when available
- Associated findings count, when available

**FR-03: Update Investigation**

Users must be able to update:
- Title
- Description
- Status

The system must validate all submitted values.

**FR-04: Search and Filter**

Users should be able to search investigations by:
- Title
- Investigation ID

Filters should include:
- Open
- In Progress
- Completed
- Archived

**FR-05: Investigation Status**

Supported statuses:

| Status | Meaning |
|---|---|
| Open | Newly created investigation |
| In Progress | Investigation is actively being examined |
| Completed | Investigation work has been completed |
| Archived | Investigation is retained but no longer active |

Status changes must be validated.

**FR-06: Investigation Retention**

Investigations should not be permanently deleted through the normal interface.

Archiving should be used instead, preserving associated evidence and investigation history.

### 2.3 Investigation Data Model

Proposed fields:

- `id`
- `investigation_uid`
- `title`
- `description`
- `status`
- `created_at`
- `updated_at`

The database schema must be coordinated with the team before implementation.

---

## 3. Evidence Upload & Integrity Verification

### 3.1 Purpose

This module allows users to upload CSV security log files into a selected investigation.

The system must preserve the original uploaded file and calculate its SHA-256 hash to provide an integrity-verification reference.

The original evidence must remain separate from normalized or processed event records.

### 3.2 Functional Requirements

**FR-07: Upload Evidence**

Users must be able to upload CSV files to a selected investigation.

The upload process must:
1. Confirm that the investigation exists.
2. Receive the uploaded file.
3. Validate the file.
4. Calculate its SHA-256 hash from the original file bytes.
5. Store the original file safely.
6. Save its metadata in SQLite.
7. Return an upload confirmation.

**FR-08: File Validation**

The system must validate:

- File extension.
- File readability.
- File content.
- File size.
- Empty files.
- Invalid or unsupported uploads.

The system must not trust the uploaded filename or browser-provided content type as proof that the file is valid.

Only CSV evidence is supported in the initial release.

**FR-09: SHA-256 Integrity Verification**

Calculate the SHA-256 hash of the original file before CSV normalization or processing.

Store the hash in the database.

The hash must be reproducible from the preserved original file.

The system should support a verification operation that recalculates the hash of the stored evidence and compares it with the original recorded hash.

Possible verification results:
- Integrity Verified
- Integrity Mismatch
- Verification Failed

A matching hash indicates that the file bytes match the recorded reference. It does not independently establish the authenticity or origin of the evidence.

**FR-10: Secure Evidence Storage**

Evidence files must:
- Be stored outside the public frontend directory.
- Use generated internal filenames.
- Never use untrusted filenames as filesystem paths.
- Never be executed.
- Remain associated with the correct investigation.
- Not expose absolute server storage paths to the browser.

The original filename should be retained as metadata.

**FR-11: Evidence Listing**

Users must be able to view evidence uploaded to an investigation.

Display:
- Evidence ID
- Original filename
- File size
- SHA-256 hash
- Upload timestamp
- Processing status
- Integrity verification status, when available

**FR-12: Evidence Details**

Users should be able to open an evidence record and inspect its metadata.

The original evidence file must not be silently modified during processing.

### 3.3 Evidence Data Model

Proposed fields:

- `id`
- `investigation_id`
- `original_filename`
- `stored_filename`
- `file_size`
- `sha256_hash`
- `upload_timestamp`
- `processing_status`

Optional additional fields can be proposed jointly if required.

### 3.4 File Upload Failure Handling

The system must handle:
- Missing files.
- Invalid extensions.
- Empty files.
- Oversized files.
- Invalid CSV content.
- Unknown investigation IDs.
- Storage failures.
- Database failures.
- Duplicate uploads.

If a file is successfully saved but its database record cannot be committed, the application should safely clean up the unreferenced file where possible.

Use database transactions where appropriate.

Duplicate uploads should not silently overwrite existing evidence.

# PART 3 — API REQUIREMENTS

Member 1 owns the following API endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/investigations` | Create investigation |
| GET | `/api/investigations` | List investigations |
| GET | `/api/investigations/<id>` | Get investigation details |
| PUT | `/api/investigations/<id>` | Update investigation |
| POST | `/api/investigations/<id>/evidence` | Upload evidence |
| GET | `/api/investigations/<id>/evidence` | List investigation evidence |
| GET | `/api/evidence/<id>` | Get evidence metadata |

If the application already has equivalent endpoints, inspect and reuse them rather than creating conflicting routes.

### 4.1 Standard Success Response

```json
{
  "ok": true,
  "data": {
    "id": 1,
    "title": "Suspicious Login Investigation",
    "status": "Open"
  }
}
```

### 4.2 Standard Error Response

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_FILE",
    "message": "The uploaded file is not a valid CSV."
  }
}
```

### 4.3 HTTP Status Codes

Use appropriate HTTP status codes:
- `200` — Successful request
- `201` — Resource created
- `400` — Invalid request
- `404` — Resource not found
- `409` — Conflict
- `413` — File too large
- `415` — Unsupported media type
- `500` — Internal server error

# PART 4 — FRONTEND REQUIREMENTS

## 5. Existing UI Integration

The existing ShadowTrace interface must remain unchanged.

Member 1 should:
- Inspect the current dashboard and component structure.
- Reuse existing buttons, cards, tables, modals, forms, badges, and notification components.
- Follow existing spacing, typography, colors, and theme conventions.
- Reuse existing animations without replacing or duplicating them.
- Connect new functionality to the existing navigation where required.

New pages or components may be created only where necessary.

Do not create a second dashboard or a separate visual design.

## 5.1 Investigation Interface

Required functionality:
- Investigation listing.
- Create investigation form.
- Investigation details.
- Edit investigation.
- Status display.
- Search and filtering.

## 5.2 Evidence Interface

Required functionality:
- CSV upload.
- Selected investigation association.
- Upload validation feedback.
- Upload progress or loading feedback, if supported by the existing UI.
- Evidence listing.
- Evidence details.
- SHA-256 hash display.
- Integrity verification result.

All interactions must be connected to real backend APIs. Do not use permanent hardcoded demonstration data.

# PART 5 — DEVELOPMENT TASKS

## TASK 1 — Repository Inspection

- [ ] Pull the latest shared development branch.
- [ ] Inspect the complete project structure.
- [ ] Identify the Flask application entry point.
- [ ] Identify existing API routes.
- [ ] Inspect the current SQLite database.
- [ ] Inspect existing frontend pages and JavaScript.
- [ ] Identify reusable UI components.
- [ ] Identify existing upload functionality, if any.
- [ ] Document any existing functionality that must be preserved.

**Deliverable:** Repository inspection notes.

## TASK 2 — Investigation Management Backend

- [ ] Design the investigation repository operations.
- [ ] Implement investigation creation.
- [ ] Implement investigation listing.
- [ ] Implement investigation details.
- [ ] Implement investigation updates.
- [ ] Implement search and filtering.
- [ ] Implement status validation.
- [ ] Add appropriate error handling.
- [ ] Test all investigation endpoints.

**Deliverable:** Working Investigation Management API.

## TASK 3 — Investigation Management Frontend

- [ ] Connect the investigation listing to the backend.
- [ ] Implement investigation creation.
- [ ] Implement investigation details.
- [ ] Implement investigation editing.
- [ ] Connect status updates.
- [ ] Implement search and filtering.
- [ ] Reuse existing interface components.
- [ ] Test loading, empty, success, and error states.

**Deliverable:** Functional Investigation Management interface.

## TASK 4 — Evidence Upload Backend

- [ ] Implement CSV upload endpoint.
- [ ] Validate uploaded files.
- [ ] Configure an upload-size limit.
- [ ] Generate safe internal filenames.
- [ ] Calculate SHA-256 from original bytes.
- [ ] Store original evidence safely.
- [ ] Save evidence metadata in SQLite.
- [ ] Implement appropriate transaction and cleanup handling.
- [ ] Implement evidence listing.
- [ ] Implement evidence details.
- [ ] Test upload failure scenarios.

**Deliverable:** Working Evidence Upload API.

## TASK 5 — Integrity Verification

- [ ] Implement SHA-256 verification.
- [ ] Recalculate the hash from stored original evidence.
- [ ] Compare the calculated hash with the recorded hash.
- [ ] Return a clear verification result.
- [ ] Handle missing or inaccessible evidence safely.
- [ ] Test successful and failed verification cases.

**Deliverable:** Working Evidence Integrity Verification.

## TASK 6 — Evidence Frontend

- [ ] Add CSV upload functionality.
- [ ] Associate uploads with selected investigations.
- [ ] Connect upload requests to Flask.
- [ ] Display upload validation errors.
- [ ] Display evidence metadata.
- [ ] Display SHA-256 hashes.
- [ ] Display integrity verification results.
- [ ] Test the complete upload workflow.

**Deliverable:** Functional Evidence Management interface.

## TASK 7 — Integration and Testing

- [ ] Test investigation creation and updates.
- [ ] Test evidence upload.
- [ ] Test SHA-256 verification.
- [ ] Test invalid uploads.
- [ ] Test missing investigation handling.
- [ ] Test database failures.
- [ ] Test frontend/backend integration.
- [ ] Test compatibility with the shared application.
- [ ] Fix issues introduced by the assigned modules.

**Deliverable:** Tested Member 1 modules.

# PART 6 — ACCEPTANCE CRITERIA

Member 1's work is accepted when:

1. Users can create and manage investigations.
2. Investigations have unique identifiers.
3. Investigation status validation works.
4. Investigations can be searched and filtered.
5. CSV files can be uploaded to the correct investigation.
6. Invalid files are rejected safely.
7. Original evidence is preserved.
8. SHA-256 hashes are correctly calculated and stored.
9. Integrity verification works.
10. Evidence metadata is stored in SQLite.
11. The frontend communicates with the actual backend.
12. Existing dashboard, UI/UX, CSS, and animations remain unaffected.
13. The code works with the shared project architecture.
14. All assigned features are tested and documented.

# PART 7 — HANDOFF TO OTHER MEMBERS

Member 1 must provide the following to Member 2:

- Investigation ID structure.
- Evidence ID structure.
- Evidence database fields.
- Original evidence storage approach.
- Evidence listing API.
- Evidence metadata API.
- SHA-256 hash field.
- Upload and processing status conventions.

Member 2 will use these records to validate and normalize uploaded CSV evidence.

Member 1 must not implement Member 2's CSV normalization or event exploration modules.

# PART 8 — OUT OF SCOPE

The following are not Member 1's responsibility:

- CSV event normalization.
- Event Explorer.
- Event Timeline.
- Detection rules.
- Findings Management.
- Investigation Reports.
- CSV export of processed events.
- Audit Trail.
- Settings and profile management.
- Dashboard redesign.
- Global UI/UX changes.

# PART 9 — DEFINITION OF DONE

A feature is complete only when:
- Backend functionality works.
- Frontend functionality works.
- Database integration works.
- Validation and error handling work.
- Existing UI is preserved.
- No unrelated files or features are broken.
- Changes are committed to the assigned feature branch.
- The feature is tested.
- API behavior is documented.
- Integration requirements are communicated to the team.

**Final Deliverable:** Two fully functional ShadowTrace modules: Investigation Management and Evidence Upload & Integrity Verification.