# Application intelligence

## Goal

Make job-description selection and CV tailoring reproducible: a deterministic report maps recognized vacancy requirements to evidence IDs and recommends a canonical CV without treating keyword coverage as an ATS or hiring prediction.

## Module interface

`scripts/analyze-applications.mjs [--write] [selector]` is the module interface. Callers provide job-description files; the implementation owns normalization, requirement tiers, evidence lookup, scoring, CV recommendation, and report rendering. `career/ats/taxonomy.json` is the configuration seam.

## Invariants

- An evidence ID must be supported by `career/profile/master-career.md`.
- An empty evidence list is a gap, not permission to add a claim.
- Generated reports do not alter any CV.
- Job-specific CVs remain isolated under `career/applications/<company>-<role>/`.
