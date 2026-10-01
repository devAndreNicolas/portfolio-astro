# Career dashboard

## Outcome

Expose a direct-access `/career/` operational dashboard that shows sanitized job-fit evidence and downloadable public CVs, refreshed automatically by GitHub Actions on weekdays.

## Acceptance criteria

- The route is not linked by navigation, is `noindex`, and is excluded from the sitemap.
- The dashboard contains no full job descriptions or private career source material.
- The dashboard consumes one structured career-operations report for CV readiness, planned variants, role recommendations, and the defined synergy metric.
- The scheduled workflow collects Brazilian vacancies, refreshes deterministic analysis and emits the dashboard snapshot.
- A day with no new links completes successfully.

## Non-goals

- Automatic submission of applications.
- A claimed hiring or ATS-pass probability.
