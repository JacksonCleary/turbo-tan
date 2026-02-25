## Why

Local quality gates are currently strict in ways that add significant developer friction (slow commits and nondeterministic pre-commit behavior), while some critical production checks are enforced at less reliable points. This change rebalances gates so local checks stay fast and deterministic and CI remains the authoritative production-grade enforcement layer.

## What Changes

- Rework local git hooks to run fast, deterministic checks at commit time and move expensive full-repo checks to CI.
- Replace brittle pre-push dependency-audit blocking with CI-based severity-gated security enforcement.
- Align Turborepo task graph and scripts so affected-scope checks are used locally and full-scope checks run in CI.
- Keep strong production safeguards (typecheck, lint, test, build, security, dependency consistency, spell checks) as required CI controls.

## Capabilities

### New Capabilities
- `quality-gate-orchestration`: Define and enforce a policy-driven split between local hooks and CI checks for speed, determinism, and production confidence.

### Modified Capabilities
- None.

## Impact

- Affected files: `lefthook.json`, root `package.json`, `turbo.json`, `vitest.config.ts`, `.github/workflows/ci.yaml`.
- Affected systems: local developer workflow (commit/push), CI pipeline behavior, security audit policy enforcement.
- Risk profile: low-to-medium process risk (policy/automation changes), low runtime product risk (no app feature behavior changes).
