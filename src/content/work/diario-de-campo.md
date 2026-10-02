---
title: Diário de Campo Escoteiro - Offline-first PWA
order: 6
headline: Field records that continue working after the connection drops.
role: Full-stack Web Development · Offline Systems
disciplines: [React, PWA, Synchronization]
visual: mobile
publishDate: 2026-10-01
description: An installable offline-first PWA for field records, with local data and automatic CouchDB synchronization after reconnecting.
tags:
  - React
  - TypeScript
  - Vite
  - Tailwind
  - PouchDB
  - CouchDB
  - Service Worker
---

<section class="case-section">

## Context

Field records should not disappear because a user temporarily loses internet access. Diário de Campo Escoteiro was built as an installable web application that keeps the local workflow available first.

</section>

<section class="case-section">

## Technical decisions

- Built with React, TypeScript, Vite, and Tailwind.
- Used PouchDB/CouchDB for local-first data and automatic synchronization after reconnection.
- Added a service worker and web app manifest for an installable PWA experience.
- Kept the record flow centered on continuity between offline and connected states.

</section>

<section class="case-section">

## Outcome

The project demonstrates an end-to-end offline web approach: local data, reconnection synchronization, and installable delivery in one user workflow.

</section>
