import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/utils/slug";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Colombo to Ella Explorer")).toBe("colombo-to-ella-explorer");
  });

  it("strips non-alphanumeric characters", () => {
    expect(slugify("Kandy's Temple & Gardens!")).toBe("kandy-s-temple-gardens");
  });

  it("collapses repeated separators and trims leading/trailing hyphens", () => {
    expect(slugify("  --Hill   Country--  ")).toBe("hill-country");
  });

  it("returns an empty string for input with no alphanumeric characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});
