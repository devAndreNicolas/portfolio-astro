---
title: MSPA Compliance Portal
publishDate: 2026-02-01
description: |
  Compliance knowledge experience built with Astro and a shared pnpm workspace component system, enabling inline term definitions across landing and compliance pages.
tags:
  - Astro
  - SEO
  - Accessibility
  - Content Strategy
  - Knowledge Base
---

## Context

MSPA needed a clearer way to publish and consume compliance content for users who are not legal specialists.

## Problem

Compliance terms are dense and often create comprehension friction. Users needed immediate context without leaving the page, while the team needed maintainable shared behavior across products.

## Role & Ownership

I contributed to frontend architecture and UX behavior focused on comprehension and discoverability, including shared component decisions across the workspace.

## Technical Decisions

- Built the portal with Astro for performance and search discoverability.
- Implemented a shared TypeScript component in a pnpm workspace package to detect terms in Landing Page and Compliance Portal content.
- When a recognized term exists in the compliance glossary app, users can open a same-page quick definition.
- Used this shared component approach to reduce duplication and keep behavior consistent across surfaces.

## Outcome

- Compliance content became easier to understand without forcing page switching.
- Shared component architecture improved consistency and maintainability.
- The portal supported better content discoverability and smoother reading flow.

## Notes / Lessons

In compliance products, micro-interactions can remove major friction. Shared glossary behavior delivered high UX value with a small, reusable technical surface.
