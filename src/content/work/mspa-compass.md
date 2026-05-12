---
title: MSPA Compass
publishDate: 2026-03-09
description: |
  Core MSPA SaaS platform for privacy and compliance operations, focused on intuitive LGPD workflows, scalable frontend architecture, and integrated product modules.
tags:
  - Angular
  - Signals
  - RxJS
  - Product Engineering
  - UX Strategy
  - Compliance
---

## Context

Compass is one of MSPA's core SaaS products for privacy and compliance operations, used by more than 10 companies. The product serves users with different technical backgrounds and needs clear workflows for high-responsibility tasks.

## Problem

The platform needed to make LGPD processes understandable for non-technical users while preserving operational rigor for teams handling data mapping, risk analysis, and consent operations. At the same time, delivery and ownership needed stronger structure during a critical phase.

## Role & Ownership

I worked as a Frontend Engineer with product-oriented ownership across UX, architecture, and delivery alignment. My scope included:

- Frontend architecture and implementation of core Compass flows.
- User-flow design decisions to simplify compliance journeys.
- Collaboration with stakeholders to align UX, technical constraints, and business priorities.
- Support for team process clarity in a 6-developer squad, with direct influence on 4 developers.

## Technical Decisions

- Built Compass modules with Angular, Signals, and RxJS for responsive, maintainable state flows.
- Applied a Zanzibar-style authorization approach (role and permission separation) to support clear responsibility boundaries by user role.
- Helped modularize key domains such as data mapping, risk management, and consent management, and improved their integration points.
- Strengthened testing and delivery reliability through Vitest and CI workflow improvements.
- Contributed Go endpoints needed by Compass frontend workflows where backend support was required.

## Outcome

- LGPD workflows became more accessible for non-technical users without losing domain depth.
- Compass maintained Lighthouse performance in the 90+ range across key product experiences.
- Delivery organization and ownership clarity improved during a high-pressure operational period.
- Product capabilities were delivered in a way that supported real adoption across 10+ companies.

## Notes / Lessons

Strong compliance products need both technical correctness and interaction clarity. Treating UX, permissions, and module boundaries as architecture decisions was critical to scale product usage safely.
