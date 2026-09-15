---
title: MSPA Trust Center
order: 2
headline: Making consent visible, enforceable and auditable.
role: Frontend Engineering · Systems
disciplines: [Web Components, Edge architecture, Privacy]
visual: consent
publishDate: 2026-03-09
description: A framework-agnostic privacy layer that turns consent from a visual banner into an enforceable, auditable product capability.
tags:
  - Lit
  - Web Components
  - Edge Computing
  - Cloudflare Workers
  - Cloudflare D1
  - Cloudflare KV
  - Durable Objects
---

<section class="case-section">

## Context

Trust Center is MSPA's public-facing privacy layer, designed to run across different client websites while staying connected to Compass policy management.

</section>

<section class="case-section">

## Problem

Most consent banners provide UI but weak enforcement. MSPA needed a consent implementation that blocks third-party scripts until explicit acceptance, records consent events for auditability, and remains lightweight for production websites.

</section>

<section class="case-section">

## Role & Ownership

I contributed directly to both frontend behavior and architecture decisions, including:

- Consent banner behavior and script enforcement flow.
- Integration design between Trust Center and Compass configuration.
- Technical decisions around edge services and data persistence for audit records.

</section>

<section class="case-section">

## Technical Decisions

- Built a framework-agnostic consent UI using Lit + Web Components + Shadow DOM.
- Implemented script control flow that allows third-party execution only after explicit user acceptance.
- Added script tracking and acceptance/rejection event recording for compliance audit trails.
- Used Cloudflare KV for fast policy reads, D1 for persisted records, and Edge Workers for low-latency decision paths.
- Connected consent behavior to Compass-managed privacy settings for centralized operational control.

</section>

<section class="case-section">

## Outcome

- Delivered an enforcement-focused consent experience instead of only a visual banner.
- Created auditable consent event tracking for client compliance operations.
- Preserved low-latency behavior through edge-native architecture.
- Enabled integration flexibility through framework-agnostic delivery.

</section>

<section class="case-section">

## Notes / Lessons

Consent UX and consent enforcement are different problems. Treating enforcement and auditability as first-class requirements produced a more trustworthy implementation.

</section>
