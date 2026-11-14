# SHADOWTRACE — SECURITY-3
## API Protection, Application Security & Abuse Prevention

**Security Owner:** Member 3  
**Related Features:** Rule-Based Detection Engine; Findings Management  
**Security Scope:** API protection, CSRF, CORS, rate limiting, security headers, application errors, resource exhaustion and security monitoring.

---

## 1. Objective

Member 3 is responsible for protecting ShadowTrace's API and application runtime against unauthorized requests, request abuse, unsafe browser interactions and resource exhaustion.

The objective is to ensure that:

- API endpoints are protected.
- Requests are validated and bounded.
- Cross-site request forgery is mitigated.
- CORS is restrictive.
- Security headers are configured.
- Expensive operations cannot be triggered without reasonable limits.
- Error responses do not reveal internal information.
- Detection operations cannot exhaust application resources.

Member 3 must coordinate with Member 1 for authentication and authorization, and Member 4 for production configuration.

## 2. API Security Review

Review every existing and newly created API endpoint.

Requirements:

- Protect sensitive endpoints with authentication.
- Apply authorization through Member 1's shared controls.
- Validate HTTP methods.
- Validate content types.
- Validate request bodies.
- Enforce request-size limits.
- Apply pagination limits.
- Return consistent error responses.
- Avoid exposing stack traces.
- Avoid returning internal filesystem paths.
- Avoid exposing secrets or sensitive configuration.

Never assume that an API is protected because its corresponding frontend page is hidden.

## 3. CSRF Protection

If ShadowTrace uses cookie-based authentication, protect state-changing requests against Cross-Site Request Forgery.

Requirements:

- Use an established Flask-compatible CSRF protection library or a properly implemented framework-supported mechanism.
- Protect state-changing requests such as POST, PUT, PATCH and DELETE.
- Validate CSRF tokens server-side.
- Include tokens correctly in frontend requests.
- Reject missing or invalid tokens.
- Keep CSRF protection compatible with the application's session configuration.
- Do not disable CSRF globally to resolve frontend integration problems.

GET requests must not perform state-changing operations.

CSRF protection is required even when SameSite cookie settings are enabled.

## 4. CORS Configuration

ShadowTrace should use a same-origin deployment by default.

Requirements:

- Do not enable unrestricted cross-origin access.
- Do not use wildcard origins unnecessarily.
- Allow only explicitly approved frontend origins when cross-origin access is genuinely needed.
- Avoid allowing credentials for arbitrary origins.
- Restrict allowed HTTP methods.
- Restrict allowed request headers.
- Keep development origins separate from production origins.
- Review CORS configuration whenever deployment domains change.

Important:

CORS is a browser access-control mechanism. It is not authentication and does not prevent direct API requests from non-browser clients.

Do not treat CORS as a replacement for backend authorization.

## 5. Rate Limiting

Add reasonable rate limits to endpoints that may be abused.

Priority endpoints:

- Login attempts, coordinated with Member 1.
- Authentication-related endpoints.
- Investigation creation.
- Evidence processing.
- Detection execution.
- Report generation.
- Export endpoints.
- Expensive search operations.

Requirements:

- Use an established Flask-compatible rate-limiting implementation if approved.
- Define limits according to the operation's expected usage.
- Return HTTP 429 when limits are exceeded.
- Provide a reasonable retry message where appropriate.
- Avoid unnecessarily restrictive limits that prevent normal project demonstrations.
- Consider the deployment's trusted proxy configuration before relying on client IP addresses.
- Do not trust arbitrary forwarded-IP headers.

For a multi-user deployment, rate limiting should not depend only on an unverified client-supplied identity.

If a distributed deployment is introduced, evaluate an appropriate shared rate-limit storage backend rather than assuming in-memory limits work across multiple application processes.

## 6. Detection Engine Resource Protection

Detection operations may become expensive when processing large event collections.

Requirements:

- Restrict analysis to the selected authorized investigation.
- Apply reasonable dataset and processing limits.
- Prevent uncontrolled simultaneous analysis requests.
- Avoid duplicate processing when the same request is submitted repeatedly.
- Track analysis-run status.
- Handle processing failures safely.
- Avoid loading unnecessarily large datasets into memory.
- Use bounded queries.
- Record useful execution summaries.

Do not allow an ordinary API request to trigger unlimited or unbounded analysis work.

## 7. Report and Export Abuse Prevention

Report and export endpoints must be bounded.

Requirements:

- Verify investigation access.
- Restrict export scope to the requested investigation.
- Apply reasonable response-size limits.
- Prevent uncontrolled repeated report generation.
- Avoid expensive unnecessary database queries.
- Return safe filenames.
- Set appropriate content types.
- Prevent user input from controlling filesystem paths.
- Coordinate CSV export safety with Member 2.

## 8. Security Headers

Configure appropriate HTTP security headers.

Review and implement:

### Content-Security-Policy (CSP)

Define a policy that restricts script, style, image, font and other resource sources.

The current application uses external resources such as Chart.js, Lucide-related assets if externally loaded, and Google Fonts. Inspect actual loading behavior before finalizing the policy.

Prefer self-hosting dependencies where practical.

Do not weaken the entire CSP simply to make one external resource work.

Avoid unsafe inline script allowances where practical. If inline code must remain, evaluate nonce- or hash-based policies.

### Other Headers

Evaluate:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `X-Frame-Options` or an appropriate CSP `frame-ancestors` directive.
- `Permissions-Policy`
- `Strict-Transport-Security` for HTTPS production deployment only.

Do not enable HSTS before HTTPS is properly deployed and verified.

Avoid setting contradictory security headers in multiple places.

## 9. Error Handling

API errors must not reveal:

- Python stack traces.
- Secret values.
- Database credentials.
- Absolute filesystem paths.
- Internal configuration.
- Sensitive raw evidence content.
- Session information.

Requirements:

- Use the approved JSON error envelope.
- Log useful internal diagnostics safely.
- Return readable messages.
- Use appropriate HTTP status codes.
- Handle unexpected exceptions centrally.
- Keep debug details restricted to local development.

## 10. Logging and Monitoring

Coordinate with Member 4 to record security-relevant events.

Examples:

- Repeated failed login attempts.
- Unauthorized access attempts.
- CSRF validation failures.
- Rate-limit events.
- Repeated invalid requests.
- Unexpected application errors.
- Repeated analysis failures.

Requirements:

- Avoid logging passwords, cookies, tokens or API keys.
- Avoid unnecessarily logging complete raw evidence records.
- Sanitize untrusted log fields.
- Use timestamps consistently.
- Avoid allowing attacker-controlled text to forge log entries.
- Keep logs useful for debugging and review.

## 11. Request and Resource Limits

Review application-wide limits for:

- HTTP request bodies.
- CSV uploads, coordinated with Member 1 and Member 4.
- Search result counts.
- Pagination.
- Analysis operations.
- Report generation.
- Export sizes.
- Request processing time.

Set practical limits based on the actual project and available system resources.

Avoid accepting arbitrarily large or expensive requests.

## 12. Security Testing

Member 3 must test:

- Unauthorized API access.
- Missing authentication.
- Invalid CSRF tokens.
- Missing CSRF tokens.
- Unapproved CORS origins.
- Excessive API requests.
- HTTP 429 behavior.
- Invalid HTTP methods.
- Invalid content types.
- Oversized request bodies.
- Repeated analysis requests.
- Large search queries.
- Unexpected server exceptions.
- Security headers on application responses.
- Safe API error responses.

Use a local test environment and synthetic data.

## 13. Deliverables

Member 3 must deliver:

1. API security review.
2. CSRF protection.
3. Restrictive CORS configuration.
4. Rate limiting.
5. Detection and export resource limits.
6. Security headers.
7. Centralized safe error handling.
8. Security event logging integration.
9. API security tests.
10. Documentation of endpoint protections.

## 14. Acceptance Criteria

- [ ] Sensitive API endpoints require authentication.
- [ ] Authorization uses the shared Member 1 controls.
- [ ] State-changing cookie-authenticated requests have CSRF protection.
- [ ] GET requests do not change application state.
- [ ] CORS is restrictive and documented.
- [ ] Rate limits exist on sensitive and expensive operations.
- [ ] Excessive requests receive controlled responses.
- [ ] Analysis operations are bounded.
- [ ] Reports and exports are protected and bounded.
- [ ] Security headers are configured and tested.
- [ ] API errors do not expose sensitive internals.
- [ ] Logs do not contain credentials or session secrets.
- [ ] Security tests pass.

**Ownership boundary:** Member 3 owns API-level security controls and abuse prevention. Authentication and permissions must use Member 1's shared implementation. Production HTTPS and deployment settings are coordinated with Member 4.