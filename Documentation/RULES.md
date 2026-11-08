# ShadowTrace Team Rules

## 1. Non-negotiable project rules
1. Use only the agreed stack: HTML5, CSS3, Vanilla JavaScript, Python, Flask and SQLite.
2. Do not introduce React, Vue, Angular, Node backend, ORM or a second database without unanimous approval.
3. Preserve the accepted prototype and the Three Bugs visual identity/animations.
4. Read `ARCHITECTURE.md`, `DESIGN.md`, and your assigned PRD before coding.
5. No module is complete until it is integrated, tested and reviewed.

## 2. Ownership
- Member 1: Dashboard & Analytics; Investigation Management.
- Member 2: Evidence Management & CSV Import; Log Analyzer & Event Explorer.
- Member 3: Threat Detection Engine; Findings & Reports.
- Shared files (main template, base CSS, global JS, app entry point, schema, shared database helper, API contract) require coordination before editing.
- Each member must review and understand the API/schema they consume.

## 3. Git workflow
- Keep `main` stable.
- Branch naming: `feature/member-1-dashboard`, `feature/member-2-csv-import`, `fix/short-description`, `docs/topic`.
- One focused feature per branch/PR.
- Pull latest integration branch before starting and before opening a PR.
- Never force-push shared branches or commit directly to `main`.
- PR description must include purpose, files changed, test commands/results, screenshots for UI changes, and migration/API impact.
- Resolve conflicts with the file owner; never overwrite another member's work blindly.
- Merge small changes frequently; do not wait until the end.

## 4. Code standards
- Python: meaningful snake_case names; small functions; service logic separate from Flask routes; parameterized SQL.
- JavaScript: `const`/`let`, meaningful names, async/await, centralized API helper where practical; no inline event handlers for new features unless existing architecture requires them.
- CSS: reuse existing tokens/classes; avoid global selectors that break other views; namespace module-specific styles.
- HTML: semantic elements, accessible labels, button types, keyboard focus and meaningful alt text.
- No duplicated parser, database connection helper, API wrapper or design tokens.

## 5. Security and data handling
- Use fictional or explicitly authorized sample logs only.
- Never commit secrets, API keys, passwords, personal data, real organization logs or live production database files.
- Validate all input on the server; frontend validation is usability only.
- Use parameterized SQL and enable SQLite foreign keys.
- Enforce upload extension and size on the server.
- Treat CSV fields as untrusted text; escape output and protect CSV exports from formula injection.
- Do not expose stack traces, absolute paths or internal exception details to users.
- Do not execute uploaded files. ShadowTrace processes CSV as data only.
- Alerts are leads for analyst review, not proof of compromise.

## 6. API and schema rules
- Agree on request/response shapes before parallel implementation.
- Use the shared `{ok,data}` / `{ok,error}` response envelope for JSON APIs.
- Use correct HTTP status codes.
- Validate resource ownership (e.g. event/evidence belongs to requested investigation).
- Schema changes require a PR, migration plan, and agreement from all three members.
- Do not silently rename/delete routes or columns; preserve compatibility or update all consumers in one coordinated PR.

## 7. UI and animation rules
- Existing base design is the single source of truth.
- Preserve landing intro, Bit/Glitch/Cipher characters, background canvas/grid/orbs/scanline, video branding, card motion, loader, toast and cursor behavior unless team approves a change.
- New module screens must fit the current shell and use existing components/tokens.
- Motion must be purposeful, smooth and restrained; respect `prefers-reduced-motion`.
- Do not add competing animation libraries or multiple animation loops.
- Every new view must work with keyboard navigation and touch; avoid hover-only actions.
- Do not make data unreadable through excessive glow, blur or motion.

## 8. Definition of Done
- Acceptance criteria in assigned PRD met.
- Works with current main branch and shared CSS/JS.
- Tested for normal, invalid, empty and boundary cases.
- No console errors or unhandled Flask errors.
- Loading/empty/error/success states included.
- README/setup instructions updated if needed.
- PR reviewed and merged; no unresolved conflicts.
