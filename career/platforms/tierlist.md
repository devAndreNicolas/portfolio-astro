# Job-source tierlist — Brazil first

Use this order for automatic collection. The role/stack filters come from `career/platforms/search-config.json`; collected public job descriptions go to `career/applications/` and then through `pnpm applications:analyze`.

The collector must be **query-based**, not company-list-based: new employers need to be discoverable as soon as they publish. A registry of company boards is only supplemental coverage for companies already known to be attractive.

## Tier 1 — Brazil, global discovery

| Source | Why first | Collection mode | Constraint |
| --- | --- | --- | --- |
| Gupy candidate portal | Broad Brazilian vacancy discovery. | Query the candidate-facing portal by role, stack and recency. | Build a portal-specific adapter; do not scrape the marketing site. |
| InHire public job surfaces | High Brazilian ATS penetration. | Query any candidate-facing/public listing surface by role and stack. | InHire itself confirms that many postings live in each customer's career page, so broad discovery needs a search index or permitted feed. |
| Search index with Brazil filter | Finds new companies across all public ATS domains. | Query by ATS domain, role, stack and recency; then collect only the official result page. | Google blocks automated results on this network; use an authorized search-data provider or alerts/feed, not browser evasion. |

## Tier 2 — International / Brazil remote, global discovery

| Source | Collection mode | Use for |
| --- | --- | --- |
| Greenhouse | Search-index or official candidate portal query, then official result page. | Product, frontend, full-stack and remote roles. |
| Ashby | Search-index or official candidate portal query, then official result page. | Startup, product-engineering and AI-adjacent roles. |
| Lever | Search-index or official candidate portal query, then official result page. | Technology/startup roles. |

## Tier 3 — Secondary boards

Workable, SmartRecruiters and Workday. Query them globally through the same search/discovery adapter; they are useful coverage, not the first collector target.

## Explicitly not a collector source

- Google result pages: the current IP receives Google Search's automated-traffic CAPTCHA.
- LinkedIn result pages: login/rate-limit sensitive; do not automate.
- ATS vendor marketing sites: they describe the software and do not expose every customer vacancy.

## Optional board registry

`career/platforms/boards.json` is optional supplemental coverage, never the source of truth. Add a public board only when it is strategically valuable; a direct-board collector can visit it at a low rate, deduplicate by job URL, and write source metadata under `career/applications/`.

Sources: [InHire](https://www.inhire.com.br/) states that its customers publish jobs on their own career pages; [Greenhouse](https://www.greenhouse.com/), [Ashby](https://www.ashbyhq.com/), and [Lever](https://www.lever.co/) are ATS platforms rather than universal job-search indexes.
