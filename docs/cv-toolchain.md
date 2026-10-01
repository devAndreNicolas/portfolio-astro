# CV toolchain

The tracked `.tex` files are the CV sources. `career/cvs/manifest.json` is the single mapping from stable ID to source and public PDF.

## Commands

```bash
pnpm cv:list
pnpm cv:build                         # every CV
pnpm cv:build -- frontend-engineer-br # one manifest ID
pnpm cv:build -- career/cvs/frontend-engineer-br.tex
pnpm cv:check                         # sources and manifest
pnpm cv:verify                        # also requires generated PDFs
pnpm cv:clean
```

`pnpm build` builds only the website. `pnpm build:all` generates all PDFs then builds the website.

## Published PDFs without local TeX

On pushes to `main` that change `career/cvs/`, the `Publish public CV PDFs` GitHub Actions workflow compiles every canonical source with XeLaTeX and commits its PDFs under `public/cv/`. Vercel can then serve them and `/cv/` lists the public manifest entries. The publishing script handles LaTeX engines that place generated PDFs either beside the source or at the workspace root.

No local LaTeX installation is needed for that path. In repository settings, allow GitHub Actions workflows to have **Read and write permissions** so the workflow's `GITHUB_TOKEN` can commit the generated PDFs. If `main` has branch protection, allow this workflow to push or use its pull-request flow.

## Compiler

The default is `latexmk` with XeLaTeX. Install TeX Live or MiKTeX with `latexmk`, `xelatex`, and the packages used by your CV. On Windows, use a non-interactive package-install setting in CI.

Tectonic is accepted as a fallback when `latexmk` is absent. Set `CV_ENGINE=latexmk` or `CV_ENGINE=tectonic` to force one. First Tectonic builds may need network access to retrieve its bundle.

All CVs should be single column, use selectable text, conventional headings, and have contact details written as text. Do not use tables, text-as-image, skill bars, or fabricated claims.
