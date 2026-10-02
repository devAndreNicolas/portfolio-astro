---
title: FechaRacha - Group Contribution Goals
order: 3
headline: Trustworthy coordination for group contribution goals.
role: Full-stack Engineering · Product Systems
disciplines: [Next.js, PostgreSQL, Authorization]
visual: collaboration
publishDate: 2026-10-01
description: A full-stack product for creating group contribution goals, inviting participants, and tracking declared contributions without holding or moving money.
tags:
  - Next.js
  - React
  - TypeScript
  - Supabase
  - PostgreSQL
  - Prisma
  - Zod
  - Vitest
---

<section class="case-section">

## Context

FechaRacha supports a Brazilian coordination use case: people share a goal, invite contributors, and track declared contributions through a WhatsApp + Pix-oriented journey. The product does not custody funds.

</section>

<section class="case-section">

## Product problem

Shared contribution flows need to be simple enough to invite others, while still making ownership, membership, notifications, and progress states trustworthy.

</section>

<section class="case-section">

## Technical approach

- Built with Next.js 16, React 19, and TypeScript.
- Used Supabase Auth, PostgreSQL, and Realtime with Prisma, Zod, Resend, and Vitest.
- Implemented role-derived capabilities and contributor ownership checks at the query boundary.
- Added membership-aware visibility, shareable invitation links, notification deduplication, and goal-status transitions.
- Designed safeguards around hashed join tokens, expiry and use limits, authorization revalidation, audit events, and minimized PII.

</section>

<section class="case-section">

## Evidence of behavior

Behavior tests cover ownership restrictions, pending-invitation reuse, atomic exhaustion of the 50th invitation slot, notifications, and state transitions. Product pricing, expansion, and monetization remain roadmap hypotheses rather than shipped claims.

</section>
