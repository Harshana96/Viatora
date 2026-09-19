# Skill: Tourism Package

Use when creating or modifying tour package features (listing, detail page,
admin package CRUD).

1. Read `knowledge/domain/tour-packages.md`.
2. Read `knowledge/features/package-management.md`.
3. Reuse `TourPackage`, `TourDay`, `TourDayPlace` Prisma models — do not
   introduce parallel structures.
4. Public package pages must render itinerary and map from the same
   `TourDay`/`Place` data (see itinerary-map skill).
