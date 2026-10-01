---
name: career-operations
description: Autonomously run the repository's vacancy-to-CV career routine when the user asks to update, continue, or operate their career pipeline.
---

# Career operations

The user does not manage a per-vacancy queue. Treat the current application corpus as the work queue and take ownership of the routine.

Read `career/profile/master-career.md`, the application analysis index, canonical manifest, and the relevant existing CVs. If collection is in scope and credentials are present, refresh the Brazil-first corpus with the repository collector. Then run deterministic analysis, role recommendations, and dashboard generation.

Prioritize vacancies with documented evidence coverage and role fit. Reject or defer roles whose critical requirements conflict with documented evidence instead of fabricating a match. For each high-value candidate, use `career-tailoring` and `cv-qa`: select/reorder grounded evidence, update reusable canonical sources where the improvement is broadly true, and create job-specific derivatives only when the job warrants it.

Update the dashboard snapshot and the factual career memory when new inspected evidence supports it. Run the applicable checks. GitHub Actions is not an AI worker: leave it to compile approved LaTeX into public PDFs. Ask the user only for a batched set of facts that are necessary and unavailable in the repository.
