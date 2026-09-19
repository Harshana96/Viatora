# Coding Standards

- TypeScript strict mode everywhere.
- ESLint + Prettier must pass before a change is considered done.
- Validate all external input (forms, route handlers, server actions) with
  Zod schemas defined in `src/lib/validation/`.
- Co-locate feature UI in `src/components/<feature>/`; keep server-only logic
  in `src/server/<feature>/`.
- Prefer small, composable functions over large multi-purpose ones.
- No unused dependencies; justify any new dependency in the PR description.
