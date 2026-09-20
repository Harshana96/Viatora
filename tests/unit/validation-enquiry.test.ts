import { describe, expect, it } from "vitest";

import { enquirySchema, enquiryUpdateSchema } from "@/lib/validation/enquiry";

const validEnquiry = {
  name: "Jane Traveller",
  email: "jane@example.com",
  phone: "+94771234567",
  preferredDate: "2026-12-01",
  travellersCount: "2",
  packageId: "",
  message: "",
};

describe("enquirySchema", () => {
  it("accepts valid input", () => {
    const result = enquirySchema.parse(validEnquiry);
    expect(result.travellersCount).toBe(2);
    expect(result.preferredDate).toBeInstanceOf(Date);
  });

  it("rejects an invalid email", () => {
    expect(() => enquirySchema.parse({ ...validEnquiry, email: "not-an-email" })).toThrow();
  });

  it("rejects a phone number that's too short", () => {
    expect(() => enquirySchema.parse({ ...validEnquiry, phone: "12" })).toThrow();
  });

  it("rejects fewer than 1 traveller", () => {
    expect(() => enquirySchema.parse({ ...validEnquiry, travellersCount: "0" })).toThrow();
  });

  it("allows an empty message and packageId", () => {
    const result = enquirySchema.parse({ ...validEnquiry, message: "", packageId: "" });
    expect(result.message).toBe("");
    expect(result.packageId).toBe("");
  });
});

describe("enquiryUpdateSchema", () => {
  it("accepts a valid status and empty notes", () => {
    const result = enquiryUpdateSchema.parse({ status: "CONTACTED", internalNotes: "" });
    expect(result.status).toBe("CONTACTED");
  });

  it("rejects an invalid status", () => {
    expect(() => enquiryUpdateSchema.parse({ status: "NOT_A_STATUS", internalNotes: "" })).toThrow();
  });
});
