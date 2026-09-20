import { describe, expect, it } from "vitest";

import { hotelSchema } from "@/lib/validation/hotel";
import { tourDaySchema } from "@/lib/validation/tour-day";
import { tourDayPlaceSchema } from "@/lib/validation/tour-day-place";

describe("hotelSchema", () => {
  it("accepts valid input and coerces rating", () => {
    const result = hotelSchema.parse({ name: "Cinnamon Grand", location: "Colombo", rating: "4.5" });
    expect(result.rating).toBe(4.5);
  });

  it("allows an omitted rating", () => {
    const result = hotelSchema.parse({ name: "Cinnamon Grand", location: "Colombo" });
    expect(result.rating).toBeUndefined();
  });

  it("rejects a rating above 5", () => {
    expect(() => hotelSchema.parse({ name: "Test", location: "Colombo", rating: "6" })).toThrow();
  });

  it("rejects an empty location", () => {
    expect(() => hotelSchema.parse({ name: "Test", location: "" })).toThrow();
  });
});

describe("tourDaySchema", () => {
  it("accepts valid input with optional fields blank", () => {
    const result = tourDaySchema.parse({
      packageId: "pkg_1",
      dayNumber: "1",
      title: "",
      description: "",
      hotelId: "",
    });
    expect(result.dayNumber).toBe(1);
  });

  it("rejects a day number below 1", () => {
    expect(() =>
      tourDaySchema.parse({ packageId: "pkg_1", dayNumber: "0", title: "", description: "", hotelId: "" }),
    ).toThrow();
  });

  it("rejects a missing packageId", () => {
    expect(() =>
      tourDaySchema.parse({ packageId: "", dayNumber: "1", title: "", description: "", hotelId: "" }),
    ).toThrow();
  });
});

describe("tourDayPlaceSchema", () => {
  it("accepts valid input with an activities list", () => {
    const result = tourDayPlaceSchema.parse({
      tourDayId: "day_1",
      placeId: "place_1",
      activities: ["Visit temple", "Lake walk"],
    });
    expect(result.activities).toHaveLength(2);
  });

  it("defaults activities to an empty array", () => {
    const result = tourDayPlaceSchema.parse({ tourDayId: "day_1", placeId: "place_1" });
    expect(result.activities).toEqual([]);
  });

  it("rejects a missing placeId", () => {
    expect(() => tourDayPlaceSchema.parse({ tourDayId: "day_1", placeId: "" })).toThrow();
  });
});
