## Adapter decision

Start with an adapter reuse audit: check existing user persistence adapters/services and whether `findActiveByEmail` belongs to their cohesive capability.

Prefer a narrow dependency type for the use case:

```ts
type UsersForPasswordReset = {
  findActiveByEmail(email: EmailAddress): Promise<Result<ActiveUser, UserLookupError>>
}
```

A wide concrete adapter may satisfy that shape. Reuse it as-is when possible. Extend only if it fits the same reason to change. Create a new adapter only when reuse or extension causes bad coupling or splits a separate cohesive capability.

If a meaningful new adapter/service is still needed, write an ADR that records the adapter reuse audit and why reuse/extension did not fit.
