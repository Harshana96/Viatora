# Feature: Stitch-Based Homepage Redesign

## Purpose

The client rejected the muted/dark-leaning visual design from the earlier
design pass ("what are UI skills do you have" → provided a redesign brief
→ client instead brought a Google Stitch export: a fully-specified,
colorful, light-first "Tropical Island Discovery" design system with a
working homepage mockup). This implements that design system and rebuilds
the homepage — and only the homepage plus the shared public header/footer
(header/footer had to change too since they wrap every page, including
the one being redesigned; other pages keep their existing look until
redesigned in a future pass using the same tokens).

## What was imported from the Stitch export

The export (`stitch_markdown_ui_generator.zip`) contained a design system
doc (`DESIGN.md`) and 5 pre-designed screens (home, enquiry, destinations,
travel categories, package detail). Only the **homepage** screen's markup
and the shared design tokens were implemented now; the other 4 screens are
reference for future pages.

## Design tokens

Full token set ported into `src/app/globals.css` as CSS custom properties
mapped via Tailwind v4's `@theme inline` (so `bg-primary`, `text-secondary`,
`bg-secondary-container`, etc. are all generated Tailwind utilities):
`surface`/`surface-crisp`/`surface-warm`/`surface-muted`/`surface-container*`,
`text-primary`/`text-secondary`/`text-muted`, `border-warm`, `primary`
(ocean blue), `secondary`/`secondary-container` (orange — the CTA color),
`tertiary` (green), `ocean-turquoise`/`sunset-coral`/`palm-emerald`/
`sand-gold`/`sand-tint` accent colors. The **existing** `--accent`/
`--background` tokens (used by `/tours`, `/destinations`, detail pages,
and the admin panel) were kept alongside, unchanged in value — nothing
outside the homepage/layout depends on the new tokens yet.

**Dark mode disabled app-wide** (explicit client request: "not want dark
theme"). `@custom-variant dark (&:where(.dark, .dark *));` in
`globals.css` switches Tailwind's `dark:` variant to only match a `.dark`
class on `<html>`, which nothing currently adds — so every `dark:` utility
across the *entire app* (not just the homepage) is now inert regardless of
OS/browser color-scheme preference. A manual toggle can be added later by
adding/removing that class; this doesn't remove the `dark:` classes
already written elsewhere, it just stops them from ever firing.

**Material Symbols Outlined** icon font added via `<link>` tags in the
root layout's `<head>` (`src/app/layout.tsx`) — a variable icon font with
custom axes (`FILL`, `wght`, `GRAD`, `opsz`) that `next/font/google`
doesn't cleanly support, so it's loaded the same way the original Stitch
HTML did. This causes one lint warning
(`@next/next/no-page-custom-font`) — a Pages-Router-era rule that doesn't
really apply to the App Router's root layout; not an error, build is
clean.

## What was deliberately changed from the Stitch export (not blind copying)

- **Two sections were missing from the export.** The Stitch homepage's
  HTML has literal `<!-- POPULAR DESTINATIONS GRID -->` and
  `<!-- WHY SRI LANKA -->` comments with no markup underneath — the export
  was incomplete. Both are required by the spec's Home section list, so
  they were designed from scratch in the same visual language (same card/
  icon-badge patterns as the sections that were provided).
- **No hardcoded/hotlinked images.** The export's editorial "4 curated
  photo" teaser row hotlinks 4 specific Google-hosted preview image URLs
  (`lh3.googleusercontent.com/aida-public/...`) captioned as real places
  (Sigiriya, Ella, Yala, Mirissa). These aren't ours to host, aren't
  guaranteed stable, and captioning a specific real landmark under an
  unverified photo would be dishonest on a real production travel site.
  This section was omitted entirely rather than carried over. Real photos
  already work end-to-end via the existing Cloudinary upload flow — once
  real destination/package photos are uploaded through the admin panel,
  they'll show up automatically (gradient placeholder is the fallback,
  same pattern used elsewhere in the app).
- **Fabricated marketing claims removed.** The export includes a
  "4.9/5 from 1,200+ Travelers" trust badge, package badges like
  "Best Seller"/"Trending" with no backing data, a "within 24 hours"
  response-time promise, and "Verified Chauffeur Guides"/"Direct 24/7
  WhatsApp Support" claims — none of which are backed by any real data or
  system in this app (no reviews/ratings model, no guide-verification
  system, no WhatsApp integration, no SLA commitment made by the
  business). These were all omitted or replaced with claims the app can
  actually stand behind (e.g. "100% Tailor-made Enquiries" — true, every
  enquiry is a custom form submission; "No online payment required" —
  true, matches the MVP's no-payment scope).
- **Package "badges"** use the package's real `travelType` instead of a
  fabricated sales/popularity label.
- **Real itinerary in the map spotlight**, not a fake static SVG. The
  export's "Interactive Journey Itinerary & Map Spotlight" section is a
  non-functional decorative SVG map with hardcoded day data and a
  `selectDay()` vanilla-JS function that only toggles CSS classes — it
  doesn't actually route anywhere or use real coordinates. This app
  already has a fully working version of exactly this feature
  (`JourneyExplorer`/`JourneyMap`, real Mapbox GL, real road routing on
  the package detail page) — so the homepage spotlight reuses that real
  component, fed by the most recently published package's actual
  itinerary data, instead of recreating Stitch's fake mockup.
  - The live Mapbox **Directions API call is skipped on the homepage**
    (`route={null}` passed to `JourneyExplorer`) — the package detail page
    is where the exact road route matters; adding that extra external API
    round-trip to every homepage load for a teaser section isn't worth
    the latency. Falls back to the straight-line route, which still
    demonstrates the click-a-day-to-focus-the-map interaction.
- **Accessibility fix, found and fixed along the way**: Material Symbols
  icon spans render their icon *name* as literal text content (e.g. the
  literal string `"hiking"`), which becomes part of the surrounding
  element's accessible name unless hidden. This was leaking into every
  icon-adjacent button/link across the new homepage and header/footer —
  e.g. a travel category link's accessible name was actually
  `"hiking Adventure Ella Rock, Knuckles Trek & Peaks"` for a screen
  reader, not `"Adventure"`. Fixed by adding `aria-hidden="true"` to every
  purely-decorative icon span (they're all paired with adjacent visible
  text, so hiding them from the accessibility tree loses nothing).
- **Mobile nav gap, found and fixed along the way**: the export's header
  nav is `hidden lg:flex` with no way to reveal it below that breakpoint —
  Stitch's own HTML had an `onclick` toggle for a `#mobile-menu` div, but
  that markup wasn't part of the homepage export I implemented from
  (footer/nav were treated as a shared component with its own, separately
  generated version). Added `src/components/layout/MobileNav.tsx` (a
  small client component, `useState`-based) so mobile visitors don't lose
  the Tours/Destinations/Enquiry nav entirely.
- **Footer links to pages that actually exist.** The export's footer has
  "Privacy Policy" and "Terms of Service" links (`href="#"`, no real
  destination) and hardcoded destination/category names. The real footer
  links "Categories" to the actual `/tours?travelType=X` filtered URLs,
  "Destinations" to real `Destination` records from the database, and
  drops Privacy Policy/Terms rather than create dead links to pages that
  don't exist.

## Technical Implementation

- `src/app/globals.css` — token definitions, dark-mode-disable variant,
  Material Symbols base CSS class, custom scrollbar styling.
- `src/app/layout.tsx` — Material Symbols font `<link>` tags.
- `src/app/(public)/layout.tsx` — new header (logo, nav, functional
  header search form posting to `/tours`, Enquire Now CTA, `MobileNav`)
  and footer (brand blurb, real destination/category/support links),
  fetches `listDestinationOptions()` for the footer.
- `src/components/layout/MobileNav.tsx` — client component, hamburger
  toggle for the header nav below `lg`.
- `src/app/(public)/page.tsx` — full rewrite: hero (gradient glow +
  3-filter search form posting to `/tours`), Travel Categories (7 tiles,
  `categoryMeta` record keyed by `TravelType` for icon/subtitle/tag/
  colors), Popular Tour Packages (`listPublishedPackages({ take: 3 })`,
  rich card with real highlights/price/travelType badge), Interactive
  Journey Itinerary & Map Spotlight (real `JourneyExplorer` fed by
  `getPackageBySlug` on the top popular package, `route={null}`), Popular
  Destinations (`listPopularDestinations(3)`, matching card style to the
  package cards for visual consistency), Why Sri Lanka (built from
  scratch, 4 icon cards, same evergreen copy as the previous design pass
  — the client's complaint was about layout/color, not this copy), final
  CTA (gradient banner, real links to `/enquiry` and `/tours`).

## Dependencies

- No new npm packages. Material Symbols is a font load (`<link>` tag),
  not an npm dependency.

## Edge Cases

- No published packages — "Popular Tour Packages" and the itinerary
  spotlight sections are both omitted (guarded on `popularPackages.length`
  and `spotlightDays.length`).
- No destinations — "Popular Destinations" section omitted; footer
  destinations column shows "Coming soon" instead of an empty list.
- Package/destination with no cover image — gradient placeholder with the
  name as text, same pattern as the rest of the app.
- Most-recently-published package has no itinerary days — spotlight
  section is skipped entirely rather than showing an empty map (this is
  what the hermetic e2e seed data exercises, since its seeded package
  intentionally has zero `TourDay` rows).

## Testing

Verified against the real local database (not just build success):
confirmed the homepage renders the actual "Colombo to Ella Explorer" /
"Cultural Triangle" / seeded destinations correctly, confirmed zero
hotlinked external image URLs in the rendered HTML, confirmed the new
design tokens and `aria-hidden` attributes are present, confirmed the
mobile menu button renders. Updated and re-ran the full e2e suite after
the redesign — several tests needed real updates (not just cosmetic
fixes) because the design intentionally changed: the old exact-text
`getByRole("heading", { name: "Viatora" })` assertion no longer applies
since "Viatora" moved from the `<h1>` to the header logo; the free-text
hero search box was replaced with the 3-dropdown Stitch search bar; the
package card is no longer a single full-card `<Link>` (matches Stitch's
own structure — only the "View Itinerary" button is a link); category
tile links needed to be scoped to `#categories` to disambiguate from the
now-identical-text links in the footer. **42 unit tests + 15 e2e tests,
all passing** after these fixes, including two real bugs caught by the
first e2e run (icon accessible-name leakage, and — indirectly, via
timeouts — the live Mapbox call being too slow for a homepage teaser).

## Related Files

- `src/app/globals.css`, `src/app/layout.tsx`
- `src/app/(public)/layout.tsx`, `src/app/(public)/page.tsx`
- `src/components/layout/MobileNav.tsx`
- `tests/e2e/public-pages.spec.ts`

## Change History

- Initial implementation from the Stitch `viatora_homepage_mvp` export.
