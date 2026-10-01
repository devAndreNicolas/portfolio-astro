# Plan

Use `career/cvs/manifest.json` as the sole CV inventory. Render a static Astro page from its public entries, preserving each declared PDF output rather than duplicating filenames in page code. Reuse `BaseLayout` for metadata and structured data, set `noindex`, and exclude `/cv/` from the sitemap.

Verify with the normal site validation and inspect the built route.
