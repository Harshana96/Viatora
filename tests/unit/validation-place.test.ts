import { describe, expect, it } from "vitest";

import { placeSchema } from "@/lib/validation/place";

const validInput = {
  name: "Temple of the Tooth",
  slug: "temple-of-the-tooth",
  description: "Sacred Buddhist temple",
  category: "TEMPLE",
  latitude: "7.2936",
  longitude: "80.6413",
  destinationId: "dest_123",
};

describe("placeSchema", () => {
  it("accepts valid input", () => {
    const result = placeSchema.parse(validInput);
    expect(result.category).toBe("TEMPLE");
    expect(result.latitude).toBe(7.2936);
  });

  it("rejects an invalid category", () => {
    expect(() => placeSchema.parse({ ...validInput, category: "NOT_A_CATEGORY" })).toThrow();
  });

  it("rejects a missing destinationId", () => {
    const { destinationId, ...rest } = validInput;
    void destinationId;
    expect(() => placeSchema.parse(rest)).toThrow();
  });

  it("rejects an empty description", () => {
    expect(() => placeSchema.parse({ ...validInput, description: "" })).toThrow();
  });
});
