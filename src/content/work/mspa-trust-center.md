---
title: MSPA Trust Center
publishDate: 2026-03-09
description: |
  Enforcement-focused consent and transparency layer integrated with Compass, built with Web Components and Cloudflare edge services for auditable and low-latency privacy operations.
tags:
  - Lit
  - Web Components
  - Edge Computing
  - Cloudflare Workers
  - Cloudflare D1
  - Cloudflare KV
  - Durable Objects
---

## Context

Trust Center is MSPA's public-facing privacy layer, designed to run across different client websites while staying connected to Compass policy management.

## Problem

Most consent banners provide UI but weak enforcement. MSPA needed a consent implementation that blocks third-party scripts until explicit acceptance, records consent events for auditability, and remains lightweight for production websites.

## Role & Ownership

I contributed directly to both frontend behavior and architecture decisions, including:

- Consent banner behavior and script enforcement flow.
- Integration design between Trust Center and Compass configuration.
- Technical decisions around edge services and data persistence for audit records.

## Technical Decisions

- Built a framework-agnostic consent UI using Lit + Web Components + Shadow DOM.
- Implemented script control flow that allows third-party execution only after explicit user acceptance.
- Added script tracking and acceptance/rejection event recording for compliance audit trails.
- Used Cloudflare KV for fast policy reads, D1 for persisted records, and Edge Workers for low-latency decision paths.
- Connected consent behavior to Compass-managed privacy settings for centralized operational control.

## Outcome

- Delivered an enforcement-focused consent experience instead of only a visual banner.
- Created auditable consent event tracking for client compliance operations.
- Preserved low-latency behavior through edge-native architecture.
- Enabled integration flexibility through framework-agnostic delivery.

## Notes / Lessons

Consent UX and consent enforcement are different problems. Treating enforcement and auditability as first-class requirements produced a more trustworthy implementation.
