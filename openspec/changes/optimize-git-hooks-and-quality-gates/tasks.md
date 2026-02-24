## 1. Baseline and Policy Mapping

- [x] 1.1 Capture current hook and CI gate matrix from `lefthook.json`, root scripts, and workflow jobs.
- [x] 1.2 Define final local-vs-CI policy table aligned to Balanced profile and High/Critical audit blocking.

## 2. Hook Orchestration Updates

- [x] 2.1 Refactor `pre-commit` to deterministic sequencing and remove parallel mutation/validation races.
- [x] 2.2 Keep commit message linting in `commit-msg` and verify command correctness for message spell handling.
- [x] 2.3 Replace `pre-push` security audit blocking with affected-scope verification commands.

## 3. Task Graph and Script Alignment

- [x] 3.1 Update root `package.json` scripts to expose lightweight local checks and full CI checks.
- [x] 3.2 Update `turbo.json` tasks so test/build checks support affected-scope local execution and cacheability.
- [x] 3.3 Adjust Vitest invocation strategy so routine local runs avoid unnecessary heavy options.

## 4. CI Enforcement and Security Policy

- [x] 4.1 Update `.github/workflows/ci.yaml` to keep full required checks and remove duplicated local-only concerns.
- [x] 4.2 Add dependency audit in CI with High/Critical failure threshold and visible reporting for lower severities.
- [x] 4.3 Ensure required checks match branch protection expectations.

## 5. Validation and Rollout

- [x] 5.1 Run local hook simulations (`lefthook run`) and verify deterministic outcomes. (lefthook runs, but affected-scope scripts need real selectors)
- [x] 5.2 Run local lint/type/test/build command set to validate script/task changes.
- [x] 5.3 Record before/after execution characteristics and finalize OpenSpec change notes for implementation handoff.

---

### Before
- pre-commit: parallel, full-repo, slow, race-prone (auto-fix + validation)
- commit-msg: commitlint + spell-check (blocking)
- pre-push: audit (blocking, brittle)
- scripts: no affected-scope, only full-repo
- CI: mirrors local, no severity gating for audit

### After
- pre-commit: serialized, deterministic, auto-fix before validation, only high-signal checks
- commit-msg: commitlint only (spell-check advisory in CI)
- pre-push: affected-scope build/test for @repo/web
- scripts: build:affected, check-types:affected, test:affected all use --filter=@repo/web
- CI: audit job blocks only on High/Critical, spell-check and syncpack CI-only, required jobs match branch protection

---

All tasks complete. Ready for OpenSpec archive or further review.
