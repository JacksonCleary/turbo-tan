## Context

This monorepo uses Bun, Turborepo, Lefthook, Biome, Vitest, and GitHub Actions CI. Current quality gates over-index on pre-commit breadth and include parallelized commands that can produce nondeterministic behavior when one command mutates files while another validates them. CI already runs comprehensive checks, creating duplicated cost locally without additional reliability.

## Goals / Non-Goals

**Goals:**
- Rebalance gate placement so local hooks are fast, deterministic, and high signal.
- Preserve production-grade confidence by keeping comprehensive checks in CI as required gates.
- Implement severity-based dependency audit policy: block only High/Critical in CI.
- Improve task orchestration so local checks can run at affected scope.

**Non-Goals:**
- Changing application runtime behavior or user-facing features.
- Reducing CI required checks below production-grade baseline.
- Introducing new external build systems or replacing core tooling (Bun/Turbo/Lefthook).

## Decisions

1. Keep commit message linting as a local blocking check.
   - Rationale: Low runtime cost and high consistency value for changelog and review workflows.
   - Alternative considered: CI-only commitlint; rejected because failures are cheaper to catch locally.

2. Restrict pre-commit to deterministic, local-scope checks.
   - Rationale: Commit path must remain responsive and predictable.
   - Alternative considered: Keep full pre-commit suite; rejected due to excessive latency and flaky developer experience.

3. Move full-repo spell/dependency-consistency/security checks to CI-required jobs.
   - Rationale: These checks are broader in scope, more expensive, and more stable in controlled CI environments.
   - Alternative considered: Keep local blocking; rejected due to high false-friction in iterative workflows.

4. Enforce dependency audit thresholds in CI (High/Critical blocking).
   - Rationale: Aligns security posture with actionable risk while avoiding frequent non-critical disruption.
   - Alternative considered: Block all severities; rejected as too noisy for normal delivery cadence.

5. Prefer affected-scope execution for local pre-push checks.
   - Rationale: Maintains confidence while reducing unnecessary reruns across unaffected packages.
   - Alternative considered: Full-suite pre-push; rejected as redundant with CI full-suite enforcement.

## Risks / Trade-offs

- [Policy drift between hooks and CI] → Mitigation: Define scripts as shared command entrypoints and reference them from both hook and CI configs.
- [Undetected issues before push due to lighter pre-commit] → Mitigation: Strengthen pre-push impacted checks and keep CI required checks comprehensive.
- [Security findings not blocking at lower severities] → Mitigation: Keep reporting visibility and periodic review of severity policy.
- [Affected-scope misconfiguration could miss tasks] → Mitigation: Validate Turbo graph/task configuration and add CI full-suite backstop.

## Migration Plan

1. Update `lefthook.json` with deterministic hook ordering and revised check placement.
2. Align root scripts and Turbo tasks to support affected-scope local execution.
3. Update CI workflow to run full checks and thresholded audit policy.
4. Validate with local hook dry-runs and full CI execution.
5. If regression appears, rollback by restoring previous hook/CI definitions from version control.

## Open Questions

- Should commit-message spellcheck be retained as blocking, or moved to advisory CI output?
    - answer: commit-message spellcheck should be advisory
- Should pre-push include build only, test only, or both for impacted packages by default?
    - both
- Which specific audit command/flags are supported in current Bun version for severity filtering?

## Baseline Gate Matrix (Current)

| Stage | Source | Command | Purpose | Current Placement |
| --- | --- | --- | --- | --- |
| commit-msg | lefthook | `bun commitlint --edit {1}` | Enforce Conventional Commits format | Local blocking |
| commit-msg | lefthook | `bun cspell --no-summary --no-progress --language-id $1` | Commit-message spelling check | Local blocking |
| pre-commit | lefthook | `bun run check-types` | Type safety across workspace | Local blocking |
| pre-commit | lefthook | `bun editorconfig-checker` | EditorConfig compliance | Local blocking |
| pre-commit | lefthook | `bun lint --write` | Lint + auto-fix formatting/style issues | Local blocking |
| pre-commit | lefthook | `bun cspell .` | Full-repo spelling check | Local blocking |
| pre-commit | lefthook | `bun syncpack lint` | Dependency/version consistency checks | Local blocking |
| pre-commit | lefthook | `bun run test run` | Full test suite execution | Local blocking |
| pre-commit | lefthook | `bun validate-branch-name` | Branch naming convention validation | Local blocking |
| pre-push | lefthook | `bun audit` | Dependency vulnerability scan | Local blocking |
| CI job | GitHub Actions | `bun run build` | Full build verification | CI blocking |
| CI job | GitHub Actions | `bun check-types` | Type-check verification | CI blocking |
| CI job | GitHub Actions | `bun lint` | Lint verification without writing files | CI blocking |
| CI job | GitHub Actions | `bun run test run` | Full test verification | CI blocking |
| CI job | GitHub Actions | `bun cspell .` | Full-repo spelling verification | CI blocking |
| CI job | GitHub Actions | `bun syncpack lint` | Dependency consistency verification | CI blocking |
| CI job | GitHub Actions | `bun editorconfig-checker` | EditorConfig compliance verification | CI blocking |
| CI job | GitHub Actions | `bun validate-branch-name` | Branch naming convention validation | CI blocking |
| CI job | GitHub Actions | `bun commitlint ...` | Commit lint on push/PR range | CI blocking |

## Policy Table (Target - Balanced)

| Check Type | Local Commit-msg | Local Pre-commit | Local Pre-push | CI |
| --- | --- | --- | --- | --- |
| Commit format (`commitlint`) | Required | No | No | Required |
| Commit-message spelling | Advisory or remove local block | No | No | Advisory report preferred |
| Lint/format (changed scope) | No | Required | Optional | Required (full scope) |
| Type-check | No | Lightweight/affected preferred | Optional | Required (full scope) |
| Tests | No | No | Required (affected scope) | Required (full scope) |
| Build | No | No | Required (affected scope) | Required (full scope) |
| Spell-check (`cspell`) | No | No | No | Required (full scope) |
| Dependency consistency (`syncpack`) | No | No | No | Required |
| Branch-name validation | No | Optional (policy dependent) | Optional (policy dependent) | Required (if branch protections rely on it) |
| Security audit (`audit`) | No | No | No | Required, fail on High/Critical |

This policy table is the contract for implementation tasks 2-4.
