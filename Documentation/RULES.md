# ShadowTrace Team Rules

## 1. Non-Negotiable Project Rules

1. Use only the agreed technology stack: HTML5, CSS3, Vanilla JavaScript, Python, Flask and SQLite.
2. Do not introduce React, Vue, Angular, Node.js backend, ORM or a second database without unanimous team approval.
3. Preserve the accepted prototype and the Three Bugs visual identity and animations.
4. Read `ARCHITECTURE.md`, `DESIGN.md` and your assigned PRD before coding.
5. No module is complete until it is integrated, tested and reviewed.
6. Follow the existing project structure. Do not rebuild or restructure the application without team approval.

## 2. Team Ownership

Each member is responsible for developing, testing and maintaining their assigned modules.

### Member 1
- Dashboard & Analytics
- Investigation Management

### Member 2
- Evidence Management & CSV Import
- Log Analyzer & Event Explorer

### Member 3
- Threat Detection Engine
- Findings & Reports

### Shared Responsibilities

The following files and components are shared resources:

- Main HTML template and application shell.
- Base CSS and global JavaScript.
- Flask application entry point.
- Database schema and shared database helper.
- Shared API contracts and response formats.
- Common UI components and design tokens.

**Rule:** No member should independently modify shared resources without coordinating with the other members.

Each member must understand the API endpoints, database tables and data structures consumed by their modules.

## 3. Git Branching Strategy

### 3.1 Main Branch

`main` is the stable and integrated version of ShadowTrace.

Rules:
- Never develop features directly on `main`.
- Never commit directly to `main`.
- All changes must go through Pull Requests.
- Only tested and reviewed changes can be merged.
- Keep `main` runnable and stable.

### 3.2 Permanent Feature Branches

Create the following six feature branches from `main`:

| Branch Name | Owner | Module |
|---|---|---|
| `feature/member-1-dashboard` | Member 1 | Dashboard & Analytics |
| `feature/member-1-investigations` | Member 1 | Investigation Management |
| `feature/member-2-evidence` | Member 2 | Evidence Management |
| `feature/member-2-csv-import` | Member 2 | CSV Import, Log Analyzer & Event Explorer |
| `feature/member-3-detection` | Member 3 | Threat Detection Engine |
| `feature/member-3-reports` | Member 3 | Findings & Reports |

Each branch has one focused module responsibility.

A member may work on their two branches separately. Do not mix unrelated module changes in one feature branch or Pull Request.

### 3.3 Temporary Fix Branches

Use `fix/` branches only when correcting an existing bug.

Naming format:

`fix/short-description`

Examples:
- `fix/dashboard-refresh`
- `fix/csv-validation`
- `fix/login-error`
- `fix/chart-rendering`

These are temporary branches. After the fix is reviewed and merged, they can be deleted.

### 3.4 Documentation Branches

Use `docs/` branches for documentation-only changes.

Naming format:

`docs/topic`

Examples:
- `docs/api-documentation`
- `docs/setup-guide`
- `docs/database-schema`
- `docs/github-workflow`

These branches are also temporary and should be deleted after merging.

### 3.5 Branch Creation Commands

Create a feature branch from the latest `main`:

```bash
git switch main
git pull origin main
git switch -c feature/member-1-dashboard
```

Publish it to GitHub:

```bash
git push -u origin feature/member-1-dashboard
```

Replace the branch name with the assigned module branch.

### 3.6 Daily Development Workflow

Before starting work:

```bash
git switch main
git pull origin main
git switch feature/member-1-dashboard
```

Before committing:

```bash
git status
git add .
git commit -m "feat: implement dashboard analytics"
git push
```

Use meaningful commit messages:

- `feat:` New functionality.
- `fix:` Bug correction.
- `docs:` Documentation update.
- `style:` UI or CSS improvements.
- `refactor:` Internal code improvements.
- `test:` Test additions or updates.

### 3.7 Pull Request Workflow

When a module is ready:

1. Push the latest changes to its feature branch.
2. Open a Pull Request on GitHub.
3. Select `main` as the target branch.
4. Describe the purpose and functionality of the changes.
5. List modified files and test results.
6. Include screenshots for UI changes.
7. Mention API or database schema changes.
8. Request review from another team member.
9. Resolve feedback and merge after approval.
10. Delete the temporary branch after successful merging, if it is no longer needed.

**Important:** Pull the latest `main` and coordinate integration before merging. Resolve conflicts with the owner of the affected files. Never overwrite another member's changes blindly.

## 4. Code Standards

### Python
- Use meaningful `snake_case` names.
- Keep functions small and focused.
- Separate business logic into service modules instead of placing everything in Flask routes.
- Use parameterized SQL queries.
- Handle exceptions properly.

### JavaScript
- Use `const` and `let`.
- Use meaningful variable and function names.
- Prefer `async/await` for asynchronous operations.
- Use a centralized API helper where practical.
- Avoid unnecessary inline event handlers unless required by the existing architecture.

### CSS
- Reuse existing design tokens and component classes.
- Avoid global selectors that can break other modules.
- Namespace module-specific styles.
- Preserve existing animations and visual consistency.

### HTML
- Use semantic HTML elements.
- Include accessible labels and meaningful alternative text.
- Use correct button types.
- Support keyboard navigation and visible focus states.

### General
- Do not duplicate existing database helpers, parsers, API wrappers or design tokens.
- Follow the existing naming conventions and folder structure.

## 5. Security and Data Handling

1. Use fictional or explicitly authorized sample logs only.
2. Never commit secrets, API keys, passwords, personal data, real organization logs or live production database files.
3. Validate all input on the server.
4. Use parameterized SQL queries.
5. Enable SQLite foreign-key constraints.
6. Enforce upload extensions and file-size limits on the server.
7. Treat CSV fields as untrusted text.
8. Escape displayed output and protect CSV exports against formula injection.
9. Never expose stack traces, absolute paths or internal exception details to users.
10. Never execute uploaded files. ShadowTrace processes CSV files as data only.
11. Alerts are investigative leads for analyst review, not proof of compromise.

## 6. API and Database Rules

1. Agree on request and response structures before parallel implementation.
2. Use the shared JSON response format:

Success:

```json
{
  "ok": true,
  "data": {}
}
```

Error:

```json
{
  "ok": false,
  "error": {
    "message": "A descriptive error message"
  }
}
```

3. Use appropriate HTTP status codes.
4. Validate resource ownership. For example, an event or evidence file must belong to the requested investigation.
5. Database schema changes require:
   - A Pull Request.
   - A migration plan.
   - Agreement from all three members.
6. Never silently rename or delete existing API routes or database columns.
7. Preserve compatibility or update all affected consumers in one coordinated change.

## 7. UI and Animation Rules

The accepted prototype is the single source of truth for the application's visual design.

Preserve:

- Landing intro and Three Bugs branding.
- Bit, Glitch and Cipher characters.
- Background canvas, grid, glow orbs and scanline.
- Video branding and sidebar design.
- Existing cards, tables and navigation.
- Loader and toast behavior.
- Custom cursor behavior.
- Existing transitions and animations.

Additional rules:

1. New module screens must fit the existing application shell.
2. Reuse existing components and CSS tokens.
3. Motion must be smooth, purposeful and restrained.
4. Respect `prefers-reduced-motion`.
5. Do not introduce competing animation libraries or unnecessary animation loops.
6. Support keyboard navigation and touch interaction.
7. Do not make information unreadable through excessive glow, blur or motion.
8. Any major visual redesign requires team approval.

## 8. Definition of Done

A module is considered complete only when:

- Its assigned PRD acceptance criteria are satisfied.
- It works with the latest integrated `main`.
- It follows the agreed architecture and design.
- Normal, invalid, empty and boundary cases have been tested.
- Loading, empty, error and success states are implemented.
- No browser console errors or unhandled Flask errors remain.
- API and database integration work correctly.
- Relevant documentation and setup instructions are updated.
- The Pull Request has been reviewed and merged.
- No unresolved merge conflicts remain.

## 9. Final Team Agreement

All three members must follow these rules throughout ShadowTrace development.

No member should independently change the agreed technology stack, shared architecture, database schema, API contract or core visual identity.

**Our goal is one integrated, consistent and reliable ShadowTrace application — not three separate projects combined at the end.**