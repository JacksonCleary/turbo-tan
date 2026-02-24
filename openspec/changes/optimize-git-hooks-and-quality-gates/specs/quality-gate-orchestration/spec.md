## ADDED Requirements

### Requirement: Deterministic Local Hook Pipeline
The system SHALL execute local git hooks in a deterministic order that avoids concurrent mutation and validation races.

#### Scenario: Pre-commit runs without race conditions
- **WHEN** a developer creates a commit
- **THEN** auto-fix steps complete before dependent validation steps run

#### Scenario: Hook outcomes are reproducible
- **WHEN** the same staged change set is committed twice
- **THEN** hook pass/fail outcomes remain consistent across runs

### Requirement: Policy-Driven Local vs CI Enforcement
The system SHALL enforce lightweight, high-signal checks in local hooks and enforce full-scope quality checks in CI as required gates.

#### Scenario: Local checks remain focused
- **WHEN** a developer runs commit-time hooks
- **THEN** the hooks execute only checks designated as local policy checks

#### Scenario: CI remains production authority
- **WHEN** a pull request is validated in CI
- **THEN** full-scope quality checks are executed and must pass before merge

### Requirement: Severity-Gated Security Audit in CI
The system SHALL run dependency vulnerability auditing in CI and SHALL fail the pipeline only for configured severities of High or Critical.

#### Scenario: High severity vulnerability blocks merge
- **WHEN** CI detects a High or Critical dependency vulnerability
- **THEN** the audit job fails and merge is blocked by required checks

#### Scenario: Lower-severity vulnerabilities remain visible
- **WHEN** CI detects vulnerabilities below the blocking threshold
- **THEN** findings are reported without failing merge-required checks

### Requirement: Affected-Scope Execution for Local Feedback
The system SHALL use affected-scope task execution for local pre-push verification where supported by the task graph.

#### Scenario: Pre-push runs impacted checks
- **WHEN** a developer pushes changes
- **THEN** only impacted build/test tasks are selected for local verification

#### Scenario: Unaffected packages are skipped
- **WHEN** a change does not impact a package
- **THEN** that package’s local pre-push checks are not executed
