# Automated CV optimization

## Outcome

On a manual GitHub Actions dispatch, optimize existing canonical CV sources from the evidence ledger and the current high-signal job corpus. Generate a job-specific derivative only when its requirements require a materially different emphasis from the best canonical CV.

## Required pipeline

1. Read the Master Career Document, canonical CV, deterministic job analysis, and target language.
2. Ask the model for structured edits with every claim mapped to evidence IDs.
3. Reject any output containing unknown evidence IDs, unsupported terms, fabricated dates, employers, outcomes, seniority, or metrics.
4. Render the approved canonical `.tex` or job-specific derivative as a one-column ATS PDF.
5. Run factual, ATS, and PDF checks before publishing.
6. Publish a dashboard record that identifies source jobs, evidence used, rejected gaps, generated PDF, and the exact validation state.

## Non-goals

- Fabricating experience, credentials, metrics, employers, or outcomes.
- Automatically submitting applications.
- Replacing a canonical CV merely to mention every keyword from one vacancy.
