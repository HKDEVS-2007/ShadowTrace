# SHADOWTRACE — SECURITY-4
## File Storage, Deployment, HTTPS & Operational Security

**Security Owner:** Member 4  
**Related Features:** Investigation Reports & Export; Audit Trail & Activity History  
**Security Scope:** Secure file storage, production configuration, HTTPS, deployment hardening, backups, database protection, audit integrity and operational security.

---

## 1. Objective

Member 4 is responsible for protecting ShadowTrace's stored data and production deployment.

The objective is to ensure that:

- Uploaded evidence is stored safely.
- Files cannot escape the intended storage directory.
- The production application does not run in debug mode.
- HTTPS is enforced for production access.
- Database files and backups are protected.
- Reports and exports do not expose unintended data.
- Operational logs and audit records are handled safely.
- Production configuration is separated from development configuration.

Member 4 must coordinate with Members 1, 2 and 3 because deployment security depends on authentication, input handling and API protection.

## 2. Secure File Storage

ShadowTrace accepts CSV evidence files.

Requirements:

- Store uploaded files outside the publicly accessible static directory.
- Use a dedicated configured storage directory.
- Generate server-side filenames.
- Never trust the original filename as a storage path.
- Prevent path traversal.
- Restrict accepted extensions.
- Validate file content and readability.
- Enforce the 16 MB upload limit on the backend.
- Never execute uploaded files.
- Restrict filesystem permissions.
- Avoid exposing internal storage paths through the API.
- Associate each stored file with the correct investigation and evidence record.

### 2.1 Storage Path Protection

Use a controlled storage root configured by the application.

Requirements:

- Resolve and validate storage paths.
- Ensure generated paths remain inside the approved storage directory.
- Reject unexpected path separators and traversal attempts in any user-controlled path input.
- Do not allow users to select arbitrary server filesystem paths.
- Do not construct storage paths directly from uploaded filenames.

### 2.2 File and Database Consistency

A file upload may involve both filesystem and database operations.

Handle failures carefully:

- If storage succeeds but database recording fails, clean up the newly stored file where safe.
- If a database record exists but the file is missing, report an integrity or storage error.
- Avoid orphaned files.
- Avoid deleting files that belong to other evidence records.
- Coordinate cleanup behavior with Member 1.

## 3. SHA-256 Evidence Verification

Coordinate with Member 1 to ensure that evidence integrity metadata is handled consistently.

Requirements:

- Preserve the recorded SHA-256 hash.
- Verify stored bytes against the recorded hash when an integrity check is requested.
- Display clear verification status.
- Record verification timestamps if supported.
- Do not silently overwrite the original hash.
- Treat a mismatch as an integrity warning requiring review.

Important:

A successful hash match confirms that the checked file bytes match the recorded hash. It does not prove the file's original source or legal authenticity.

## 4. Production Configuration

Create and verify separate development and production configurations.

Production requirements:

- Debug mode disabled.
- Production secret key supplied securely.
- No hardcoded fallback secrets.
- Database path explicitly configured.
- Upload storage path explicitly configured.
- Appropriate request-size limits.
- Detailed error pages disabled.
- Development-only routes disabled.
- Production dependencies reviewed.
- Application startup configuration validated.

### 4.1 Debug Mode

Production must never run with Flask debug mode enabled.

Requirements:

- Do not use `debug=True` in production.
- Do not expose interactive debugger pages.
- Do not expose development stack traces to users.
- Use a production-appropriate WSGI server when deploying beyond local development.
- Do not use Flask's development server as a public production server.

### 4.2 Configuration Review

Verify actual production settings instead of assuming they are correct.

Check:

- Debug setting.
- Secret-key source.
- Database path.
- Upload path.
- Allowed frontend origins.
- Cookie security settings.
- HTTPS configuration.
- Logging configuration.
- Request-size limits.
- Dependency versions.

Member 1 owns secret validation. Member 4 owns deployment configuration verification.

## 5. HTTPS and Transport Security

For any production deployment accessible over a network, HTTPS must be enabled.

Requirements:

- Use a valid TLS certificate.
- Configure the web server or approved reverse proxy for HTTPS.
- Redirect HTTP requests to HTTPS.
- Avoid sending credentials over plaintext HTTP.
- Avoid serving sensitive application data over plaintext HTTP.
- Enable HSTS only after HTTPS is correctly configured and verified.
- Verify certificate validity and renewal procedures.

If ShadowTrace is used strictly on localhost during development, local HTTP may be acceptable.

For LAN or internet-facing production access, use an appropriately configured HTTPS deployment. Do not assume that a private network is automatically trusted.

## 6. Secure Cookie and Session Deployment

Coordinate with Member 1.

Production session cookies must use appropriate settings:

- `HttpOnly`
- `Secure`
- Appropriate `SameSite` policy.

Verify:

- Cookies are not exposed to JavaScript unnecessarily.
- Cookies are not transmitted over HTTP.
- Session expiration is appropriate.
- Logout invalidates the session.
- Cookie settings do not conflict with CSRF protection.

Member 4 must test the deployed configuration, while Member 1 owns the authentication/session implementation.

## 7. SQLite Database Security

The database may contain investigation details, evidence metadata, events, findings and audit records.

Requirements:

- Store the database outside the public static directory.
- Restrict filesystem access to the application account and authorized operators.
- Do not expose database files through a download route.
- Do not commit production database files to Git.
- Enable SQLite foreign-key enforcement.
- Use safe database access patterns.
- Keep backups protected.
- Avoid leaving temporary database copies in public folders.
- Review database file and directory permissions.

Coordinate database integrity and migration checks with all members.

## 8. Backup and Recovery

Define a practical backup procedure.

Requirements:

- Back up the SQLite database using a safe SQLite-aware backup approach.
- Include evidence files when they must be retained.
- Keep backups outside public directories.
- Restrict access to backup files.
- Avoid committing backups to Git.
- Document backup frequency.
- Document retention periods.
- Test restoration periodically.
- Verify that restored database records still reference available evidence files.

A backup that has never been tested for restoration must not be described as a verified recovery solution.

## 9. Report and Export Security

Coordinate with Member 2 and ensure:

- Reports are restricted to authorized users.
- Exports are scoped to the correct investigation.
- Export filenames are generated safely.
- User-provided filenames cannot control filesystem paths.
- Temporary report files are stored outside public directories.
- Temporary files are cleaned up appropriately.
- Responses use appropriate content types.
- Sensitive internal paths are not exposed.
- CSV formula-injection protections from Member 2 are preserved.

Do not expose reports through guessable public URLs without authorization.

## 10. Audit Trail Security

Member 4 owns the audit trail implementation.

Record important activities:

- Investigation created or updated.
- Evidence uploaded.
- Evidence integrity verified.
- Processing completed.
- Detection analysis executed.
- Finding status changed.
- Report generated.
- Important administrative actions.
- Authentication-related events, in coordination with Member 1.

Recommended audit metadata:

- Activity ID.
- Investigation ID.
- Actor/user ID where available.
- Action type.
- Description.
- Timestamp.
- Related record ID.

Requirements:

- Avoid logging passwords, tokens or session cookies.
- Avoid unnecessary raw evidence content.
- Sanitize untrusted text before writing log entries.
- Restrict audit history access.
- Avoid allowing ordinary users to modify audit records.
- Record failures where useful.
- Preserve relevant historical context.

The application-level audit trail is not automatically tamper-proof. Do not claim cryptographic immutability unless a separately designed and tested mechanism provides it.

## 11. Dependency and Package Security

Review Python dependencies and deployment packages.

Requirements:

- Keep a documented dependency list.
- Avoid unnecessary dependencies.
- Use maintained versions.
- Review security advisories for important dependencies.
- Remove unused packages.
- Avoid installing packages from untrusted sources.
- Keep dependency versions controlled.
- Review changes before upgrading production dependencies.

Run an appropriate dependency vulnerability scan during development and before release.

Do not assume that a clean scan guarantees the application is secure.

## 12. Git and Repository Security

Perform a final repository security review.

Check for:

- `.env` files.
- API keys.
- Flask secret keys.
- Database credentials.
- Private tokens.
- Production database files.
- Uploaded evidence.
- Backups.
- Temporary exports.
- Debug logs.
- Sensitive configuration.

Requirements:

- Ensure `.gitignore` excludes sensitive files.
- Review tracked files, not just ignored files.
- Review staged files before committing.
- Review repository history if a secret was previously committed.
- Rotate exposed credentials.
- Do not rely on deleting a secret from the latest commit alone.

Coordinate secret management with Member 1.

## 13. Spend and External Service Limits

The confirmed ShadowTrace stack does not currently require a paid cloud API.

Therefore:

- Do not introduce paid external services without team approval.
- Do not store payment credentials in the repository.
- If a paid API or cloud service is introduced later, configure a spending budget or usage cap where supported.
- Configure usage alerts.
- Restrict API credentials to the minimum required permissions.
- Monitor usage.
- Document who owns the account and billing configuration.
- Avoid uncontrolled paid requests from application endpoints.

A spending cap is conditional on the external provider supporting it. An alert is not necessarily a hard spending limit.

## 14. Deployment Checklist

Before any production or shared-network deployment, verify:

- Debug mode is disabled.
- Production secret key is configured securely.
- Environment variables are validated.
- HTTPS is active.
- HTTP redirects to HTTPS.
- Secure cookie settings are enabled.
- CSRF protection is active.
- CORS is restrictive.
- Security headers are present.
- Authentication is enforced.
- Authorization is enforced.
- Admin routes are protected.
- Upload limits are enforced.
- Files are stored outside public directories.
- Database permissions are restricted.
- Backups are protected.
- Error pages do not expose internals.
- Logs do not contain secrets.
- Dependencies have been reviewed.

## 15. Required Security Tests

Member 4 must test:

- Attempted access to the upload storage directory through a web URL.
- Path traversal attempts using harmless test filenames.
- Filesystem permission restrictions.
- Missing stored evidence files.
- Evidence hash mismatch handling.
- Database file exposure checks.
- Backup creation and restoration.
- Report access without authorization.
- Production debug setting.
- HTTPS redirect behavior.
- Certificate validity.
- Secure cookie flags in production.
- Security headers on deployed responses.
- Secret and sensitive-file checks in Git.
- Dependency vulnerability review.
- Temporary export cleanup.

## 16. Deliverables

Member 4 must deliver:

1. Secure evidence storage configuration.
2. Filesystem permission review.
3. Evidence integrity verification integration.
4. Production configuration checklist.
5. HTTPS deployment configuration.
6. Production cookie/security-setting verification.
7. SQLite storage protection.
8. Backup and restoration documentation.
9. Secure report/export storage.
10. Audit trail implementation.
11. Dependency and Git security review.
12. Final deployment security report.

## 17. Acceptance Criteria

- [ ] Evidence is stored outside public directories.
- [ ] Uploaded filenames cannot control storage paths.
- [ ] Storage permissions are restricted.
- [ ] Evidence integrity checks work.
- [ ] SQLite database files are not publicly accessible.
- [ ] Production debug mode is disabled.
- [ ] Production secrets are supplied securely.
- [ ] HTTPS is configured for production network access.
- [ ] HTTP redirects to HTTPS.
- [ ] Production cookies have appropriate security flags.
- [ ] Backups are protected and restoration is tested.
- [ ] Reports and exports require authorization.
- [ ] Audit records are access-controlled.
- [ ] No sensitive files or credentials are committed to Git.
- [ ] Dependencies have been reviewed.
- [ ] Security deployment tests pass.

**Ownership boundary:** Member 4 owns file-storage, audit, backup and deployment security. Authentication and permissions remain under Member 1; CSV and export-content safety remain coordinated with Member 2; API protections remain coordinated with Member 3.