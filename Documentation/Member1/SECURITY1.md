# SHADOWTRACE — SECURITY-1
## Identity, Authentication, Authorization & Secrets Management

**Security Owner:** Member 1  
**Related Features:** Investigation Management; Evidence Upload & Integrity Verification  
**Security Scope:** User identity, login security, session management, permissions, protected routes, administrative access and application secrets.

---

## 1. Objective

Member 1 is responsible for implementing and verifying the identity and access-control foundation of ShadowTrace.

The objective is to ensure that:

- Only authenticated users can access protected application functionality.
- Users can only access investigations and records they are authorized to access.
- Administrative functionality is restricted.
- Passwords and authentication secrets are never stored or exposed insecurely.
- Session management follows secure practices.
- Unauthorized users cannot bypass frontend restrictions by directly calling backend APIs.

Authentication and authorization must be enforced on the Flask backend. Hiding buttons in JavaScript is not security.

## 2. Authentication

### 2.1 Login System

Implement a secure authentication system if the application is intended for multiple users or protected access.

Requirements:

- Provide a login interface consistent with the existing ShadowTrace UI.
- Authenticate users through Flask backend routes.
- Validate credentials on the server.
- Never trust a username or user ID supplied by the frontend as proof of identity.
- Do not store plaintext passwords.
- Do not expose password hashes through API responses.
- Return generic login failure messages that do not reveal whether an account exists.
- Apply login attempt throttling.
- Record relevant authentication events without logging passwords.

### 2.2 Password Storage

Use a recognized password-hashing implementation such as Argon2id or an appropriately configured bcrypt implementation.

Requirements:

- Use a unique salt per password through the hashing library.
- Never implement a custom password-hashing algorithm.
- Never use plain SHA-256 for password storage.
- Never store plaintext passwords.
- Never return password hashes to the browser.
- Support password changes securely if that feature is included.

### 2.3 Password Policy

Establish a reasonable password policy:

- Require sufficiently long passwords.
- Permit password managers and passphrases.
- Avoid unnecessary character-composition restrictions.
- Reject commonly compromised or extremely weak passwords where practical.
- Do not log passwords or password-reset tokens.

Account recovery must use a properly designed verification process if it is implemented. Do not create an insecure password-reset endpoint simply to complete the login flow.

## 3. Authorization and User Permissions

Authentication answers: "Who is the user?"

Authorization answers: "What is this user allowed to do?"

Both must be implemented.

### 3.1 Backend Authorization

Every protected route must verify:

1. The user has an authenticated session.
2. The requested operation is permitted.
3. The requested resource belongs to an investigation the user can access.
4. The user's role or permission allows the operation.

Do not rely on:

- Hidden navigation items.
- Disabled buttons.
- JavaScript checks.
- User IDs submitted in request bodies.
- Investigation IDs supplied by the browser without server-side verification.

### 3.2 Proposed Role Model

The final roles and permissions must be approved by the team before implementation.

A possible baseline:

| Role | Suggested permissions |
|---|---|
| Administrator | User management, system configuration and approved administrative actions |
| Analyst | Create and manage permitted investigations, review events and findings |
| Viewer | Read-only access to authorized investigation data |

If ShadowTrace is initially deployed for a single trusted operator, avoid introducing unnecessary role complexity. Still maintain backend authorization boundaries so multi-user access can be added safely.

### 3.3 Administrative Routes

All administrative routes must have explicit backend protection.

Examples of protected operations:

- User management.
- Role changes.
- Account activation or deactivation.
- Security configuration.
- Administrative exports.
- Sensitive application settings.

Requirements:

- Verify authentication.
- Verify administrator permission.
- Reject unauthorized requests with appropriate HTTP status codes.
- Record important administrative actions in the audit trail.
- Do not expose administrative functionality through an unprotected API.

## 4. Investigation-Level Access Control

Investigation data must not be accessible simply because a user knows its ID.

For every investigation-related request:

- Resolve the authenticated user from the server-side session.
- Verify that the user can access the investigation.
- Verify that evidence belongs to the requested investigation.
- Verify that events, findings and reports belong to the appropriate investigation.
- Reject cross-investigation resource access.
- Avoid trusting frontend-supplied ownership information.

This prevents insecure direct object reference (IDOR) vulnerabilities.

## 5. Session Security

Use secure server-managed sessions.

Requirements:

- Use a strong, randomly generated Flask secret key.
- Keep the secret key outside source code.
- Regenerate or replace the session identifier after successful login.
- Clear the session during logout.
- Invalidate sessions appropriately after password or security-sensitive changes.
- Apply reasonable session expiration.
- Avoid unnecessarily long-lived sessions.
- Do not store passwords, access tokens or secret keys in browser local storage.

### 5.1 Secure Cookie Settings

For production HTTPS deployment, configure session cookies with:

- `HttpOnly = True`
- `Secure = True`
- `SameSite = Lax` or a stricter compatible policy.

Cookie settings must be tested with the application's actual login, logout and CSRF implementation.

Do not enable `Secure` cookies in a way that accidentally prevents a plain HTTP local development environment from working. Production must use HTTPS.

## 6. API Key and Secret Protection

Member 1 owns the initial secrets-management review.

Search the repository and Git history for accidentally committed:

- Flask secret keys.
- API keys.
- Database credentials.
- SMTP credentials.
- Cloud credentials.
- Private tokens.
- Signing keys.
- Development credentials.

Requirements:

- Keep secrets in environment variables or an approved secret-management mechanism.
- Use a `.env` file only for local development where appropriate.
- Add `.env` and secret-bearing files to `.gitignore`.
- Provide a `.env.example` containing variable names and safe placeholders only.
- Never put real credentials in `.env.example`.
- Never hardcode secrets in Python, JavaScript, HTML or configuration files.
- Never expose secrets through frontend JavaScript or API responses.
- Rotate a secret if it has been exposed.

**Important:** Removing a secret from the latest source file does not remove it from Git history. Exposed credentials must be revoked or rotated.

## 7. Environment Variable Validation

Check all security-critical environment variables during application startup.

Examples:

- `FLASK_SECRET_KEY`
- `FLASK_ENV` or the chosen deployment-mode configuration.
- `DATABASE_PATH`
- `UPLOAD_FOLDER`
- `MAX_CONTENT_LENGTH`
- Any future external service credentials.

Requirements:

- Fail safely if a required production secret is missing.
- Never silently fall back to a known default production secret.
- Never print secret values in logs.
- Validate configuration types and allowed values.
- Keep development and production configurations separate.

Do not assume that a variable exists merely because it is documented. Inspect actual configuration loading.

## 8. Security Audit Events

Coordinate with Member 4 to record:

- Successful login.
- Failed login attempts, with sensible aggregation.
- Logout.
- Account creation.
- Role changes.
- Account activation/deactivation.
- Sensitive administrative actions.
- Password changes, without recording the password itself.

Avoid logging session cookies, authentication tokens, passwords or secret values.

## 9. Required Security Tests

Member 1 must test:

- Unauthenticated access to protected pages and APIs.
- Unauthenticated access to investigation records.
- Unauthorized administrative requests.
- Viewer attempting a restricted action.
- Analyst attempting an administrator-only action.
- Access to another user's or unauthorized investigation's records.
- Session invalidation after logout.
- Session rotation after login.
- Missing production secret configuration.
- Accidental exposure of secrets in API responses.
- Password hashing and verification.
- Login throttling behavior.

## 10. Deliverables

Member 1 must deliver:

1. Secure authentication implementation, if enabled for the deployment.
2. Backend authorization middleware/decorators.
3. Investigation-level permission checks.
4. Protected administrative routes.
5. Secure session configuration.
6. Environment variable validation.
7. Secret-handling documentation.
8. Authentication and authorization tests.
9. Security integration notes for other members.

## 11. Acceptance Criteria

- [ ] Passwords are never stored in plaintext.
- [ ] Authentication is enforced by the backend.
- [ ] Protected routes reject unauthenticated requests.
- [ ] Administrative routes require explicit permission.
- [ ] Investigation ownership/access is checked server-side.
- [ ] Cross-investigation access is rejected.
- [ ] Session cookies use appropriate production security settings.
- [ ] Logout invalidates the session.
- [ ] No real secrets are committed to Git.
- [ ] Production configuration does not use a default secret.
- [ ] Authentication-related events are appropriately audited.
- [ ] Security tests pass.

**Ownership boundary:** Member 1 owns the identity and access-control foundation. Other members must integrate their routes with these controls rather than implementing separate authentication systems.