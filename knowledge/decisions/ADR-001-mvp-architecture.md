# ADR-001: Use Next.js Monolithic Architecture

## Status

Accepted

## Context

The MVP needs a public tourism website and admin panel.

## Decision

Use a single Next.js application with PostgreSQL (via Prisma).

## Reasons

- Faster MVP development
- Easier deployment (single Vercel project)
- Simpler maintenance
- Suitable for current scale

## Consequences

The application is simpler initially. If future scale requires separation,
services can be extracted later.
