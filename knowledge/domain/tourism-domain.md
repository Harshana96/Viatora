# Tourism Domain

- **Destination**: a region/area travellers visit (e.g. Kandy). Has
  description, location, related places and packages.
- **Place**: a specific point of interest with coordinates and a category
  (temple, waterfall, beach, wildlife, mountain, historical site, tea
  plantation, adventure).
- **TourPackage**: a sellable multi-day tour product.
- **TourDay**: one day within a package's itinerary.
- **TourDayPlace**: join entity assigning a `Place` (and activities) to a
  `TourDay`.
- **Enquiry**: a lead submitted by a visitor about a package.
