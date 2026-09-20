import { describe, expect, it } from "vitest";

import { haversineDistanceKm, totalRouteDistanceKm } from "@/lib/geo";

describe("haversineDistanceKm", () => {
  it("returns 0 for identical points", () => {
    const point = { latitude: 6.9271, longitude: 79.8612 };
    expect(haversineDistanceKm(point, point)).toBe(0);
  });

  it("returns the approximate real-world distance between Colombo and Kandy", () => {
    const colombo = { latitude: 6.9271, longitude: 79.8612 };
    const kandy = { latitude: 7.2906, longitude: 80.6337 };
    const distance = haversineDistanceKm(colombo, kandy);
    // Straight-line distance is ~95km; allow a reasonable margin.
    expect(distance).toBeGreaterThan(85);
    expect(distance).toBeLessThan(105);
  });

  it("is symmetric", () => {
    const a = { latitude: 6.9271, longitude: 79.8612 };
    const b = { latitude: 7.2906, longitude: 80.6337 };
    expect(haversineDistanceKm(a, b)).toBeCloseTo(haversineDistanceKm(b, a), 10);
  });
});

describe("totalRouteDistanceKm", () => {
  it("returns 0 for fewer than two points", () => {
    expect(totalRouteDistanceKm([])).toBe(0);
    expect(totalRouteDistanceKm([{ latitude: 1, longitude: 1 }])).toBe(0);
  });

  it("sums consecutive leg distances", () => {
    const a = { latitude: 6.9271, longitude: 79.8612 };
    const b = { latitude: 7.2906, longitude: 80.6337 };
    const c = { latitude: 6.8794, longitude: 81.0607 };

    const total = totalRouteDistanceKm([a, b, c]);
    const expected = haversineDistanceKm(a, b) + haversineDistanceKm(b, c);

    expect(total).toBeCloseTo(expected, 10);
  });
});
