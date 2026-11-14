# SHADOWTRACE — UNIVERSAL DEVELOPMENT RULES
**Version:** 2.0  
**Applies To:** All Team Members, Developers and AI Coding Assistants  
**Project:** ShadowTrace

---

# 1. Purpose and Authority

This document defines the mandatory rules for developing, modifying, testing and integrating ShadowTrace.

Every team member and AI coding assistant must follow these rules.

The shared project documents have the following purposes:

1. **Architecture:** Defines how the application is structured and how its components communicate.
2. **Memory:** Provides shared project context, confirmed decisions, feature ownership and current understanding.
3. **Universal Rules:** Defines mandatory development practices and restrictions.
4. **Member PRD + TASKS:** Defines individual responsibilities, requirements and acceptance criteria.

If a proposed change conflicts with an approved shared decision, do not implement it independently. Raise the conflict for team review.

---

# 2. Repository Inspection Rules

Before modifying any existing code:

1. Inspect the repository structure.
2. Read the relevant source files.
3. Understand existing functions, routes and dependencies.
4. Identify related frontend and backend integrations.
5. Check whether the required functionality already exists.
6. Identify possible impacts on other members' features.
7. Make the smallest appropriate change.

Never assume that a file, function, endpoint, database table or CSS class exists simply because it is mentioned in a planning document.

The actual repository is the implementation source of truth.

**Forbidden:**
- Replacing files without inspecting them.
- Rewriting working functionality unnecessarily.
- Creating duplicate functions or endpoints.
- Removing existing features to simplify development.
- Changing unrelated code during a feature implementation.
- Inventing a folder structure without checking the current project.

---

# 3. UI/UX Preservation Rules

The existing ShadowTrace interface is an approved product baseline.

Its dashboard, application shell, landing experience and Three Bugs animation system must remain intact.

## 3.1 Protected Assets

Do not independently remove, rename, replace or rewrite:

- `index.html`
- `static/css/style.css`
- `static/css/three_bugs.css`
- `static/js/app.js`
- `static/js/three_bugs.js`
- `static/3Bugs.mp4`
- `static/logo.jpeg`
- Existing character images.
- Existing dashboard components.
- Existing global background and motion effects.

These files may require coordinated additions or carefully scoped modifications to support new features, but they must not be redesigned or replaced without explicit approval.

## 3.2 Existing Design Identity

All new modules must follow the existing:

- Color system.
- Typography.
- Spacing.
- Card design.
- Borders and shadows.
- Glow effects.
- Button styles.
- Input styles.
- Navigation structure.
- Transitions and animation intensity.

Use the actual existing CSS tokens and components.

Do not invent a new visual system.

## 3.3 Three Bugs Animation Rules

The Three Bugs system is part of the ShadowTrace product identity.

- Preserve Bit, Glitch and Cipher.
- Preserve the existing introduction video.
- Preserve the existing animation integration.
- Preserve existing background effects.
- Do not restart the full introduction on every page navigation.
- Keep the replay-intro functionality working.
- Do not introduce competing animation libraries without approval.

**No team member may independently modify the global UI or Three Bugs animation behavior.**

Any necessary changes require team approval, impact review and testing.

---

# 4. Feature Ownership Rules

There are four members and eight core features.

Each member owns exactly two features.

| Member | Feature 1 | Feature 2 |
|---|---|---|
| Member 1 | Investigation Management | Evidence Upload & Integrity |
| Member 2 | CSV Validation & Normalization | Event Explorer & Timeline |
| Member 3 | Rule-Based Detection Engine | Findings Management |
| Member 4 | Investigation Reports & Export | Audit Trail & Activity History |

## Ownership Requirements

- Each member is responsible for implementing and testing their assigned features.
- Members must understand the shared Architecture.
- Members must coordinate with dependent feature owners.
- Members must not independently change another member's implementation.
- Shared components must remain consistent.
- Integration problems must be discussed before changing another member's code.

Feature ownership does not mean that a member can independently redesign shared architecture or modify the entire application.

---

# 5. Git and Branching Rules

## 5.1 Branch Structure

Use:

- `main` — stable release branch.
- `develop` — integration branch.
- Feature branches — individual development work.

Suggested branches:

- `feature/member-1-investigations`
- `feature/member-1-evidence`
- `feature/member-2-csv-processing`
- `feature/member-2-event-explorer`
- `feature/member-3-detection`
- `feature/member-3-findings`
- `feature/member-4-reports`
- `feature/member-4-audit`

## 5.2 Development Workflow

Every member must follow this process:

1. Pull the latest approved `develop` changes.
2. Create or update the assigned feature branch.
3. Implement only the assigned work.
4. Test the implementation.
5. Review the changes before committing.
6. Commit with a meaningful message.
7. Push the feature branch.
8. Open a pull request into `develop`.
9. Resolve review feedback.
10. Merge only after approval.

`main` must not receive unreviewed feature development.

## 5.3 Commit Message Examples

Use meaningful commit messages:

- `feat: add investigation creation`
- `feat: implement evidence hash verification`
- `feat: normalize imported CSV events`
- `feat: add chronological event explorer`
- `feat: implement failed login detection`
- `feat: add findings status management`
- `feat: generate investigation reports`
- `feat: record investigation activity`
- `fix: handle invalid CSV timestamps`
- `fix: prevent duplicate analysis findings`
- `test: add evidence upload validation tests`
- `docs: update API documentation`

Avoid vague messages such as:

- `update`
- `changes`
- `final`
- `new code`
- `fixed everything`

---

# 6. Shared File Modification Rules

The following files or components are shared and require coordination:

- `app.py`
- Database initialization and schema files.
- Shared service registration.
- Main HTML template.
- Global CSS.
- Global JavaScript.
- Shared navigation.
- Shared API utilities.
- Existing animation files.
- Configuration and dependency files.

Before changing a shared file:

1. Identify why the change is necessary.
2. Identify which members or features depend on it.
3. Inform the relevant team members.
4. Agree on the change.
5. Implement the smallest scoped modification.
6. Test all affected functionality.
7. Document the change.

Do not allow multiple members to independently rewrite the same shared file.

---

# 7. Backend Development Rules

## 7.1 Technology

Use the approved backend stack:

- Python.
- Flask.
- SQLite.

Do not introduce another backend framework or database without approval.

## 7.2 Layer Separation

Follow the approved architecture:

**Browser UI → Flask Routes/Controllers → Services → Database Helper/Repository → SQLite**

Routes should:

- Receive requests.
- Validate request boundaries.
- Verify IDs and relationships.
- Call relevant services.
- Return consistent responses.

Services should:

- Contain business logic.
- Handle processing and detection operations.
- Remain testable.
- Avoid unnecessary dependencies on Flask request globals.

Database helpers/repositories should:

- Manage database access.
- Use parameterized queries.
- Handle transactions appropriately.
- Maintain relationships and constraints.

**Forbidden:**
- Large business algorithms inside route functions.
- Scattered raw SQL throughout route handlers.
- Duplicated business logic.
- Unnecessary circular imports.
- Services that depend directly on Flask request globals.

---

# 8. Database Rules

SQLite is the approved database.

Every member must follow these requirements:

1. Inspect the current schema before proposing changes.
2. Preserve existing data.
3. Use parameterized SQL queries.
4. Enable and respect foreign-key constraints.
5. Use transactions for related multi-step operations.
6. Validate relationships between records.
7. Add indexes when justified by query patterns.
8. Store timestamps consistently in UTC ISO-8601 format.
9. Avoid unnecessary duplicate fields.
10. Coordinate schema changes with the team.

## Database Migration Restrictions

No member may independently:

- Drop existing tables.
- Recreate the database to resolve a minor issue.
- Delete existing records to make a feature work.
- Rename shared columns without approval.
- Introduce incompatible schema changes.
- Change database initialization in a way that breaks another feature.

All shared schema changes must be reviewed and tested against the existing database.

---

# 9. API Development Rules

All APIs must follow one consistent response structure.

## 9.1 Success Response

    {
      "ok": true,
      "data": {
        "item": {}
      }
    }

## 9.2 Error Response

    {
      "ok": false,
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "A readable explanation",
        "details": {}
      }
    }

## 9.3 HTTP Status Codes

Use appropriate status codes:

- `200` — Successful request.
- `201` — Resource created.
- `400` — Invalid request.
- `404` — Resource not found.
- `409` — Conflict.
- `413` — Payload too large.
- `415` — Unsupported file type.
- `422` — Unprocessable input.
- `500` — Unexpected server error.

## 9.4 API Restrictions

- Do not create duplicate endpoints.
- Do not change existing endpoint behavior without coordination.
- Do not return inconsistent response formats.
- Do not expose internal filesystem paths.
- Do not expose unnecessary sensitive information.
- Validate IDs before database operations.
- Verify that child resources belong to the requested investigation.
- Keep API documentation updated when contracts change.

---

# 10. Evidence Upload and Integrity Rules

Evidence handling is a core ShadowTrace capability.

Every implementation must follow these rules:

1. Accept CSV files only.
2. Enforce the 16 MB upload limit on the backend.
3. Keep frontend and backend size limits consistent.
4. Validate the file extension and actual content/readability.
5. Reject empty or invalid files appropriately.
6. Calculate SHA-256 from the original uploaded bytes.
7. Calculate the hash before normalization or transformation.
8. Generate safe server-side filenames.
9. Never use user-provided filenames directly as storage paths.
10. Store uploaded files outside public frontend directories.
11. Never execute uploaded files.
12. Avoid exposing absolute storage paths.
13. Handle database and file-storage failures safely.
14. Keep original evidence separate from derived records.

A matching hash confirms that compared bytes match the recorded hash reference. It does not prove who created the file, where it originated or whether it is legally authentic.

Do not make stronger integrity claims in the UI or reports.

---

# 11. CSV Processing Rules

CSV processing must be predictable and explainable.

The initial documented required columns are:

- `timestamp`
- `username`
- `source_ip`
- `event_type`
- `status`

Requirements:

- Normalize header case and surrounding whitespace.
- Check required columns before processing.
- Handle malformed rows safely.
- Parse timestamps consistently.
- Document timezone assumptions.
- Convert valid timestamps to UTC.
- Track invalid records with row numbers and reasons.
- Handle duplicates transparently.
- Preserve original evidence.
- Maintain investigation and evidence relationships.
- Generate accurate processing summaries.

Processing must not silently discard records without reporting the reason.

A malformed row must not unnecessarily crash the entire application.

---

# 12. Detection Engine Rules

The initial detection engine is deterministic and rule-based.

Approved initial detection concepts:

1. Repeated failed login attempts for the same username and source IP within five minutes.
2. Successful login following repeated failures within the documented correlation window.
3. Sensitive file access following a matching suspicious login sequence, when required fields exist.

Requirements:

- Keep rules centralized.
- Give each rule a stable identifier.
- Document its conditions.
- Document required event fields.
- Record supporting event references.
- Record analysis-run information.
- Use consistent severity values.
- Handle missing fields transparently.
- Prevent uncontrolled duplicate findings.
- Keep detection behavior testable and explainable.

Findings must be presented as suspicious patterns or investigative leads.

Never claim that a detection rule has conclusively established a breach.

---

# 13. Findings Management Rules

Every finding must maintain its relationship with its analysis run and supporting events.

Initial statuses:

- New
- Under Review
- Resolved
- False Positive

Initial severity levels:

- Low
- Medium
- High

Requirements:

- Validate status changes.
- Preserve finding explanations.
- Support analyst notes.
- Display supporting event references.
- Keep findings associated with the correct investigation.
- Record important status changes through audit integration.
- Avoid silently overwriting investigation history.

---

# 14. Reporting and Export Rules

Reports must be generated using saved application data.

A report may include:

- Investigation information.
- Evidence metadata.
- SHA-256 hashes.
- CSV processing summary.
- Event summary.
- Analysis run information.
- Detection summary.
- Findings.
- Supporting event references.
- Report generation timestamp.

Requirements:

- Scope reports to the selected investigation.
- Distinguish original evidence metadata from derived analysis results.
- Do not invent missing values.
- Do not describe findings as confirmed breaches.
- Ensure exported data matches the selected investigation.
- Use consistent and readable column headings.
- Handle empty datasets appropriately.

---

# 15. Audit Trail Rules

The audit trail should record important application activities, including:

- Investigation created.
- Investigation updated.
- Evidence uploaded.
- Processing completed.
- Analysis executed.
- Finding status changed.
- Report generated.

Where applicable, record:

- Activity ID.
- Investigation ID.
- Action type.
- Description.
- Timestamp.
- Related record reference.

Audit history must be useful and readable.

The application-level audit trail must not be described as cryptographically immutable or tamper-proof unless such guarantees are separately implemented and verified.

---

# 16. Frontend Development Rules

Use:

- HTML5.
- CSS3.
- Vanilla JavaScript.

All new modules must integrate with the existing ShadowTrace application shell.

Requirements:

- Reuse existing design patterns.
- Keep page navigation consistent.
- Use existing typography and color tokens.
- Follow established card and table styles.
- Keep interactions responsive.
- Avoid unnecessary external dependencies.
- Maintain readable JavaScript.
- Handle loading, empty, success and error states.
- Prevent accidental duplicate submissions.
- Preserve user input when a recoverable request fails.
- Display backend errors in a readable way.

Do not add a separate frontend framework without approval.

Do not build a second application shell for a new module.

---

# 17. Security Rules

Security must be considered in every feature.

Mandatory practices:

- Validate user input on the backend.
- Use parameterized SQL.
- Escape untrusted content before rendering.
- Avoid unsafe `innerHTML` for imported log data.
- Never trust uploaded filenames.
- Never execute uploaded files.
- Restrict accepted file formats.
- Enforce file size limits server-side.
- Keep evidence outside public directories.
- Avoid exposing internal server paths.
- Avoid logging secrets or sensitive evidence content unnecessarily.
- Keep credentials and secrets out of Git.
- Use fictional or authorized datasets only.

Never test against systems or datasets without appropriate authorization.

---

# 18. Error Handling and Application States

Every new module must handle:

1. Loading state.
2. Successful state.
3. Empty state.
4. Validation error.
5. Missing resource.
6. Server error.
7. Recoverable failure.

Requirements:

- Display readable messages.
- Avoid exposing stack traces to normal users.
- Log useful technical details for development.
- Prevent duplicate requests where appropriate.
- Do not silently ignore errors.
- Do not leave the UI in a misleading success state after a failed request.

---

# 19. Code Quality Rules

All team members must write code that is:

- Readable.
- Consistent.
- Maintainable.
- Modular.
- Properly named.
- Appropriately commented.
- Testable.

Avoid:

- Unnecessary code duplication.
- Extremely large functions.
- Unexplained hardcoded values.
- Unused dependencies.
- Unused variables.
- Dead code.
- Unnecessary refactoring.
- Hidden side effects.
- Catch-all error handling that hides real failures.

Comments should explain important reasoning, not repeat obvious code statements.

---

# 20. AI Coding Assistant Rules

AI assistants must follow all shared project documents.

Before generating or editing code, an AI assistant must:

1. Read the current Memory.
2. Read the approved Architecture.
3. Read Universal Rules.
4. Read the assigned member's PRD and TASKS.
5. Inspect the actual repository.
6. Identify existing implementation.
7. Confirm the assigned feature scope.
8. Identify shared-file dependencies.

AI assistants must not:

- Invent existing functions or routes.
- Assume a database schema without inspection.
- Replace the confirmed technology stack.
- Redesign the existing dashboard.
- Remove Three Bugs assets.
- Rewrite working files unnecessarily.
- Implement another member's feature without coordination.
- Claim tests passed when they were not run.
- Claim a feature is complete when only its UI exists.
- Silently change approved architecture.

When a required file or repository detail is unavailable, clearly identify what needs verification rather than inventing an answer.

AI-generated code must be reviewed, tested and integrated like any other contribution.

---

# 21. Testing Rules

Each feature must be tested independently and in integration with its dependencies.

Minimum testing categories:

- Normal successful workflow.
- Invalid input.
- Missing input.
- Empty dataset.
- Missing resource.
- Incorrect relationships.
- Database failure.
- File-processing failure where applicable.
- Duplicate operation.
- Frontend loading and error states.
- Existing application regression checks.

Use synthetic CSV datasets for development and demonstrations.

Do not use real sensitive evidence in the repository.

After modifying shared code, verify that existing functionality still works.

---

# 22. Documentation Rules

When a feature or shared implementation changes, update the relevant documentation.

Documentation should cover:

- Feature purpose.
- API endpoints.
- Request and response formats.
- Database changes.
- Important validation rules.
- Error behavior.
- Testing performed.
- Known limitations.

Update Memory when an approved project decision materially changes.

Update Architecture when the system structure or integration contract changes.

Do not allow outdated documentation to remain presented as the current implementation.

---

# 23. Definition of Done

A feature is complete only when all applicable requirements below are satisfied:

- [ ] The assigned functionality is implemented.
- [ ] The implementation follows the approved Architecture.
- [ ] The actual database structure is compatible.
- [ ] API contracts are consistent.
- [ ] Input validation is implemented.
- [ ] Error handling is implemented.
- [ ] Frontend states are handled.
- [ ] Existing UI/UX is preserved.
- [ ] Three Bugs integration remains intact.
- [ ] Normal and invalid cases are tested.
- [ ] Dependent features are checked.
- [ ] Documentation is updated.
- [ ] Changes are committed to the correct branch.
- [ ] Pull request is reviewed and approved.
- [ ] No unrelated existing functionality is broken.

A frontend screen without working backend integration is not a completed feature.

A backend endpoint without validation and testing is not a completed feature.

A successful local test without integration checks is not sufficient for final completion.

---

# 24. Forbidden Development Practices

The following are prohibited without explicit approval:

1. Replacing the existing frontend framework.
2. Replacing Flask or SQLite.
3. Redesigning the dashboard.
4. Removing or replacing the Three Bugs animation system.
5. Deleting existing project assets.
6. Rebuilding the application from scratch.
7. Dropping or resetting the existing database.
8. Modifying shared architecture independently.
9. Changing another member's assigned feature without coordination.
10. Adding unnecessary libraries or services.
11. Committing secrets or real sensitive evidence.
12. Making unsupported claims about detections or evidence authenticity.
13. Merging untested changes directly into `main`.
14. Claiming completion without satisfying acceptance criteria.

---

# 25. Final Team Agreement

Every team member and AI coding assistant must follow this shared principle:

**Build on the existing ShadowTrace project. Do not replace its identity, architecture or working functionality unnecessarily.**

The team is responsible for delivering:

- One integrated application.
- One consistent frontend.
- One Flask backend.
- One SQLite database.
- One agreed API contract.
- One preserved Three Bugs visual identity.
- Eight integrated core features.
- Four clearly assigned feature owners.
- Consistent testing and documentation.
- A stable, demonstrable project.

**Feature development must extend ShadowTrace, not fragment it into separate implementations.**

These Universal Rules remain applicable throughout the project unless the team formally approves and documents a revision.