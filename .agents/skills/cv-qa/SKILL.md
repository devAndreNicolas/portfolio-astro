---
name: cv-qa
description: Verify a LaTex CV for factual grounding, ATS readability, and reproducible PDF output.
---

# CV quality assurance

Check each claim against `career/profile/master-career.md`. Flag unsupported claims rather than repairing them with invention.

Check one-column layout, readable heading order, literal text contact information, no graphical skill ratings, no table-led layout, and consistent dates. Build with `pnpm cv:build -- <id-or-path>`, then run `pnpm cv:verify`. Confirm that the PDF exists at the manifest's declared public path.

Report: factual gaps, ATS risks, compiler output, and any visual review still needed.
