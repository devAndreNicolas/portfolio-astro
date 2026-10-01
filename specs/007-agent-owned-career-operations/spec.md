# Agent-owned career operations

## Outcome

The career system is operated by the Codex agent from the existing application corpus, rather than through user-authored job request files. One agent routine performs collection, deterministic analysis, prioritization, grounded CV improvement and dashboard refresh. GitHub Actions remains limited to PDF compilation and public publishing.

## Non-goals

- Execute generative AI in CI.
- Require a per-vacancy form, JSON request, base-CV choice, or local command from the user.
- Fabricate experience to improve a score.

## Acceptance criteria

- Repository harness instructions make the agent, not the user, owner of career operations.
- A discoverable `career-operations` skill defines the autonomous routine and its evidence boundary.
- README documents the no-form, no-queue daily experience.
- The public dashboard and CV library remain read-only outputs; the GitHub workflow only compiles/publishes approved PDFs.
