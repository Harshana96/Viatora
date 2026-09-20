export const MAPBOX_PUBLIC_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

// Server-only helper for calls needing the privileged token (e.g. Directions
// API). Never expose MAPBOX_SECRET_TOKEN to the client.
export function getMapboxSecretToken(): string {
  const token = process.env.MAPBOX_SECRET_TOKEN;
  if (!token) {
    throw new Error("MAPBOX_SECRET_TOKEN is not set");
  }
  return token;
}

// Directions API works with a public token too; prefer the secret token
// server-side when one has been configured.
function getDirectionsToken(): string {
  return process.env.MAPBOX_SECRET_TOKEN || MAPBOX_PUBLIC_TOKEN;
}

export type DirectionsRoute = {
  coordinates: [number, number][];
  distanceKm: number;
  durationMinutes: number;
};

type DirectionsPoint = { latitude: number; longitude: number };

/**
 * Fetches a road-following driving route through the given points, in order,
 * via the Mapbox Directions API. Returns null if there's no token, fewer
 * than 2 points, or the request fails — callers should fall back to a
 * straight line between points in that case.
 */
export async function fetchDrivingRoute(points: DirectionsPoint[]): Promise<DirectionsRoute | null> {
  const token = getDirectionsToken();
  if (!token || points.length < 2) {
    return null;
  }

  const coordinates = points.map((point) => `${point.longitude},${point.latitude}`).join(";");
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&access_token=${token}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const route = data.routes?.[0];
    if (!route?.geometry?.coordinates) {
      return null;
    }

    return {
      coordinates: route.geometry.coordinates as [number, number][],
      distanceKm: route.distance / 1000,
      durationMinutes: route.duration / 60,
    };
  } catch {
    return null;
  }
}
