## Must fix

- Client-side validation is UX, not security; the server-side boundary must parse and reject malformed CSV, unauthorised actors, duplicate rows, and conflicts.
- Put hard bounded limits on file size and row count before parsing. Reject larger imports or move them to a background job / 202 flow with backpressure instead of synchronous unbounded work.
- Use an import id / idempotency key plus user uniqueness constraints so retries do not create duplicate users or duplicate welcome emails.
- Store a durable import record with created/skipped/failed counts and row-level failure reasons; a local failure file is not durable or private enough.
- Decouple welcome emails from user creation where possible. Record welcome emails status and avoid resend on retry.
- Emit failure metrics for parse rejects, row failures, retries, email failures, and duration so launch can be watched.
- Give the operational import artifact an owner and expiry/review date if this is a temporary launch cap.

## Can defer

- Large-file resumable upload, progress UI, custom column mapping, polished reports, and advanced email orchestration can wait if the launch version is bounded and observable.
- Full rollback tooling can wait if per-row outcomes are durable, idempotent, and recoverable by support.
