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
