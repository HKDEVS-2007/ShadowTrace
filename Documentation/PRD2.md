# ShadowTrace PRD 2 — Member 2
**Ownership:** Evidence Management & CSV Import; Log Analyzer & Event Explorer  
**Stack:** HTML5, CSS3, Vanilla JavaScript, Flask/Python, SQLite

## Mission
Own the evidence intake and normalized event browsing workflow. Accept only the documented CSV format, validate it, preserve evidence metadata, and make imported events searchable.

## Module 3 — Evidence Management & CSV Import
### Scope
- Upload CSV evidence to a selected investigation.
- Enforce `.csv` extension and configured maximum size (existing UI currently states 16 MB; backend must enforce the same or update both together).
- Validate required headers: `timestamp`, `source_ip`, `event_type`, `username`, `status`/`outcome` according to the final canonical schema.
- Handle UTF-8, header case differences, blank rows, malformed timestamps, missing fields, and invalid rows with a clear import summary.
- Calculate SHA-256 from the uploaded file bytes and store original filename, generated safe storage name (if retained), file size, hash, and import timestamp.
- Never trust the client filename as a filesystem path.
- Do not silently discard invalid records; report row numbers and reasons, with a safe cap on displayed errors.
- Use fictional or explicitly authorized logs only.

### Data model proposal
`evidence_files`: `id`, `investigation_id`, `original_name`, `stored_name` (optional), `sha256`, `size_bytes`, `imported_at`, `row_count`, `valid_count`, `invalid_count`, `status`.

### API proposal
- `POST /api/investigations/<id>/evidence` multipart field `file` → evidence metadata + import summary.
- `GET /api/investigations/<id>/evidence` → evidence list.
- Existing `/api/upload` may remain as a compatibility route; avoid breaking it. Agree on one canonical route and document the adapter/compatibility behavior.

## Module 4 — Log Analyzer & Event Explorer
### Scope
- Parse and normalize source rows into a canonical event shape.
- Canonical fields: `id`, `investigation_id`, `evidence_id`, `timestamp_utc`, `username`, `source_ip`, `event_type`, `outcome`, `raw_data_json`.
- Normalize timestamps to UTC ISO-8601 internally; display timezone explicitly in the UI.
- Sort by timestamp ascending/descending with stable tie-breaker.
- Search/filter by IP, username, event type, outcome/severity where applicable, evidence file, and time range.
- Paginate results server-side for larger datasets.
- Show raw source data only as safely escaped text; never inject imported values as HTML.
- Preserve the existing Log Analyzer table, filters, pagination, and pipeline feedback where possible.

### API proposal
- `GET /api/investigations/<id>/events?search=&username=&source_ip=&event_type=&from=&to=&page=1&page_size=50&sort=asc`
- Response: `{ok:true,data:{items:[...],pagination:{page,page_size,total,total_pages}}}`
- Existing `/api/logs` can be retained as a backward-compatible route if already used by the frontend.

## Acceptance criteria
1. Valid CSV imports and persists event rows linked to evidence and investigation.
2. Invalid file/header/timestamp cases return actionable validation details.
3. SHA-256 is reproducible from the uploaded bytes.
4. Filters combine correctly; pagination totals are accurate.
5. Event order is deterministic when timestamps match.
6. Re-importing the same file behavior is documented (allowed duplicate, warning, or deduplication); do not invent silent deduplication.
7. Upload size and extension are enforced server-side.
8. Import and event browsing work after Flask restart.

## Ownership boundaries
Member 2 owns upload/CSV/event browsing features. Detection rules belong to Member 3. Coordinate canonical event fields and schema migrations with all members before changing them.

## Tests
Valid CSV, empty CSV, missing headers, case-insensitive headers, invalid timestamp, blank row, oversized file, wrong extension, duplicate import policy, SHA-256, pagination, combined filters, same-timestamp ordering, and HTML-like input escaping.
