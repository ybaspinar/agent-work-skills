## Review assessment
The happy path exists, but the feature leaves export-state ownership and failure transitions implicit across the controller and service.

## Material concerns
- `src/report-export/ExportController.ts:20-71` — `[Boundary/ownership]` The feature creates storage, notification, and export-state responsibilities but gives the controller and service competing ownership. Give export transitions a single owner and inject narrow storage and notification boundaries so the interaction and failure policy are locally visible and testable.
- `src/report-export/Export.ts:3-12` — `[State model]` Raw status strings and undefined failure transitions leave the new state machine implicit. Define an explicit transition model with allowed transitions and terminal failure states so invalid transitions cannot silently become API behavior.
- `test/report-export.test.ts:1-34` — Happy-path coverage does not protect the new observable contract. Add a contract test for successful export and each material failure transition, asserting persisted state and whether storage or notification effects occurred.
