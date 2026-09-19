# Project Instructions

## Project

Viatora — a Sri Lankan tourism discovery MVP. Public site for browsing tour
packages/destinations with an interactive itinerary + map, plus an admin
panel for managing tourism content.

## Architecture

Use the architecture documented in:

knowledge/architecture/

## Product Requirements

Use:

knowledge/product/

## Domain

Use:

knowledge/domain/

## Important Rules

- Keep the MVP simple.
- Do not introduce microservices.
- Reuse existing domain entities.
- Do not duplicate location data.
- Map and itinerary must use the same source data (Place coordinates).
- Use TypeScript strict mode.
- Validate user input with Zod.
- Follow existing project patterns.
- Read relevant knowledge files before major implementation.
- Update knowledge files when architecture or important behavior changes.

## Before Coding

1. Understand the requirement.
2. Read relevant knowledge files.
3. Inspect existing implementation.
4. Identify affected files.
5. Implement the smallest appropriate change.
6. Run tests/lint/type checks.
7. Update documentation if necessary.

## Do Not

- Add unnecessary dependencies.
- Rewrite working architecture without a documented reason.
- Hard-code tour package data in UI components.
- Hard-code map coordinates in presentation components.
- Store secrets in source code.
- Build future roadmap features before MVP requirements are complete.

## Branching

- `main` — always deployable, connected to Vercel production deploys.
- `feature/<name>` — one branch per feature, merged into `main` via PR.
