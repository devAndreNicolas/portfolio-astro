# Master Career Document — André Nicolas Silva

Private factual memory for CV and portfolio work. Last synthesized: 2026-10-01. Sources are the canonical CV files and portfolio case studies currently in this repository. A statement below is eligible for a CV only when its evidence ID is cited.

## Identity and target positioning

- Public name: **André Nicolas**. Full name used in CV headers: **André Nicolas Silva**. [identity-001]
- Based in Maceió, Brazil. [identity-002]
- Target positioning: Frontend Engineer / Software Engineer with product focus; credible adjacent roles include Full Stack Engineer, Full Stack Developer, Product Engineer, and Web Developer. [position-001]
- Contact: `devandrenicolas@gmail.com`; GitHub `devAndreNicolas`; LinkedIn `devandrenicolas`; portfolio `portfolio-andrenicolas.vercel.app`. [identity-003]
- Languages: Portuguese (native); English self-described as advanced and improving. Do not describe English as fluent without new evidence. [language-001]

## Evidence ledger

### GitHub-backed project evidence

- **oss-002 — Stoat for Web merged contribution.** GitHub confirms PR [stoatchat/for-web#1518](https://github.com/stoatchat/for-web/pull/1518), `fix: Show file size validation errors`, was merged on 2026-08-20. The repository is the official Solid.js web client for `stoat.chat/app`. This is stronger evidence than a generic “approved PR”; describe it as a merged open-source frontend contribution.
- **project-fecha-001 — FechaRacha.** Repository documents a Next.js 16 / React 19 / TypeScript application for creating group contribution goals, inviting participants, and tracking declared contributions without moving or holding money. Evidenced stack: Supabase Auth/PostgreSQL/Realtime, Prisma 7, Resend, Zod, and Vitest. Sources: private GitHub repository `devAndreNicolas/fecha-racha`, README and `docs/estrategia-produto-e-roadmap.md`, inspected 2026-10-01.
- **project-fecha-002 — Product strategy and trust design.** The FechaRacha strategy defines a Brazilian WhatsApp + Pix coordination use case; shared-link acquisition, activation metrics, privacy-aware analytics, explicit non-custody, and value-hypothesis testing before billing. It specifies security decisions such as hashed join tokens, expiry/use limits, authorization revalidation, noindex invitation views, audit events, and PII minimization. This is evidence of product/system design work; describe future Pro pricing, ads, gamification, and expansion as hypotheses/roadmap rather than shipped revenue features.
- **project-fecha-003 — Implemented behavioral safeguards.** Repository behavior tests verify contributor ownership at the query boundary, role-derived capabilities that restrict administrative actions, membership-aware visibility, shareable-link acceptance with reuse of a pending invitation and atomic exhaustion of the 50th slot, notification deduplication, and goal-status transitions. This supports claims about implementing and testing authorization, invitation, notification, and state-transition behavior. Source: private GitHub `devAndreNicolas/fecha-racha`, `tests/behavior/**`, inspected 2026-10-01.
- **project-ecarryon-001 — eCarryOn architecture.** Designed an edge-first, modular-monolith monorepo for a gamified competitive-game skill-transfer platform: React Router v7 full-stack app on Cloudflare Workers; Hono endpoints/webhooks; isolated domain rules; Drizzle/database layer; shared Zod contracts; and a plug-in-ready path for billing, email, analytics, monitoring, and Cloudflare services. Sources: private GitHub `devAndreNicolas/ecarryon`, README and `docs/architecture.md`, inspected 2026-10-01.
- **project-saude-001 — SisVisita / Saúde em Campo.** Designed a mobile offline-first health-field application with React Native/Expo/TypeScript, NativeWind, SQLite via expo-sqlite, Drizzle, TanStack Query, role-aware navigation, local per-user data isolation, sync queue, idempotency keys, retries/backoff, RBAC, and risk-prioritization rules. Source: private GitHub `devAndreNicolas/saude-em-campo`, `DOCUMENTACAO_TECNICA.md`, inspected 2026-10-01. Treat health/LGPD statements as architecture/design evidence, not a claim of clinical deployment.
- **project-diary-001 — Diário de Campo Escoteiro.** Offline-first installable PWA for field records, with local data and automatic CouchDB synchronization after reconnecting; React, TypeScript, Vite, Tailwind, PouchDB/CouchDB, service worker, and web app manifest. Source: public GitHub `devAndreNicolas/diario-de-campo-escoteiro`, README, inspected 2026-10-01.
- **project-rendafacil-001 — RendaFácil.** Separate public investment-yield simulator repository with Next.js 15, TypeScript, ApexCharts, forms, SEO/sitemap configuration, calculation rules, comparison, glossary, and financial-disclaimer documentation. Source: public GitHub `devAndreNicolas/renda-facil`, README, inspected 2026-10-01. Confirm whether this is the same project as `RendeCerto` before merging names in a CV.
- **project-missions-001 — Missões do Dia.** Academic Android Java application for mission CRUD using SQLite, SharedPreferences, Service, BroadcastReceiver, AsyncTask, Activity, and XML layouts. Source: public GitHub `devAndreNicolas/missoes-do-dia`, README, inspected 2026-10-01. Frame as academic/mobile work, not professional Android experience.
- **project-terto-002 — Implemented checkout and webhook flow.** The private `andre-nicolas-beats` repository has a payment orchestration layer that creates pending orders, validates provider/currency/amount, starts Stripe Checkout or a Mercado Pago flow, and records checkout details. Mercado Pago and Stripe webhook routes process payment events; the Stripe route validates its webhook signature and both call shared paid-order fulfillment. The repository also has a Vitest test command and MDX-content tests. This supports describing implemented checkout/order/webhook handling; it does not establish production traffic, revenue, or successful payment volume. Sources: private GitHub `devAndreNicolas/andre-nicolas-beats`, payment routes/services and `package.json`, inspected 2026-10-01.

### Employment and open source

- **exp-mspa-001 — MSPA, Apr 2025–present.** Frontend Engineer with product focus; other canonical variants frame the same work as Software Engineer (Full Stack) or Software Engineer (Product & Web). MSPA is a SaaS platform for privacy, LGPD compliance, and digital auditing. Sources: all current `career/cvs/*.tex`; `src/content/work/mspa-*.md`.
- **exp-mspa-002 — Product scope.** Contributed to Compass, Trust Center, and compliance-related surfaces used by 10+ companies; worked from requirements/business rules through technical definition, implementation, refinement, debugging, production delivery, and support. Sources: `frontend-engineer-{br,international}.tex`; `mspa-compass.md`; `mspa-trust-center.md`.
- **exp-mspa-003 — Frontend and systems.** Angular, TypeScript, Signals, RxJS, React, Astro, Web Components, Lit, and Shadow DOM across production surfaces. Sources: canonical CVs; `mspa-compass.md`; `mspa-trust-center.md`.
- **exp-mspa-004 — Consent platform.** Contributed to a framework-agnostic consent UI and enforcement flow using Lit/Web Components/Shadow DOM, Cloudflare Workers, KV, D1, Durable Objects, audit events, and Compass-managed configuration. Source: `mspa-trust-center.md`.
- **exp-mspa-005 — Full-stack contribution.** Worked with Go services, REST/internal APIs, SQL/PostgreSQL, concurrency/asynchronous processing, events/SSE, integrations, and automations when product workflows required it. Source: canonical CVs.
- **exp-mspa-006 — AI product work.** Integrated user-facing generative-AI capabilities using Genkit, contextual prompt engineering, input sanitization, and structured responses. Sources: canonical CVs.
- **exp-mspa-007 — Delivery and quality.** Worked with Git, code review, Vitest/automated testing, CI/CD, deployment, debugging, performance, SEO, and accessibility. Sources: canonical CVs; `mspa-compass.md`; `mspa-compliance-portal.md`; `mspa-landing-page.md`.
- **exp-mspa-008 — Team coordination.** During a critical project phase, reorganized workflow with a 6-person team and direct coordination of 4 people. Source: canonical CVs; `mspa-compass.md`. Do not inflate this into a people-manager title.
- **oss-001 — Stoat / Revolt Platforms LTD, 2026–present.** Volunteer Frontend Engineer; UX/frontend contribution with a pull request approved by maintainers. Source: canonical CVs. Keep `Volunteer` explicit.

### Projects

- **project-terto-001 — Terto Beats.** Personal digital-assets marketplace. Built end-to-end commerce behavior with Next.js, TypeScript, Supabase, Vercel, checkout/order lifecycle, authentication/persistence, state handling, integrations, and post-purchase automation. Sources: canonical CVs; `src/content/work/beat-store.md`. No revenue, customer, or commercial-success claim is evidenced.
- **project-rendecerto-001 — RendeCerto.** Financial simulation web application using Next.js, TypeScript, and Vitest. Implemented deterministic calculation rules, scenario comparisons, readable outputs, and automated tests for key scenarios. Sources: canonical CVs; `src/content/work/rendecerto.md`.
- **project-qf-001 — Quebrando Fronteiras.** Social-impact/donation platform work in Next.js and TypeScript; refactored critical user flows, mobile behavior, and UX with conversion-oriented, analytics-informed iteration. Sources: canonical CVs; `src/content/work/quebrando-fronteiras.md`.
- **project-compliance-001 — Compliance Portal.** Astro-based content UX/SEO work and a shared TypeScript glossary component in a pnpm workspace. Source: `src/content/work/mspa-compliance-portal.md`.
- **project-landing-001 — MSPA Landing Page.** Astro, reusable multi-landing-page structure, SEO/performance, Cloudflare bucket media delivery, and campaign-oriented experience. Source: `src/content/work/mspa-landing-page.md`.

### Additional GitHub evidence

- **project-ecarryon-landing-001 — eCarryOn landing and content system.** Built an Astro 6/Tailwind 4 static landing page and blog with reusable component sections, structured content, a token-driven visual system, responsive layouts, 404, Open Graph image, sitemap, and canonical URLs. Source: private GitHub `devAndreNicolas/ecarryon-landing-page`, README, inspected 2026-10-01.
- **project-commerce-sites-001 — deployed commerce-oriented web surfaces.** Three private Next.js 16/React 19/TypeScript sites (`via-pao`, `gm-doces-e-salgados`, and `borbo-confeitaria`) are deployed on Vercel and include Vercel Analytics, Tailwind, and component/UI tooling. This is evidence of repeated web-delivery work; repository metadata and manifests do not establish client relationship, revenue, conversion result, or checkout integration, so do not claim those without additional context.
- **project-ppvg-001 — Perder Pra Você Ganhar.** Public Godot 4.7 playable music-video/game project with modular UI theme, keyboard navigation/focus, HUD/ability states, performance diagnostics, and an explicit 60-FPS UI constraint. Source: public GitHub `devAndreNicolas/ppvg`, README, inspected 2026-10-01. Use for UI systems/interactive-media evidence when relevant, not as primary web-product experience.

### Education

- **edu-001 — Tecnólogo em Sistemas para Internet, UNCISAL; completed 2026.** For English CVs use: `Tecnólogo in Internet Systems, UNCISAL (Brazil)`, optionally followed by a neutral explanation such as `Brazilian higher-education technology degree`. Do not rename UNCISAL or claim a bachelor’s/associate degree equivalence without verified credential guidance. Sources: canonical CVs.

### Public-profile evidence

- **linkedin-001 — Public LinkedIn profile, inspected 2026-10-02.** The profile publicly identifies André Nicolas Pires Terto Silva as being at MSPA in Maceió, links the portfolio, and presents him as a Frontend Engineer. Its public activity includes engineering articles about AI review for regulatory workflows, real-time role updates, Angular, React, and consent-system architecture. These articles are public positioning evidence; do not convert their implementation details into CV claims unless separately substantiated.
- **cert-001 — Public LinkedIn credentials, inspected 2026-10-02.** The current profile lists Angular 17 Fundamentals and Web Performance Fundamentals v2 (Frontend Masters, issued May 2025), Front-End System Design (Frontend Masters, issued March 2025), Responsive Web Design (freeCodeCamp, issued March 2025), Imersão Computação Básica (BRISA, issued February 2025), Google Data Analytics foundations (issued February 2025), and Discover (Rocketseat, issued June 2024). Source: public LinkedIn profile. Preserve the issuer/title/date exactly when listing them; certifications are supplementary evidence, not a substitute for experience.

## Evidence-backed skill map

- Frontend/product: Angular, React, Next.js, Astro, TypeScript, JavaScript, HTML/CSS, UX, accessibility, SEO, performance/Lighthouse, product requirements, business rules, feature ownership, scope, reusable component systems.
- Architecture/platform: Web Components, Lit, Shadow DOM, component-based architecture, separation of concerns, Hexagonal Architecture, REST/internal APIs, Go, event-driven systems, SSE, SQL/PostgreSQL/Supabase, Cloudflare Workers/KV/D1/Durable Objects, edge/serverless, CI/CD.
- Java/mobile: Java and the Android SDK in the academic Missões do Dia application, including SQLite, SharedPreferences, Service, BroadcastReceiver, AsyncTask, Activity, and XML layouts. [project-missions-001] This is project evidence; it is not evidence of professional Java/Spring experience.
- AI/productivity: generative AI/LLM product features, Genkit, prompt/context design, input sanitization, structured outputs; Codex, Claude, Cursor, CodeRabbit, MCPs, agents, skills, and SDD used in development workflow.

## Positioning themes

## CV selection map

Use this map to select evidence, not to copy every project into every CV.

- **Frontend Engineer:** MSPA Compass/Trust Center/Compliance Portal; merged Stoat PR; Diário de Campo. Emphasize Angular/React/Astro, Web Components/Lit, accessibility/SEO/performance, UX clarity, and reusable frontend systems.
- **Software Engineer:** MSPA full-stack contributions; FechaRacha; Saúde em Campo; Missões do Dia. Emphasize boundaries, Go/APIs, PostgreSQL/SQL, Cloudflare, authentication/authorization, tests, asynchronous/offline systems, reliability, and Java/Android project work where relevant.
- **Full Stack Engineer / Developer:** FechaRacha; Terto Beats; MSPA; Saúde em Campo; Missões do Dia. Emphasize end-to-end product flows, auth/data/email/payment-domain integration only where directly evidenced, migrations, validation, server actions/endpoints, and deployment.
- **Product Engineer:** FechaRacha product strategy; MSPA Compass; Terto Beats; Saúde em Campo; RendaFácil/RendeCerto after name confirmation. Emphasize problem framing, user jobs, constraints, scope, trust, measurable events, and value hypotheses. Do not state unvalidated pricing, traction, or revenue as outcomes.
- **Web Developer:** commerce-oriented websites; RendaFácil; Diário de Campo; Compliance Portal. Emphasize responsive web delivery, SEO, content/marketing surfaces, PWA/offline capability, and clear user journeys.

## Evidence gaps to close

- Confirm whether `RendaFácil` and `RendeCerto` are one project or two, and retain only the accurate name per CV.
- Capture deployment/operational evidence for `andre-nicolas-beats` before claiming live payment volume, revenue, email-delivery outcomes, or production reliability metrics.
- Capture deployed URLs, screenshots, commits, or accepted PRs for the private commerce websites if they represent client/freelance work.
- Collect implementation evidence (not just architecture documents) for eCarryOn and Saúde em Campo before presenting every designed subsystem as shipped functionality.
- Add a concrete example of CI/CD, tests, and AI-assisted workflow impact when a vacancy asks for AI engineering or platform reliability.

Use these as the narrative throughline only when the target role fits: **product-minded frontend engineer**, **UX and system clarity in complex compliance SaaS**, **framework-agnostic web platform work**, **end-to-end feature ownership**, and **AI-assisted engineering with technical judgment**.

## Development targets — not CV claims yet

- RAG architecture, retrieval evaluation, and production observability.
- AI agent evaluation, governance, security, and CI/CD integration beyond the current AI-assisted development workflow.
- Discovery/validation methods: stakeholder interviews, quantified opportunity assessment, investment cases, and proposal framing.
- Formal sales process, pricing, pipeline ownership, and revenue responsibility.
- System design evidence at broader scale and measurable product/business outcomes.

## Current canonical CV inventory

Available: `software-engineer-{br,international}`, `fullstack-engineer-{br,international}`, `fullstack-developer-{br,international}`, `frontend-engineer-{br,international}`, `angular-developer-{br,international}`, `react-developer-{br,international}`, `product-engineer-{br,international}`, and `web-developer-{br,international}`.

The Angular, React, and Brazilian Product Engineer variants were added on 2026-10-01 from existing evidence-backed claims after recurring role demand was confirmed in the saved application corpus. They do not introduce new career claims.
