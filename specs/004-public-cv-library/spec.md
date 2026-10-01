# Public CV library

## Outcome

Publish a direct-access `/cv/` page where a recruiter can download the canonical role and language variants defined by the CV manifest.

## Acceptance criteria

- The page lists only manifest entries marked public and links to their manifest-defined PDF outputs.
- It is not linked in the site header or footer.
- It has a clear H1, metadata, canonical URL, Open Graph metadata, and Person structured data through the shared layout.
- It is public by direct URL but excluded from search indexing and the sitemap so it does not duplicate CV content in search.
- An arbitrary `.tex` path continues to compile to `public/cv/` for intentional direct sharing.
- The deployment receives only `career/cvs/manifest.json` from the career directory; source `.tex` files, applications, and private evidence remain excluded.

## Non-goals

- Listing job-specific application variants on the public page.
- Presenting HTML resume content or claims outside the PDFs.
