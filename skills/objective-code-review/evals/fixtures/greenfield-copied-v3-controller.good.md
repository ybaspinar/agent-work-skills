Decision: Request changes

Blocking
- `src/controllers/OrdersV3Controller.ts:1` — `[Semantic integrity / Copy residue]` The `V3` name imports copied history into a greenfield contract even though this project has no V1, V2, or external V3 contract. The first controller establishes a misleading public pattern, amplifying the defect into future controllers, routes, documentation, and tests. Rename it to the unversioned controller name, or identify the real compatibility contract that makes V3 truthful.
