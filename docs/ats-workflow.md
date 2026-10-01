# Application and ATS workflow

`pnpm applications:analyze` reads every non-empty `.txt` job description under `career/applications/` and writes deterministic evidence-coverage reports to `career/applications/analysis/`.

The analyzer repairs common UTF-8/Latin-1 mojibake found in copied LinkedIn descriptions before matching terms; it never modifies the original job-description file.

The score is deliberately narrow: weighted coverage of recognized requirements that can be tied to an evidence ID in `career/profile/master-career.md`. It is not an ATS pass rate, interview likelihood, or a reason to claim missing experience.

The taxonomy deliberately separates near-but-not-equivalent requirements. For example, authentication does not prove SSO, a security-conscious design does not prove vulnerability testing, and general performance work does not prove load testing. These show as evidence gaps until new, specific evidence exists.

Use the report to choose a canonical CV and decide whether the job is worth tailoring. For a selected vacancy:

1. Preserve the job description under `career/jobs/`.
2. Create `career/applications/<company>-<role>/`.
3. Add a requirement-to-evidence table and write the derivative `.tex` CV there.
4. Run `pnpm cv:check`, build the target CV, and run `pnpm cv:verify` once a PDF is generated.

Use `pnpm applications:report -- <part-of-filename>` to inspect one application without rewriting reports.

`pnpm roles:recommend` generates `career/roles/README.md`, with role titles and queries to use across job boards. Its score combines documented-strength coverage with representation in the local application corpus; it does not claim live market demand. The future market-research step can add an external adapter without changing the role catalogue interface.

`pnpm jobs:collect:br` uses a local Playwright browser to discover up to 10 Brazil-focused results from public ATS pages and save their public text in `career/applications/`. It preserves the original URL and collection time, deduplicates by URL, rate-limits requests, and skips login, CAPTCHA, short, or blocked pages. Run `pnpm applications:analyze` afterwards. Use `jobs:collect:remote` only after reviewing the Brazil queue.

Google currently presents an automated-traffic CAPTCHA to this network, so do not rely on the Google-discovery collector. Follow `career/platforms/tierlist.md`: use a registry of public company boards for direct collection, or adopt a permitted search API for broad discovery.

The taxonomy at `career/ats/taxonomy.json` is the single configuration seam for recognized terms, evidence IDs, and canonical-CV recommendations. Add a term only with real evidence; use an empty `evidence` array to expose a gap.
