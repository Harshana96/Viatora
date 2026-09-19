# Sri Lanka Tourism MVP — Product & Claude Code Specification

## 1. Project Overview

Build an MVP tourism web application focused on Sri Lankan tour discovery.

### Core idea

Users can:

- Discover Sri Lankan tour packages.
- View package details.
- See a day-by-day itinerary.
- See the complete journey on an interactive map.
- Explore destinations and places.
- Send a tour enquiry.

Admins can:

- Create and manage destinations.
- Create and manage places.
- Create tour packages.
- Build day-by-day itineraries.
- Assign places to each day.
- Manage package images.
- View enquiries.

### MVP product statement

> Discover Sri Lanka, understand the complete journey visually, and enquire about a tour.

The interactive itinerary + map experience is a key feature of the MVP.

---

# 2. MVP Scope

## 2.1 Public Website

### Home

Sections:

- Hero section
- Search / discover tours
- Popular tour packages
- Popular destinations
- Travel categories
- Why Sri Lanka
- Call to action

### Tour Packages

Features:

- Package listing
- Search
- Filter by duration
- Filter by destination/region
- Filter by travel type
- Filter by approximate budget
- Package cards

### Tour Package Details

Each package should contain:

- Cover image
- Package name
- Duration
- Price or starting price
- Short description
- Highlights
- Interactive journey map
- Day-by-day itinerary
- Places visited
- Hotels/accommodation if available
- What's included
- What's not included
- Gallery
- Enquiry button

### Destinations

Each destination page should contain:

- Destination image
- Description
- Location
- Things to do
- Places to visit
- Related tour packages
- Map

### Enquiry

Users can submit:

- Name
- Email
- WhatsApp/phone
- Preferred travel date
- Number of travellers
- Selected package
- Message

No online payment is required for MVP.

---

# 3. Main Differentiator — Interactive Journey Map

The package page should visually connect the itinerary with the map.

Example:

```text
Day 01
Colombo
   ↓
Day 02
Kandy
   ↓
Day 03
Nuwara Eliya
   ↓
Day 04
Ella
   ↓
Day 05
Yala
   ↓
Day 06
Mirissa
   ↓
Day 07
Galle
```

Map requirements:

- Mapbox map
- Numbered location markers
- Route line connecting locations
- Different days represented clearly
- Clicking a day focuses the map on that day's location
- Clicking a map marker highlights the corresponding itinerary item
- Map automatically fits the complete journey
- Show approximate route distance where practical
- Mobile-friendly map interaction

The itinerary and map must use the same underlying location data.

Do NOT manually maintain separate map data.

---

# 4. Admin Panel

## Dashboard

Show:

- Total packages
- Total destinations
- Total places
- Total enquiries

## Tour Packages

Admin can:

- Create
- Edit
- Publish/unpublish
- Delete/archive
- Upload images
- Configure duration
- Configure price
- Add highlights
- Add included/excluded items

## Itinerary Builder

Admin can create:

```text
Package
 ├── Day 1
 │    ├── Place
 │    ├── Activities
 │    ├── Description
 │    └── Hotel
 ├── Day 2
 │    ├── Place
 │    ├── Activities
 │    ├── Description
 │    └── Hotel
 └── Day 3
      └── ...
```

The system should generate the public itinerary and map from this data.

## Destinations

Admin can:

- Create destination
- Edit destination
- Add description
- Add coordinates
- Add images
- Assign places
- Assign related packages

## Places

Admin can:

- Create place
- Edit place
- Add coordinates
- Add description
- Add images
- Add category

Examples:

- Temple
- Waterfall
- Beach
- Wildlife
- Mountain
- Historical site
- Tea plantation
- Adventure

## Enquiries

Admin can:

- View enquiries
- View enquiry details
- Change enquiry status
- Add internal notes

Statuses:

```text
NEW
CONTACTED
IN_PROGRESS
COMPLETED
CANCELLED
```

---

# 5. Recommended Technology

Use technologies suitable for Claude Code development.

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui where useful

## Backend

For MVP, prefer:

- Next.js App Router
- Server Actions / Route Handlers where appropriate

Avoid creating a separate backend service unless there is a real requirement.

## Database

- PostgreSQL
- Prisma ORM

## Maps

- Mapbox
- Mapbox GL JS
- Mapbox Directions API if route calculation is required

Keep all map API keys server-side where required.

## Images

Use:

- Cloudinary

or

- S3-compatible object storage

## Authentication

Use a mature authentication solution suitable for Next.js.

Admin authentication is required.

## Validation

- Zod

## Forms

- React Hook Form + Zod

## Testing

- Vitest or Jest for unit tests
- Playwright for important end-to-end flows

## Code Quality

- ESLint
- Prettier
- TypeScript strict mode

---

# 6. Suggested Architecture

```text
Browser
   |
   v
Next.js Application
   |
   +------------------+
   |                  |
Public Website      Admin Panel
   |                  |
   +--------+---------+
            |
            v
       Application Layer
            |
            v
         Prisma ORM
            |
            v
       PostgreSQL

External Services
   |
   +-- Mapbox
   +-- Cloudinary
```

Keep the architecture simple.

Do not introduce microservices for the MVP.

---

# 7. Project File Structure

Recommended structure:

```text
sri-lanka-tourism/
│
├── .claude/
│   ├── CLAUDE.md
│   ├── rules/
│   │   ├── architecture.md
│   │   ├── coding-standards.md
│   │   ├── database.md
│   │   ├── ui-ux.md
│   │   └── security.md
│   │
│   └── skills/
│       ├── tourism-package.md
│       ├── itinerary-map.md
│       ├── admin-crud.md
│       └── knowledge-base.md
│
├── knowledge/
│   ├── README.md
│   ├── product/
│   │   ├── vision.md
│   │   ├── mvp-scope.md
│   │   └── user-flows.md
│   │
│   ├── architecture/
│   │   ├── system-architecture.md
│   │   ├── frontend.md
│   │   ├── database.md
│   │   └── map-architecture.md
│   │
│   ├── domain/
│   │   ├── tourism-domain.md
│   │   ├── tour-packages.md
│   │   ├── destinations.md
│   │   └── itinerary.md
│   │
│   ├── decisions/
│   │   └── ADR-001-mvp-architecture.md
│   │
│   ├── features/
│   │   ├── package-management.md
│   │   ├── itinerary-builder.md
│   │   ├── interactive-map.md
│   │   └── enquiries.md
│   │
│   └── operations/
│       ├── development.md
│       ├── deployment.md
│       └── environment-variables.md
│
├── docs/
│   ├── setup.md
│   ├── deployment.md
│   └── api.md
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── tours/
│   │   │   ├── destinations/
│   │   │   └── enquiry/
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── tours/
│   │   │   ├── destinations/
│   │   │   ├── places/
│   │   │   └── enquiries/
│   │   │
│   │   ├── api/
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── map/
│   │   ├── tours/
│   │   ├── destinations/
│   │   ├── itinerary/
│   │   └── admin/
│   │
│   ├── lib/
│   │   ├── db.ts
│   │   ├── mapbox.ts
│   │   ├── cloudinary.ts
│   │   ├── validation/
│   │   └── utils/
│   │
│   ├── server/
│   │   ├── tours/
│   │   ├── destinations/
│   │   ├── places/
│   │   └── enquiries/
│   │
│   ├── types/
│   └── config/
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

---

# 8. Database Model

Initial entities:

```text
User
Destination
Place
TourPackage
TourDay
TourDayPlace
Hotel
Image
Enquiry
```

Relationship:

```text
Destination
    |
    +---- Place
    |
    +---- TourPackage
              |
              +---- TourDay
                       |
                       +---- TourDayPlace
                                  |
                                  +---- Place
```

A place should have coordinates:

```text
latitude
longitude
```

This allows the same place data to be used for:

- Destination pages
- Package itinerary
- Map markers
- Route generation

---

# 9. UX Principles

The application should feel like a modern travel product.

## Mobile first

Most tourism users may access the website from mobile.

Design for:

```text
Mobile
   ↓
Tablet
   ↓
Desktop
```

## Package page

Recommended layout:

```text
Hero
   ↓
Package summary
   ↓
Journey map
   ↓
Day-by-day itinerary
   ↓
Places
   ↓
Gallery
   ↓
Included / excluded
   ↓
Enquiry CTA
```

## Map + itinerary interaction

Desktop:

```text
+----------------------+----------------------+
|                      |                      |
|      ITINERARY       |        MAP           |
|                      |                      |
| Day 01               |       ● Colombo      |
| Day 02               |          \           |
| Day 03               |           ● Kandy    |
| Day 04               |             \        |
|                      |              ● Ella  |
+----------------------+----------------------+
```

Mobile:

```text
MAP
-----
[Interactive map]

ITINERARY
----------
Day 01
Colombo

Day 02
Kandy

Day 03
Ella
```

---

# 10. Knowledge Base Strategy

The knowledge base is important because Claude Code will be used throughout development.

The knowledge base should be the project's source of truth.

## Rules

1. Do not put everything into one large document.
2. Keep product, architecture, domain, decisions and implementation knowledge separate.
3. Update knowledge when an important decision changes.
4. Do not document temporary debugging information as permanent architecture.
5. Record important architectural decisions as ADRs.
6. Keep documentation close to the code.
7. Claude Code should read relevant knowledge before implementing major features.

---

# 11. Knowledge Base Structure

```text
knowledge/
│
├── README.md
│
├── product/
│   ├── vision.md
│   ├── mvp-scope.md
│   └── user-flows.md
│
├── architecture/
│   ├── system-architecture.md
│   ├── frontend.md
│   ├── database.md
│   └── map-architecture.md
│
├── domain/
│   ├── tourism-domain.md
│   ├── tour-packages.md
│   ├── destinations.md
│   └── itinerary.md
│
├── features/
│   ├── package-management.md
│   ├── itinerary-builder.md
│   ├── interactive-map.md
│   └── enquiries.md
│
├── decisions/
│   └── ADR-001-mvp-architecture.md
│
└── operations/
    ├── development.md
    ├── deployment.md
    └── environment-variables.md
```

---

# 12. Knowledge File Template

Use this template for feature documentation:

```markdown
# Feature: Interactive Journey Map

## Purpose

Explain why this feature exists.

## User Experience

Explain how the user interacts with it.

## Requirements

- Requirement 1
- Requirement 2
- Requirement 3

## Data

List the entities and fields required.

## Technical Implementation

Explain the technical approach.

## Dependencies

- Mapbox
- Tour package data
- Places

## Edge Cases

- Package has one location
- Location has missing coordinates
- Route API fails
- Invalid coordinates

## Testing

List important test scenarios.

## Related Files

List the important source files.

## Change History

Document important changes.
```

---

# 13. CLAUDE.md Strategy

Create a root `.claude/CLAUDE.md`.

It should tell Claude Code:

```markdown
# Project Instructions

## Project

This is a Sri Lankan tourism discovery MVP.

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
- Map and itinerary must use the same source data.
- Use TypeScript strict mode.
- Validate user input.
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
- Build future features before MVP requirements are complete.
```

---

# 14. Claude Code Development Method

Use this workflow for every major feature:

```text
Requirement
    ↓
Read Knowledge Base
    ↓
Inspect Existing Code
    ↓
Create/Update Technical Plan
    ↓
Implement
    ↓
Test
    ↓
Review
    ↓
Update Knowledge Base
    ↓
Commit
```

Example Claude Code request:

```text
Implement the Interactive Journey Map feature.

Before coding:
1. Read .claude/CLAUDE.md
2. Read knowledge/features/interactive-map.md
3. Read knowledge/architecture/map-architecture.md
4. Inspect the existing tour, itinerary and place implementation.

Then:
- Create the required components.
- Reuse existing Place and TourDay data.
- Do not duplicate location data.
- Add tests.
- Run lint and type checking.
- Update the relevant knowledge files if implementation decisions changed.
```

---

# 15. ADR Method

Use Architecture Decision Records for important decisions.

Example:

```text
knowledge/decisions/ADR-001-mvp-architecture.md
```

Template:

```markdown
# ADR-001: Use Next.js Monolithic Architecture

## Status

Accepted

## Context

The MVP needs a public tourism website and admin panel.

## Decision

Use a single Next.js application with PostgreSQL.

## Reasons

- Faster MVP development
- Easier deployment
- Simpler maintenance
- Suitable for current scale

## Consequences

The application is simpler initially.

If future scale requires separation, services can be extracted later.
```

Use new ADRs for significant decisions instead of silently changing architecture.

---

# 16. Development Milestones

## Milestone 1 — Project Foundation

- Next.js setup
- TypeScript
- Tailwind
- Database
- Prisma
- Authentication
- Base UI
- Knowledge base
- Claude Code rules

## Milestone 2 — Tourism Data

- Destinations
- Places
- Tour packages
- Tour days
- Hotels
- Images
- Database seed data

## Milestone 3 — Admin

- Dashboard
- Package CRUD
- Destination CRUD
- Place CRUD
- Itinerary builder
- Enquiry management

## Milestone 4 — Public Website

- Home
- Package listing
- Package detail
- Destination pages
- Responsive design

## Milestone 5 — Interactive Map

- Mapbox
- Markers
- Route
- Itinerary/map synchronization
- Mobile UX

## Milestone 6 — Enquiry

- Enquiry form
- Validation
- Database storage
- Admin enquiry management

## Milestone 7 — Testing & Deployment

- Unit tests
- E2E tests
- Security review
- Performance review
- Production deployment

---

# 17. MVP Definition of Done

The MVP is complete when:

- [ ] Admin can create destinations.
- [ ] Admin can create places with coordinates.
- [ ] Admin can create tour packages.
- [ ] Admin can create day-by-day itineraries.
- [ ] Public users can browse packages.
- [ ] Public users can view package details.
- [ ] Package itinerary is displayed.
- [ ] Package route is displayed on an interactive map.
- [ ] Map and itinerary interact with each other.
- [ ] Users can submit an enquiry.
- [ ] Admin can view enquiries.
- [ ] Website works well on mobile.
- [ ] Application has basic SEO.
- [ ] Tests cover important flows.
- [ ] Production deployment works.
- [ ] Knowledge base is updated.

---

# 18. Future Roadmap — NOT MVP

After validating the MVP, consider:

```text
Phase 2
- User accounts
- Reviews
- Tour operators
- More advanced search
- Wishlist
- Better enquiry workflow

Phase 3
- Online booking
- Payments
- Hotel booking
- Operator dashboard
- Availability management

Phase 4
- AI itinerary planner
- Personalized recommendations
- Multi-language support
- Mobile application
- Partner marketplace
```

Do not implement these until the MVP has been validated.

---

# 19. Initial Claude Code Prompt

Use this as the first Claude Code instruction:

```text
You are working on a Sri Lankan tourism discovery MVP.

Read the project specification and knowledge base before making implementation decisions.

First inspect:
- .claude/CLAUDE.md
- knowledge/product/
- knowledge/architecture/
- knowledge/domain/

Do NOT immediately start implementing everything.

First:
1. Inspect the repository.
2. Identify the current project state.
3. Compare the repository against the MVP specification.
4. Create a practical implementation plan.
5. Identify missing architecture, database models, pages and components.
6. Present the plan before making major changes.

Important principles:
- Keep the MVP simple.
- Use Next.js + TypeScript + PostgreSQL + Prisma.
- Use Mapbox for the interactive journey map.
- Use one application instead of microservices.
- Keep itinerary and map data synchronized through the database.
- Build the admin panel early enough to manage tourism content.
- Do not build future roadmap features.
- Follow the knowledge base.
- Update the knowledge base when important implementation decisions change.
```

---

# 20. Recommended First Build Order

Start Claude Code in this exact order:

```text
01. Project foundation
        ↓
02. Database schema
        ↓
03. Knowledge base + CLAUDE.md
        ↓
04. Admin authentication
        ↓
05. Destinations + Places
        ↓
06. Tour Packages
        ↓
07. Itinerary Builder
        ↓
08. Public Package Pages
        ↓
09. Interactive Map
        ↓
10. Enquiry System
        ↓
11. Testing
        ↓
12. Deployment
```

The most important thing is to **build the data model correctly first**. The map, itinerary, destination pages and package pages should all be generated from the same structured tourism data rather than separate hard-coded content.
