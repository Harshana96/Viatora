# Map Architecture

- Mapbox GL JS renders the journey map from `TourDay` -> `TourDayPlace` ->
  `Place` records for the current package.
- Markers are numbered by day order; a route line connects them in
  sequence. Mapbox Directions API may be used for realistic route lines and
  approximate distance if required.
- The map component and the itinerary list component both subscribe to the
  same client-side representation of the day/place data — no separate map
  data file.
- Interaction: selecting a day scrolls/focuses the map to that location;
  selecting a marker highlights the matching itinerary day.
- Map keys: public Mapbox token only on the client; any privileged token
  stays server-side.
