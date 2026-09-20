import { describe, expect, it } from "vitest";

import { tourPackageSchema } from "@/lib/validation/tour-package";

const validInput = {
  name: "Colombo to Ella Explorer",
  slug: "colombo-to-ella-explorer",
  coverImageUrl: "",
  durationDays: "3",
  startingPrice: "899",
  travelType: "ADVENTURE",
  description: "A journey through the hill country.",
  highlights: ["Scenic train ride"],
  included: ["Breakfast"],
  excluded: ["Flights"],
  destinationId: "dest_123",
  published: true,
};

describe("tourPackageSchema", () => {
  it("accepts valid input and coerces numeric strings", () => {
    const result = tourPackageSchema.parse(validInput);
    expect(result.durationDays).toBe(3);
    expect(result.startingPrice).toBe(899);
    expect(result.travelType).toBe("ADVENTURE");
  });

  it("allows an empty cover image URL, travelType and destinationId", () => {
    const result = tourPackageSchema.parse({
      ...validInput,
      coverImageUrl: "",
      travelType: "",
      destinationId: "",
    });
    expect(result.coverImageUrl).toBe("");
    expect(result.travelType).toBe("");
    expect(result.destinationId).toBe("");
  });

  it("rejects an invalid cover image URL", () => {
    expect(() => tourPackageSchema.parse({ ...validInput, coverImageUrl: "not-a-url" })).toThrow();
  });

  it("rejects a duration of less than 1 day", () => {
    expect(() => tourPackageSchema.parse({ ...validInput, durationDays: "0" })).toThrow();
  });

  it("rejects an invalid travel type", () => {
    expect(() => tourPackageSchema.parse({ ...validInput, travelType: "NOT_REAL" })).toThrow();
  });

  it("rejects a negative starting price", () => {
    expect(() => tourPackageSchema.parse({ ...validInput, startingPrice: "-1" })).toThrow();
  });
});
