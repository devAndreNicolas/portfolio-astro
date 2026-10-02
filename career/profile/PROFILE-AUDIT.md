# Public-profile audit

Run the same evidence-based recruiter review used for CV work against the GitHub profile README and a LinkedIn file you explicitly provide:

```powershell
pnpm profile:audit -- --linkedin path/to/linkedin-export
```

The command obtains the GitHub profile README through GitHub CLI (`gh api`) and requires a valid GitHub CLI login. It accepts `.csv`, `.html`, `.json`, `.md`, or `.txt` LinkedIn exports/exports-derived files; it does not scrape a logged-in LinkedIn session.

To retain a local report, use:

```powershell
pnpm profile:audit -- --linkedin path/to/linkedin-export --write
```

The score is evidence coverage against the Master Career Document, not an ATS pass probability or hiring prediction. Review proposed changes against `master-career.md` before publishing them.
