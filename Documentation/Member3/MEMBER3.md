# SHADOWTRACE
## MEMBER 3 — PRODUCT REQUIREMENTS DOCUMENT (PRD) + DEVELOPMENT TASKS

**Assigned Modules:**
1. Rule-Based Detection Engine
2. Findings Management

**Project:** ShadowTrace  
**Role:** Feature Developer — Member 3  
**Frontend:** HTML5, CSS3, Vanilla JavaScript  
**Backend:** Python Flask REST API  
**Database:** SQLite

---

# PART 1 — PROJECT RESPONSIBILITY

## 1.1 Role and Ownership

Member 3 is responsible for developing the core detection and investigation findings functionality of ShadowTrace.

Assigned modules:

- Rule-Based Detection Engine
- Findings Management

The Detection Engine will analyze normalized security events and identify predefined suspicious patterns.

Findings Management will allow investigators to review, track, annotate, and update the status of detected findings.

Member 3 must consume normalized events from Member 2's module.

Member 3 must NOT:
- Change the existing dashboard.
- Redesign the existing UI/UX.
- Modify global CSS or animations.
- Replace existing frontend components.
- Create a separate database.
- Rebuild the CSV processing system.
- Modify another member's features without coordination.
- Present automated findings as confirmed security breaches.

# PART 2 — PRODUCT REQUIREMENTS DOCUMENT

## 2. Rule-Based Detection Engine

### 2.1 Purpose

The Rule-Based Detection Engine analyzes normalized security events to identify suspicious patterns.

It uses predefined, transparent detection rules rather than making unsupported claims about malicious activity.

The engine should explain:
- What pattern was detected.
- Which rule detected it.
- Which events contributed to the finding.
- Why the pattern was considered suspicious.
- What severity was assigned.

A finding represents an investigative lead, not proof of compromise.

### 2.2 Initial Detection Rules

The initial version must implement the following rules.

**RULE-01: Repeated Failed Login Attempts**

Identify repeated failed login attempts associated with the same username and source IP within a five-minute window.

Initial threshold:
- At least three failed login events.
- Same username.
- Same source IP.
- Events occur within five minutes.

Expected result:
- Create a suspicious activity finding.
- Reference all relevant event IDs.
- Explain the observed pattern.

**RULE-02: Successful Login Following Repeated Failures**

Identify a successful login following repeated failed login attempts for the same username and source IP within the configured investigation window.

Expected result:
- Identify the relevant failed login events.
- Identify the subsequent successful login event.
- Create a finding with supporting event references.
- Explain the sequence.

This pattern is suspicious but does not independently prove unauthorized access.

**RULE-03: Sensitive File Access Following Suspicious Login Activity**

Where the available logs contain sufficient fields, identify sensitive file access events that occur after a matching suspicious login sequence.

This rule must only run when the necessary event types and fields are available.

If the required information is missing, the rule should be marked as unsupported or skipped rather than producing misleading findings.

### 2.3 Functional Requirements

**FR-01: Run Analysis**

Users must be able to run detection analysis for a selected investigation.

The system must:
1. Retrieve normalized events.
2. Load enabled detection rules.
3. Evaluate the rules.
4. Generate findings.
5. Associate findings with supporting events.
6. Save an analysis run.
7. Return an analysis summary.

**FR-02: Detection Rule Management**

Detection rules must be centralized and documented.

Each rule should contain:
- Rule ID.
- Rule name.
- Description.
- Detection logic.
- Threshold or time window, where applicable.
- Default severity.
- Enabled/disabled state.

The initial release does not require a complex visual rule builder.

**FR-03: Finding Generation**

Every generated finding must contain:

- Finding ID.
- Investigation ID.
- Analysis run ID.
- Rule ID.
- Rule name.
- Description.
- Severity.
- Detection timestamp.
- Review status.
- Explanation.

**FR-04: Supporting Event References**

Each finding must reference the events that triggered it.

The system must allow investigators to navigate from a finding to its supporting events.

**FR-05: Severity Classification**

Use three severity levels:

| Severity | Meaning |
|---|---|
| Low | Unusual activity requiring limited review |
| Medium | Suspicious activity requiring investigation |
| High | Stronger suspicious pattern requiring priority review |

Severity is a prioritization label, not a probability or proof of compromise.

**FR-06: Analysis Run History**

Each analysis operation should create an analysis run record.

Store:
- Analysis run ID.
- Investigation ID.
- Start timestamp.
- Completion timestamp.
- Number of events analyzed.
- Number of rules evaluated.
- Number of findings generated.
- Run status.

**FR-07: Repeat Analysis Handling**

Running analysis repeatedly must not create uncontrolled duplicate findings.

Use an agreed deduplication strategy based on the rule and its supporting event references.

The system must retain meaningful analysis history.

### 2.4 Detection Data Model

Recommended tables:

**analysis_runs**
- `id`
- `investigation_id`
- `started_at`
- `completed_at`
- `events_analyzed`
- `rules_evaluated`
- `findings_generated`
- `status`

**findings**
- `id`
- `investigation_id`
- `analysis_run_id`
- `rule_id`
- `rule_name`
- `description`
- `severity`
- `status`
- `detected_at`
- `created_at`

**finding_events**
- `id`
- `finding_id`
- `event_id`

The final schema must be jointly approved.

---

## 3. Findings Management

### 3.1 Purpose

Findings Management provides a structured way to review suspicious activity detected by the engine.

Investigators must be able to inspect findings, understand their evidence, add notes, and update their investigation status.

### 3.2 Functional Requirements

**FR-08: Findings Listing**

Display findings belonging to the selected investigation.

Show:
- Finding ID.
- Rule name.
- Description.
- Severity.
- Status.
- Detection timestamp.

**FR-09: Finding Details**

Users must be able to inspect:
- Full finding description.
- Detection rule.
- Severity.
- Detection timestamp.
- Supporting events.
- Associated investigation.
- Investigation notes.

**FR-10: Finding Status Management**

Supported statuses:

| Status | Meaning |
|---|---|
| New | Newly generated finding |
| Under Review | Finding is being investigated |
| Resolved | Review is completed |
| False Positive | Finding was reviewed and considered non-actionable |

**FR-11: Finding Notes**

Users must be able to add notes to a finding.

Each note should contain:
- Note ID.
- Finding ID.
- Note text.
- Creation timestamp.

Notes must be stored in the database.

**FR-12: Finding Filters**

Support filtering by:
- Severity.
- Status.
- Rule.
- Detection date.

**FR-13: Traceability**

A finding must remain linked to:
- Its investigation.
- Its analysis run.
- Its detection rule.
- Its supporting normalized events.

# PART 3 — API REQUIREMENTS

Member 3 owns these endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/investigations/<id>/analyze` | Run detection analysis |
| GET | `/api/investigations/<id>/analysis-runs` | List analysis history |
| GET | `/api/investigations/<id>/findings` | List findings |
| GET | `/api/findings/<id>` | Get finding details |
| PATCH | `/api/findings/<id>/status` | Update finding status |
| POST | `/api/findings/<id>/notes` | Add finding note |

### 4.1 Example Analysis Request

```http
POST /api/investigations/1/analyze
```

### 4.2 Example Analysis Response

```json
{
  "ok": true,
  "data": {
    "analysis_run_id": 1,
    "investigation_id": 1,
    "events_analyzed": 120,
    "rules_evaluated": 3,
    "findings_generated": 2,
    "status": "Completed"
  }
}
```

### 4.3 Example Finding Response

```json
{
  "ok": true,
  "data": {
    "id": 1,
    "rule_id": "RULE-01",
    "rule_name": "Repeated Failed Login Attempts",
    "severity": "Medium",
    "status": "New",
    "description": "Repeated failed login activity was identified.",
    "supporting_event_ids": [10, 11, 12]
  }
}
```

### 4.4 Example Status Update

```json
{
  "status": "Under Review"
}
```

The backend must validate status values before updating the record.

# PART 4 — FRONTEND REQUIREMENTS

## 5. Existing UI Integration

The existing dashboard, layout, visual design, global CSS, theme, and animations must remain unchanged.

Member 3 must:
- Reuse existing tables.
- Reuse existing cards.
- Reuse existing severity badges.
- Reuse existing modals and forms.
- Reuse existing notification components.
- Follow the existing design system.

No dashboard redesign is permitted.

## 5.1 Detection Interface

Required functionality:
- Run analysis.
- Show analysis progress or loading state.
- Display analysis summary.
- Display analysis history.
- Show generated findings count.
- Handle failed analysis.

## 5.2 Findings Interface

Required functionality:
- Findings listing.
- Severity display.
- Status display.
- Finding details.
- Supporting event references.
- Status updates.
- Notes.
- Search and filters.

The interface must clearly communicate that findings are suspicious patterns requiring human review.

# PART 5 — DEVELOPMENT TASKS

## TASK 1 — Repository and Data Contract Inspection

- [ ] Pull the latest shared development branch.
- [ ] Inspect Member 2's event normalization implementation.
- [ ] Confirm the normalized event schema.
- [ ] Confirm timestamp representation.
- [ ] Confirm event ID structure.
- [ ] Confirm investigation relationships.
- [ ] Inspect the shared database connection.
- [ ] Review existing frontend components.
- [ ] Agree on detection rule inputs.

**Deliverable:** Confirmed detection data contract.

## TASK 2 — Detection Rule Design

- [ ] Define centralized rule structure.
- [ ] Assign unique rule IDs.
- [ ] Document rule descriptions.
- [ ] Define thresholds and time windows.
- [ ] Define supported event types.
- [ ] Define severity levels.
- [ ] Implement enabled/disabled rule configuration.
- [ ] Document limitations of each rule.

**Deliverable:** Detection Rule Specification.

## TASK 3 — Detection Engine Implementation

- [ ] Implement the analysis service.
- [ ] Retrieve normalized events.
- [ ] Implement RULE-01.
- [ ] Implement RULE-02.
- [ ] Implement RULE-03 where required data exists.
- [ ] Generate finding records.
- [ ] Associate findings with supporting events.
- [ ] Handle missing event fields.
- [ ] Handle empty investigations.
- [ ] Implement deduplication.
- [ ] Add appropriate error handling.

**Deliverable:** Functional Rule-Based Detection Engine.

## TASK 4 — Analysis Run Management

- [ ] Implement analysis run creation.
- [ ] Record start and completion timestamps.
- [ ] Record events analyzed.
- [ ] Record rules evaluated.
- [ ] Record findings generated.
- [ ] Store run status.
- [ ] Implement analysis history retrieval.
- [ ] Test repeated analysis.

**Deliverable:** Analysis Run History.

## TASK 5 — Findings Management Backend

- [ ] Implement findings listing.
- [ ] Implement finding details.
- [ ] Implement severity filtering.
- [ ] Implement status filtering.
- [ ] Implement rule filtering.
- [ ] Implement date filtering.
- [ ] Implement status updates.
- [ ] Implement finding notes.
- [ ] Implement supporting event retrieval.
- [ ] Test all endpoints.

**Deliverable:** Findings Management API.

## TASK 6 — Frontend Detection Interface

- [ ] Add the analysis action to the appropriate existing page.
- [ ] Connect analysis to Flask.
- [ ] Display loading and completion states.
- [ ] Display analysis summary.
- [ ] Display analysis history.
- [ ] Handle API errors.
- [ ] Preserve the existing design.

**Deliverable:** Functional Detection Interface.

## TASK 7 — Frontend Findings Interface

- [ ] Implement findings listing.
- [ ] Display severity and status.
- [ ] Implement finding details.
- [ ] Display supporting events.
- [ ] Implement status updates.
- [ ] Implement notes.
- [ ] Implement filters.
- [ ] Connect all operations to the backend.
- [ ] Reuse existing UI components.

**Deliverable:** Functional Findings Management Interface.

## TASK 8 — Testing and Integration

- [ ] Test RULE-01 with representative test data.
- [ ] Test RULE-02 with representative test data.
- [ ] Test RULE-03 with supported and unsupported data.
- [ ] Test severity assignment.
- [ ] Test finding-event relationships.
- [ ] Test repeat analysis.
- [ ] Test finding status updates.
- [ ] Test notes.
- [ ] Test filters.
- [ ] Test empty investigations.
- [ ] Verify integration with Member 2's event data.
- [ ] Verify compatibility with the shared architecture.

**Deliverable:** Tested Member 3 modules.

# PART 6 — ACCEPTANCE CRITERIA

Member 3's work is accepted when:

1. Analysis can be executed for a selected investigation.
2. Normalized events are used as input.
3. The three initial detection rules are implemented appropriately.
4. Unsupported rule inputs are handled safely.
5. Findings include explanations.
6. Findings reference supporting events.
7. Severity is assigned.
8. Analysis run history is stored.
9. Repeat analysis does not create uncontrolled duplicates.
10. Findings can be listed and inspected.
11. Finding statuses can be updated.
12. Notes can be added and retrieved.
13. Findings can be filtered.
14. All operations use the shared database.
15. The existing dashboard and UI/UX remain unchanged.
16. All modules are tested and documented.

# PART 7 — HANDOFF TO MEMBER 4

Member 3 must provide Member 4 with:

- Finding database schema.
- Finding IDs.
- Rule IDs and names.
- Severity values.
- Finding statuses.
- Supporting event references.
- Analysis run structure.
- Analysis summary.
- Finding retrieval API.

Member 4 will use these records to generate investigation reports and exports.

# PART 8 — OUT OF SCOPE

- Investigation Management.
- Evidence Upload.
- SHA-256 verification.
- CSV validation.
- Event normalization.
- Event Explorer.
- Timeline.
- Reports and exports.
- Audit Trail.
- Settings.
- Dashboard redesign.
- Global UI/UX changes.

# PART 9 — DEFINITION OF DONE

The modules are complete when:
- Detection rules work.
- Analysis results are saved.
- Findings are generated correctly.
- Supporting events are traceable.
- Findings Management works.
- Notes and statuses work.
- Frontend and backend are integrated.
- Tests pass.
- Existing UI remains unchanged.
- Changes are committed to the assigned feature branch.
- Integration documentation is provided.

**Final Deliverable:** Two fully functional ShadowTrace modules: Rule-Based Detection Engine and Findings Management.