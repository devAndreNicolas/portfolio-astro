# Plan

The `scripts/cv.mjs` module is the seam for callers. Its small interface is `list`, `build`, and `clean`; it resolves IDs, selects an available compiler, isolates intermediate files, and copies the final PDF to its public location.

`manifest.json` owns CV identity. `.tex` owns typography. The ignored Master Career Document owns factual provenance. This preserves locality: changing a public filename or compiler behavior does not spread into CV sources or Astro components.

Verification has two levels: `cv:check` validates sources and manifest without a TeX installation; `cv:verify` additionally requires generated PDFs.
