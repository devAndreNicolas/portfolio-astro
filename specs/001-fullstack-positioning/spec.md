# Portfolio positioning refresh

## Outcome

Present André Nicolas's public portfolio as a Full Stack Engineer / Software Engineer with a frontend specialty, product judgment, and AI-native delivery practice. The site must give a recruiter credible, concrete paths into the work without overstating employment titles or unverified outcomes.

## Non-goals

- Do not turn the portfolio into an HTML copy of a CV.
- Do not imply professional Java/Spring experience, clinical deployment of Saúde em Campo, revenue, payment volume, or client relationships that are not evidenced.
- Do not publish private-repository implementation detail beyond the claims allowed by the Master Career Document.

## Acceptance criteria

1. Home, About, footer, metadata, and structured Person data use the Full Stack / Software Engineer positioning while stating the current MSPA title accurately.
2. Home visibly covers frontend specialty, backend/data/platform work, AI work, and the scoped Java foundation.
3. The portfolio includes factually grounded case studies for FechaRacha, Saúde em Campo, Diário de Campo Escoteiro, and Missões do Dia.
4. Navigation makes the CV library easy to find without indexing it as a duplicate resume.
5. Indexable pages keep specific titles, descriptions, canonical URLs, Open Graph data, and Person structured data.
6. `pnpm validate` succeeds; any missing `SITE_URL` configuration is reported.

## Risks

The portfolio has historically emphasized frontend work. The refresh must expand the story without diluting that strength or upgrading academic/design evidence into professional production claims.
