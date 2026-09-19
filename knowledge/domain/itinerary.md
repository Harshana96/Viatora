# Itinerary

An itinerary is the ordered list of `TourDay`s belonging to a `TourPackage`.
Each `TourDay` has one or more `TourDayPlace`s (place + activities +
description + optional hotel). The public itinerary view and the journey
map are both generated from this same data — see
`knowledge/architecture/map-architecture.md`.
