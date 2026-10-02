---
title: Saúde em Campo - Offline-first Field Architecture
order: 5
headline: Designing reliable field work for unreliable connectivity.
role: Mobile Architecture · Product Systems
disciplines: [React Native, Offline sync, SQLite]
visual: mobile
publishDate: 2026-10-01
description: An architecture for an offline-first health-field application with local data isolation, synchronization safeguards, and role-aware workflows.
tags:
  - React Native
  - Expo
  - TypeScript
  - SQLite
  - Drizzle
  - TanStack Query
  - Offline-first
---

<section class="case-section">

## Context

Saúde em Campo, also documented as SisVisita, addresses field work that cannot depend on continuous connectivity. This case describes product and technical architecture, not a claim of clinical deployment.

</section>

<section class="case-section">

## System problem

The application needed to support data capture in the field while isolating data by user, preserving intent through reconnection, and keeping permissions visible in the navigation and workflow model.

</section>

<section class="case-section">

## Architecture

- Designed with React Native, Expo, TypeScript, NativeWind, SQLite via expo-sqlite, Drizzle, and TanStack Query.
- Defined local per-user data isolation, role-aware navigation, RBAC, and risk-prioritization rules.
- Specified a synchronization queue with idempotency keys, retries, and backoff to make reconnect behavior deliberate instead of incidental.
- Kept offline capability and data boundaries central to the design.

</section>

<section class="case-section">

## Scope note

The documented evidence supports the architecture and design decisions above. It does not establish healthcare deployment, clinical outcomes, or that every subsystem was production-shipped.

</section>
