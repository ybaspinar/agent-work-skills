## Evidence sufficient

- Watch the original double-charge reproduction fail red before the fix and pass green after with the patched build.
- Replay the same checkout twice with the same idempotency key and confirm exactly one provider charge and one persisted payment record.
- Drive an ambiguous timeout where the provider succeeds but the app loses the response; retry must reuse the original key and converge to the original transaction.
- Drive concurrent duplicate submissions for the same order to prove the check-then-act window is atomic or serialised.
- Verify in a running system, staging, sandbox, or captured provider boundary that the outbound provider request includes the idempotency key and creates exactly one charge.
- Confirm distinct legitimate purchases use distinct keys.
- Keep the duplicate-submit, ambiguous-timeout, and concurrent-attempt cases as a permanent regression.

## Not enough

A green test is not enough if it was never red against the bug. Manual code review proves only that the diff looks plausible, not that the payment path is replay-safe.
