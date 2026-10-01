---
name: career-operations
description: Autonomously run the repository's vacancy-to-CV career routine when the user asks to update, continue, or operate their career pipeline.
---

# Career operations

The user does not manage a per-vacancy queue. Treat the current application corpus as the work queue and take ownership of the routine. Read `career/agent-control.md` completely at the beginning of every career-related turn. Its checked full-pipeline trigger is an instruction to execute every listed phase and gate. Do not clear it after merely running scripts, refreshing scores, or validating sources.

Read `career/profile/master-career.md`, the application analysis index, canonical manifest, and the relevant existing CVs. If collection is in scope and credentials are present, refresh the Brazil-first corpus with the repository collector. Then run deterministic analysis, role recommendations, and dashboard generation.

Prioritize vacancies with documented evidence coverage and role fit. Reject or defer roles whose critical requirements conflict with documented evidence instead of fabricating a match. For each high-value candidate, use `career-tailoring` and `cv-qa`: select/reorder grounded evidence, update reusable canonical sources where the improvement is broadly true, and create job-specific derivatives only when the job warrants it. A role variant may share layout but never a generic experience block: its summary, skills, experience, and projects must be role-specific and use context → action → evidence/effect (STAR/CAR logic without unsupported results).

Write the structured evaluation and immutable run record required by the control file, regenerate the consolidated report/dashboard, and run `pnpm cv:content:check` plus `pnpm career:verify` before clearing the trigger. Update factual career memory only when new inspected evidence supports it. GitHub Actions is not an AI worker: leave it to compile approved LaTeX into public PDFs. Ask the user only for one batched set of facts that are necessary and unavailable in the repository.
