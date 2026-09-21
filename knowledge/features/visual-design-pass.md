# Feature: Visual Design Pass

## Purpose

The functional MVP was flagged as looking "wireframe-like" — plain black/
white/zinc styling with no accent color, no site navigation on public
pages, generic bordered cards, and no interactive states. This pass
applies the `redesign-existing-projects` skill's audit and fix-priority
order to the existing Tailwind v4 stack, without migrating frameworks or
rewriting functionality.

## What Changed

### Foundation
- **Font bug fixed**: `globals.css`'s `body` rule hardcoded
  `font-family: Arial, Helvetica, sans-serif`, silently overriding the
  already-loaded Geist font. Now uses `var(--font-sans)` first.
- **One accent color**: teal (`--color-accent`, `#0f766e` light /
  `#2dd4bf` dark) — the app previously had zero accent color anywhere.
- **Warm neutrals**: switched every `zinc-*` class to `stone-*` (warm
  gray) across the whole codebase to match the warm off-white/off-black
  background (`#fdfbf7` / `#12100e`) — mixing warm and cool grays was one
  of the flagged issues.
- `scroll-behavior: smooth` globally, `text-wrap: balance` on headings.

### Components (`src/components/ui/`)
- `Button`: pill shape, hover lift (`-translate-y-0.5`) + press feedback
  (`active:scale-[0.98]`), visible focus ring, primary variant now uses
  the accent color instead of plain black/white inversion, added a
  `ghost` variant.
- `Input`/`Select`/`Textarea`: accent-colored focus ring (previously just
  a border color change), `rounded-lg` instead of `rounded-md`.

### Cards
- `PackageCard`/`DestinationCard`: removed the generic "border + flat
  background" look. Now `rounded-2xl` with `shadow-sm` that grows to
  `shadow-xl` + lifts on hover, `aspect-[4/3]` image with a subtle scale
  on hover, and a gradient placeholder (instead of blank space) when
  there's no cover image yet.

### Public site structure
- **New `src/app/(public)/layout.tsx`** — there was previously no shared
  header or footer on any public page; every page was a dead end
  reachable only by typing a URL or hitting the back button. Now every
  public page has a sticky header (logo + Tours/Destinations/Enquiry nav)
  and a footer (same nav + copyright). No fake/placeholder legal links
  were added — only real destinations exist.
- Homepage: hero merged with the search box, gradient background bands,
  eyebrow labels above each section heading, "Why Sri Lanka" changed from
  a flat 4-column grid to a numbered 2-column list with an accent left
  border (still not a 3-equal-card layout).
- `/tours` and `/destinations` list pages: same eyebrow+heading treatment,
  filter bar on `/tours` now sits in a `rounded-2xl` tinted panel instead
  of bare form fields.
- Admin login page: centered card on a gradient background instead of a
  bare form on a flat page.
- Admin nav: new `AdminNavLink` client component (`usePathname`) shows
  which section is active — there was previously no current-page
  indicator at all.

## What Was Deliberately Not Done

- No new npm dependencies, no framework/styling-library migration (stayed
  on Tailwind v4 per the skill's rules).
- No favicon replacement — still the default Next.js icon. Doing this
  properly needs generated icon assets, which is a separate, bigger task
  than a CSS/markup pass.
- No stock/placeholder photography added to the hero or empty sections —
  using generic unrelated stock images on a real Sri Lanka tourism site
  would look fake; gradient/color treatment was used instead. Real
  destination/package photos (already supported via the existing
  Cloudinary upload flow) will look better once real content is added.
- Map marker/route colors (`JourneyMap`, `PlacesMap`) were left as-is —
  they're functional map elements, not part of the generic-UI complaint.
- No dark-mode toggle was added; dark mode still follows
  `prefers-color-scheme` only, same as before this pass.

## Testing

Verified against the full test suite after the change (not just build
success): **42/42 unit tests and 15/15 e2e tests still pass**, including
the admin login flow, enquiry submission, and homepage content tests that
assert on visible text/links — confirming the visual changes didn't touch
any functional selector or break any flow. `next build` and `eslint` both
clean. Content-checked the rendered HTML of `/`, `/tours`, `/destinations`
and `/admin/login` for the new header/nav/accent classes and confirmed
the Geist font class is actually applied to `<html>` now.

No visual/screenshot verification was possible from this session (no
browser tool available in this CLI environment) — the user needs to
review the actual rendered pages themselves.

## Related Files

- `src/app/globals.css`, `src/app/layout.tsx`
- `src/components/ui/button.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`
- `src/components/tours/PackageCard.tsx`, `src/components/destinations/DestinationCard.tsx`
- `src/app/(public)/layout.tsx` (new), `src/app/(public)/page.tsx`,
  `src/app/(public)/tours/page.tsx`, `src/app/(public)/destinations/page.tsx`
- `src/app/admin/login/page.tsx`, `src/app/admin/layout.tsx`,
  `src/components/admin/AdminNavLink.tsx` (new)

## Change History

- Initial visual design pass.
