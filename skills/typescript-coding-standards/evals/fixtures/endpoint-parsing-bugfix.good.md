## Boundary change

Do not pass raw DTOs or add another truthy check. Parse the touched boundary for both `email` and `displayName`, then pass domain/refined type values into service and persistence.

Use `EmailAddress` and `DisplayName` smart constructors. Each parser should return a typed error, for example `Result<DisplayName, ParseDisplayNameError>`, not throw for expected invalid input.

Keep blast radius local: translate at the existing framework boundary into the current HTTP error shape instead of migrating the whole endpoint stack.

## Tests

Cover valid input reaching persistence, missing/invalid `displayName`, and the framework translation of typed errors.
