---
title: MSPA Compliance Portal
order: 5
headline: Making dense compliance knowledge easier to use.
role: Frontend Engineering · Content UX
disciplines: [Astro, Accessibility, Shared systems]
visual: content
publishDate: 2026-02-01
description: A compliance knowledge experience that gives people immediate context without interrupting the task of reading.
tags:
  - Astro
  - SEO
  - Accessibility
  - Content Strategy
  - Knowledge Base
---

<section class="case-section">

## Context

MSPA needed a clearer way to publish and consume compliance content for users who are not legal specialists.

</section>

<section class="case-section">

## Problem

Compliance terms are dense and often create comprehension friction. Users needed immediate context without leaving the page, while the team needed maintainable shared behavior across products.

</section>

<section class="case-section">

## Role & Ownership

I contributed to frontend architecture and UX behavior focused on comprehension and discoverability, including shared component decisions across the workspace.

</section>

<section class="case-section">

## Technical Decisions

- Built the portal with Astro for performance and search discoverability.
- Implemented a shared TypeScript component in a pnpm workspace package to detect terms in Landing Page and Compliance Portal content.
- When a recognized term exists in the compliance glossary app, users can open a same-page quick definition.
- Used this shared component approach to reduce duplication and keep behavior consistent across surfaces.

</section>

<section class="case-section">

## Outcome

- Compliance content became easier to understand without forcing page switching.
- Shared component architecture improved consistency and maintainability.
- The portal supported better content discoverability and smoother reading flow.

</section>

<section class="case-section">

## Notes / Lessons

In compliance products, micro-interactions can remove major friction. Shared glossary behavior delivered high UX value with a small, reusable technical surface.

</section>
