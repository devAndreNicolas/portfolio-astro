# Repository harness

This repository contains a public Astro portfolio and a career-document system. Preserve the distinction between public work and private career evidence.

## Operating rules

1. Read `career/profile/master-career.md` before proposing or editing a CV. It is tracked in Git but excluded from the Vercel deployment; do not put secrets or sensitive private-repository content in it.
2. Never invent employers, dates, technologies, seniority, outcomes, or metrics. Every externally stated claim needs an evidence ID or source in the Master Career Document.
3. Treat `career/cvs/manifest.json` as the source of CV IDs and public PDF locations. Do not hard-code a filename elsewhere.
4. A job-specific CV belongs in `career/applications/<company>-<role>/`; do not overwrite a canonical CV.
5. Run `pnpm cv:check` after editing the manifest or a source. Run `pnpm cv:verify` after generating PDFs. Run `pnpm validate` after website work.
6. Keep ATS CVs single-column, text-selectable, conventional in section names, and free of tables, icons-only contacts, charts, and fabricated keyword stuffing.
7. Before changing a public-facing route or copy, create/update a spec under `specs/` and keep metadata, canonical URL, social sharing, and structured data in mind.
8. Career operations are agent-owned. Do not ask the user to create request files, select a base CV, run local analysis commands, or manage a job-by-job queue. At the beginning of every career-related turn, read `career/agent-control.md` completely. A checked full-pipeline trigger authorizes every phase in that contract; it may be cleared only after every manifest CV is evaluated, non-blocked readiness is 100, structured outputs/history exist, and `pnpm career:verify` passes. GitHub Actions is restricted to compiling approved LaTeX sources into PDFs and publishing configured public outputs.

## Agent skills

Portable project skills live in `.agents/skills/`. Use the smallest relevant one: `career-operations`, `career-memory`, `career-tailoring`, `cv-qa`, or `portfolio-seo`.
