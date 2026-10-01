# Career ecosystem

## Outcome

Maintain factual career evidence once, publish role/language-specific LaTeX CVs as stable public PDFs, and let AI agents tailor application-specific variants without fabricating claims.

## Acceptance criteria

- Sixteen canonical source files exist: eight role targets in Brazilian Portuguese and English.
- A stable ID maps each CV to one `.tex` source and one public PDF target.
- A caller can build all CVs, one ID, or an existing `.tex` path.
- The website can build without a LaTeX compiler; the full build generates PDFs first.
- Invalid manifests and missing source files fail validation.
- The private Master Career Document is not committed accidentally.

## Non-goals

- Auto-submitting applications.
- Claiming ATS scores as objective truth.
- Automatically installing a system TeX distribution.
