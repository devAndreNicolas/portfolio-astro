# André Nicolas — portfolio and career kit

This repository has two deliberately separate concerns:

- `src/` is the public Astro portfolio.
- `career/` is the source and workflow for ATS-safe LaTeX CVs.

## Start here

```bash
pnpm install
pnpm dev
pnpm validate
```

Set `SITE_URL` to the real production domain in `.env` and in the GitHub repository variable of the same name. It enables production canonical URLs and the generated sitemap.

## CV workflow

```bash
pnpm cv:list
pnpm cv:build -- frontend-engineer-br
pnpm cv:build -- career/cvs/frontend-engineer-br.tex
pnpm cv:build
```

See [the CV toolchain](docs/cv-toolchain.md). First install `latexmk` plus XeLaTeX, or Tectonic. Put verified career facts in `career/profile/master-career.md`, created from the tracked example. It is versioned with the repository but excluded from the Vercel deployment; do not add secrets or sensitive private-repository details.

The canonical starter files are role and language pairs:

- Software Engineer, Full Stack Engineer, Full Stack Developer, Angular Developer
- React Developer, Frontend Engineer, Product Engineer, Web Developer
- Each exists as `-br.tex` and `-international.tex`

When moving an Overleaf CV here, replace only the matching `.tex` source, retain its manifest ID, then run `pnpm cv:build -- <id>`.

## AI and specification workflow

`AGENTS.md` supplies durable repository rules. `.agents/skills/` contains portable skills discovered by Codex and compatible Agent Skills tools: career tailoring, CV QA, and portfolio SEO. `specs/` is the lightweight SDD record; create a numbered spec for a material workflow, data, or public-interface change.

Agent rule: no claim is allowed in a CV or portfolio merely because it matches a job description. It must be supported by the Master Career Document.
