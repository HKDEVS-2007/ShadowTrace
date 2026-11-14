# SHADOWTRACE — SECURITY-2
## Input Validation, Data Protection & Injection Prevention

**Security Owner:** Member 2  
**Related Features:** CSV Validation & Event Normalization; Event Explorer & Timeline  
**Security Scope:** User input, CSV parsing, XSS, SQL injection prevention, event data integrity, export safety and data validation.

---

## 1. Objective

Member 2 is responsible for protecting ShadowTrace against malicious or malformed input and unsafe data handling.

ShadowTrace imports external CSV files and displays their contents. Therefore, imported values must always be considered untrusted.

The objective is to ensure that:

- Malformed CSV files cannot crash the application unexpectedly.
- Imported data cannot execute as browser code.
- SQL queries cannot be manipulated through user input.
- Search and filter operations are validated.
- Event data is safely displayed.
- CSV exports do not introduce spreadsheet formula injection.
- Normalization does not silently alter original evidence.

## 2. Input Validation

Validate all user-controlled input on the backend.

This includes:

- Investigation search values.
- Username filters.
- Source IP filters.
- Event type filters.
- Status filters.
- Date and time ranges.
- Pagination values.
- Sorting parameters.
- CSV headers and values.
- Record identifiers.

Requirements:

- Apply appropriate data types.
- Enforce maximum lengths.
- Reject malformed values.
- Apply sensible allowed-value lists.
- Handle missing values explicitly.
- Avoid trusting frontend validation alone.
- Return readable validation errors.

Frontend validation improves usability but does not replace backend validation.

## 3. CSV Security

CSV files are untrusted input.

### 3.1 Header Validation

The initial documented required columns are:

- `timestamp`
- `username`
- `source_ip`
- `event_type`
- `status`

Requirements:

- Normalize header case and surrounding whitespace.
- Detect missing required columns.
- Handle duplicate headers safely.
- Reject unsupported structures clearly.
- Prevent unexpected header names from silently changing processing behavior.
- Define reasonable maximum field and row counts.

### 3.2 Record Validation

For every row:

- Validate the timestamp.
- Validate the source IP format where applicable.
- Validate required fields.
- Apply field-length limits.
- Handle missing or blank values.
- Identify malformed records.
- Record the original row number.
- Provide a readable failure reason.

Do not crash the entire processing pipeline because of one invalid row.

### 3.3 CSV Parser Safety

Use Python's standard CSV parsing capabilities or an approved maintained parser.

Requirements:

- Avoid evaluating CSV content as Python code.
- Never execute imported values.
- Avoid dynamic code execution.
- Handle encoding problems explicitly.
- Apply limits to unusually large fields and datasets.
- Handle malformed quoting and delimiters safely.
- Do not assume every CSV file has the same encoding.

### 3.4 Duplicate Records

Duplicate handling must be transparent.

- Identify duplicates using an approved comparison strategy.
- Do not silently delete original evidence.
- Document how duplicates affect processing summaries.
- Preserve source row references.
- Avoid treating duplicate records as separate suspicious activity unless the detection logic explicitly requires it.

## 4. SQL Injection Prevention

All database operations must use parameterized SQL.

Never construct SQL by directly concatenating user-controlled strings.

Unsafe pattern:

    query = "SELECT * FROM events WHERE username = '" + username + "'"

Preferred pattern:

    cursor.execute(
        "SELECT * FROM events WHERE username = ?",
        (username,)
    )

Requirements:

- Parameterize all user-provided values.
- Do not concatenate search text into SQL.
- Validate sorting columns against an explicit allowlist.
- Validate sort direction against approved values.
- Do not allow arbitrary table or column names from requests.
- Use the existing database layer where possible.
- Coordinate database changes with the team.

Member 2 must inspect event-search and filtering queries carefully.

## 5. Cross-Site Scripting (XSS) Prevention

Imported logs may contain HTML-like or script-like text.

All imported values must be treated as plain untrusted data.

Requirements:

- Use `textContent` for ordinary text insertion.
- Avoid unsafe `innerHTML` for imported event data.
- Do not interpolate untrusted values into HTML strings.
- Avoid unsafe inline JavaScript generation.
- Validate URL schemes if links are ever displayed.
- Escape values appropriately when rendering HTML.
- Do not treat sanitization as a replacement for safe DOM APIs.

Example:

    element.textContent = event.username;

Do not use untrusted event content as executable markup.

Also review:

- Event detail panels.
- Search result rows.
- Timeline labels.
- Tooltips.
- Notifications.
- Error messages containing imported values.

## 6. Stored and Reflected XSS Review

Inspect every location where user-controlled content can appear.

Examples:

- Usernames.
- Event types.
- Source IP strings.
- Original CSV headers.
- Error messages.
- Investigation titles.
- Analyst-provided text.
- Search terms.

Ensure the browser displays these values as text rather than interpreting them as HTML or script.

Test with harmless synthetic strings containing HTML-like characters and confirm they render literally.

## 7. CSV Export Formula Injection

CSV exports can be opened by spreadsheet applications.

Values beginning with spreadsheet formula characters can be interpreted as formulas.

Review exported fields that may contain:

- Usernames.
- Event descriptions.
- Original CSV values.
- Analyst notes.
- Other imported text.

Requirements:

- Apply a documented CSV formula-injection mitigation.
- Treat exported untrusted strings as text.
- Handle leading whitespace and control characters appropriately.
- Do not assume CSV quoting alone prevents formula interpretation.
- Preserve the original stored evidence unchanged.
- Apply export protection only to derived output.

Test exports with harmless values beginning with characters such as `=`, `+`, `-` and `@`.

## 8. Event Normalization Integrity

Normalization must not destroy the original evidence.

Requirements:

- Keep original evidence separate.
- Preserve evidence ID.
- Preserve source row number.
- Preserve original timestamp where required.
- Store normalized timestamps separately.
- Document timezone assumptions.
- Retain raw row data where appropriate.
- Report invalid records transparently.
- Keep normalized data linked to its source evidence.

Do not silently modify the uploaded original file.

## 9. Search and Pagination Protection

Search and filtering endpoints must be bounded.

Requirements:

- Set a maximum page size.
- Set a maximum allowed offset or use a suitable pagination strategy.
- Validate date ranges.
- Validate sort options.
- Avoid unbounded database queries for large datasets.
- Handle empty filters safely.
- Apply server-side filters.
- Avoid trusting client-provided SQL fragments.

A user should not be able to request an unlimited result set simply by modifying frontend parameters.

## 10. Data Privacy

- Do not expose raw evidence unnecessarily.
- Do not return internal database details.
- Do not include sensitive raw rows in ordinary error messages.
- Avoid displaying more event fields than necessary.
- Keep investigation boundaries enforced by Member 1's authorization controls.
- Coordinate data-retention requirements with the team.

## 11. Required Security Tests

Member 2 must test:

- Missing CSV headers.
- Duplicate headers.
- Invalid timestamps.
- Malformed CSV rows.
- Unexpected encodings.
- Excessively long fields.
- Empty files.
- Unexpected field types.
- SQL-like input in search fields.
- HTML-like text in usernames and event descriptions.
- Script-like strings in timeline entries.
- Formula-like values in CSV exports.
- Invalid sort parameters.
- Excessive pagination values.
- Cross-investigation event access in coordination with Member 1.

All tests must use synthetic data.

## 12. Deliverables

Member 2 must deliver:

1. Backend input validation.
2. Safe CSV parser and processing behavior.
3. Normalization integrity controls.
4. Parameterized event search and filtering.
5. XSS-safe frontend rendering for imported values.
6. Safe CSV export handling.
7. Pagination and query bounds.
8. Security-focused test cases.
9. Documentation of accepted CSV format and limitations.

## 13. Acceptance Criteria

- [ ] All relevant backend inputs are validated.
- [ ] CSV headers are checked.
- [ ] Malformed records are handled safely.
- [ ] Original evidence remains unchanged.
- [ ] SQL queries use parameterized values.
- [ ] Dynamic sorting uses allowlists.
- [ ] Imported data is rendered safely.
- [ ] Untrusted values cannot become executable HTML.
- [ ] CSV exports mitigate formula injection.
- [ ] Search and pagination have reasonable limits.
- [ ] Invalid input produces controlled errors.
- [ ] Security tests pass.

**Ownership boundary:** Member 2 owns input and data-processing security. Member 1 owns access authorization, while Member 3 coordinates application-wide HTTP protections.