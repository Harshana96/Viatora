import { describe, expect, it } from "vitest";

import { destinationSchema } from "@/lib/validation/destination";

const validInput = {
  name: "Kandy",
  slug: "kandy",
  description: "Hill capital of Sri Lanka",
  location: "Central Province",
  thingsToDo: ["Temple of the Tooth", "Botanical Gardens"],
  latitude: "7.2906",
  longitude: "80.6337",
};

describe("destinationSchema", () => {
  it("accepts valid input and coerces numeric strings", () => {
    const result = destinationSchema.parse(validInput);
    expect(result.latitude).toBe(7.2906);
    expect(result.longitude).toBe(80.6337);
    expect(result.thingsToDo).toEqual(["Temple of the Tooth", "Botanical Gardens"]);
  });

  it("defaults thingsToDo to an empty array when omitted", () => {
    const { thingsToDo, ...rest } = validInput;
    void thingsToDo;
    const result = destinationSchema.parse(rest);
    expect(result.thingsToDo).toEqual([]);
  });

  it("rejects an empty name", () => {
    expect(() => destinationSchema.parse({ ...validInput, name: "" })).toThrow();
  });

  it("rejects a slug with uppercase letters or spaces", () => {
    expect(() => destinationSchema.parse({ ...validInput, slug: "Kandy City" })).toThrow();
  });

  it("rejects latitude out of range", () => {
    expect(() => destinationSchema.parse({ ...validInput, latitude: "200" })).toThrow();
  });

  it("rejects longitude out of range", () => {
    expect(() => destinationSchema.parse({ ...validInput, longitude: "-200" })).toThrow();
  });
});
