# Feature: Admin Authentication

## Purpose

Protect every `/admin/*` route so only provisioned admin users can manage
tourism content. There is no public admin signup — admins are provisioned
out-of-band by whoever controls the server/database.

## User Experience

Visiting any `/admin/*` route while signed out redirects to
`/admin/login?callbackUrl=<original path>`. After a successful sign-in,
the user is sent back to that original path. Once signed in, every admin
page shows a top nav (Dashboard/Destinations/Places/Tours/Hotels/
Enquiries) plus a "Sign out" button, rendered by the shared
`src/app/admin/layout.tsx`.

## Requirements

- Every `/admin/*` route requires an authenticated session (enforced in
  middleware, not per-page, so a new admin page is protected automatically
  by virtue of living under `/admin`).
- `/admin/login` itself must stay accessible when signed out, and redirect
  to `/admin/dashboard` if already signed in.
- No public registration — admin accounts are created via a CLI script.
- Passwords are hashed (bcrypt), never stored or logged in plain text.

## Data

`User` (`id`, `email` unique, `name`, `passwordHash`).

## Technical Implementation

- **Auth.js v5** (`next-auth@beta`) with a single `Credentials` provider.
  Config is **split in two**:
  - `src/lib/auth.config.ts` — edge-safe: just `session` strategy (`jwt`),
    `pages`, and an **empty** `providers` array. No Prisma, no bcrypt.
  - `src/lib/auth.ts` — the full config, spreading `authConfig` and adding
    the `Credentials` provider (which needs `bcrypt` + Prisma in
    `authorize()`). Exports `handlers`, `auth`, `signIn`, `signOut` — used
    everywhere except middleware.
- `authorize()` looks up the `User` by email and compares the submitted
  password against `passwordHash` with `bcrypt.compare`.
- `src/app/api/auth/[...nextauth]/route.ts` re-exports `handlers` as
  `GET`/`POST` — the standard Auth.js App Router wiring.
- `src/middleware.ts` creates its **own** `NextAuth(authConfig)` instance
  (not the one from `src/lib/auth.ts`) and uses only that instance's
  `auth()` to check the request. It wraps every request matching
  `/admin/:path*`: no session + not `/admin/login` → redirect to login
  with a `callbackUrl`; has a session + on `/admin/login` → redirect to
  the dashboard. This is the single enforcement point — individual admin
  pages/actions do not each re-check auth. Verifying an existing JWT
  session doesn't need the providers list at all (that's only used during
  the actual sign-in step), so the empty-providers `authConfig` is enough
  here and keeps bcrypt/Prisma out of the Edge Function bundle — see
  Known Issue below for why this split exists.
- The login form (`src/app/admin/login/page.tsx`) posts to a Server Action
  (`src/app/admin/login/actions.ts`) that calls Auth.js's server-side
  `signIn("credentials", ...)` directly — no client-side JS/session
  provider needed. On failure it catches `AuthError` and redirects back to
  `/admin/login?error=1` (page reads `searchParams.error` to show a
  message); any other thrown error (including Auth.js's internal
  `NEXT_REDIRECT` on success) is rethrown so it isn't swallowed.
- `src/app/admin/layout.tsx` reads the session server-side and renders the
  nav + sign-out form only when signed in (so it's absent on the login
  page itself).
- Admin accounts are provisioned with `npm run create-admin -- <email>
  <password> [name]` (`scripts/create-admin.ts`), which upserts a `User`
  with a freshly bcrypt-hashed password. Re-running it for an existing
  email resets that user's password.

## Dependencies

- `next-auth@beta` (Auth.js v5), `bcryptjs`
- `AUTH_SECRET` environment variable (session/JWT signing)
- `User` model in the schema

## Known Issue

Next.js 16 deprecated the `middleware.ts` file convention in favor of
`proxy.ts` (still supported, just warns on build/dev). The official
codemod (`npx @next/codemod@canary middleware-to-proxy .`) did not
transform this file — it likely doesn't yet recognize the Auth.js
`auth((req) => ...)` wrapper pattern. Left as `middleware.ts` rather than
hand-migrating a security-critical file against an unverified new API
shape. Revisit when the codemod (or Auth.js's own docs) supports this
pattern, or when `middleware.ts` support is actually removed.

## Fixed Issue: Edge Function size on Vercel

The first production deploy on Vercel failed: `The Edge Function
"_middleware" size is 1.03 MB and your plan size limit is 1 MB.` Cause:
`src/middleware.ts` originally imported `auth` from `src/lib/auth.ts`,
which includes the `Credentials` provider — pulling `bcryptjs` and the
generated Prisma client (both Node-only, both large) into the Edge
Function bundle, even though middleware never actually calls
`authorize()`. Fixed by extracting `authConfig` (session strategy + pages,
no providers) into `src/lib/auth.config.ts`, having `src/lib/auth.ts`
spread it and add the provider, and having `src/middleware.ts` build its
own `NextAuth(authConfig)` instance instead of importing the full one.
Verified the compiled middleware chunk (`.next/server/edge/chunks/...`)
dropped to ~317 KB with zero occurrences of `bcrypt` or `PrismaClient` in
it, and re-ran the full auth e2e suite to confirm login/logout/route
protection all still work identically after the split.

## Edge Cases

- Wrong password / unknown email — `authorize()` returns `null`, Auth.js
  surfaces a `CredentialsSignin` error, login page shows a generic
  "Invalid email or password" message (does not reveal which field was
  wrong).
- Already signed in, visits `/admin/login` — redirected straight to the
  dashboard instead of seeing the form again.
- Deep link to a specific admin page while signed out — `callbackUrl`
  round-trip returns the user to that exact page after signing in.

## Testing

Verified against the real database: created a bcrypt-hashed admin user via
`npm run create-admin`, confirmed `bcrypt.compare` accepts the correct
password and rejects a wrong one, and confirmed the middleware actually
redirects unauthenticated requests to `/admin/*` (307 to
`/admin/login?callbackUrl=...`) while `/admin/login` itself stays
reachable. The full interactive sign-in (via the Server Action) needs a
real browser to verify end-to-end — raw HTTP tools can't easily replicate
Next.js's Server Action request framing. No automated test yet.

## Related Files

- `src/lib/auth.config.ts` — edge-safe shared config (no providers)
- `src/lib/auth.ts` — full Auth.js config, Credentials provider
- `src/middleware.ts` — route protection (its own lightweight NextAuth instance)
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js route handler
- `src/app/admin/login/page.tsx`, `src/app/admin/login/actions.ts` — sign-in form/action
- `src/app/admin/layout.tsx` — shared admin nav + sign-out
- `scripts/create-admin.ts` — admin user provisioning CLI

## Change History

- Initial implementation.
