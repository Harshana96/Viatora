# Knowledge Base

This directory is the project's source of truth. Claude Code (and human
contributors) should read the relevant section here before implementing
major features, and update it when architecture, domain rules, or feature
behavior change.

- `product/` — vision, MVP scope, user flows.
- `architecture/` — system, frontend, database, map architecture.
- `domain/` — tourism domain concepts and terminology.
- `decisions/` — Architecture Decision Records (ADRs).
- `features/` — one document per major feature.
- `operations/` — development, deployment, environment variables.

Rules:

1. Do not put everything into one large document.
2. Keep product, architecture, domain, decisions and implementation
   knowledge separate.
3. Update knowledge when an important decision changes.
4. Do not document temporary debugging information as permanent
   architecture.
5. Record important architectural decisions as ADRs.
6. Keep documentation close to the code.
7. Read relevant knowledge before implementing major features.
