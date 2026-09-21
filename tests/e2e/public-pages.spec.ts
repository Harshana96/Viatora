import { expect, test } from "@playwright/test";

import { E2E_DESTINATION_SLUG, E2E_PACKAGE_SLUG } from "./global-setup";

test.describe("public pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Discover Sri Lanka");
    await expect(page.locator("header").getByText("Viatora")).toBeVisible();
  });

  test("homepage shows popular packages, destinations and travel categories", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Popular Tour Packages" })).toBeVisible();
    await expect(page.getByText("E2E Test Package", { exact: false }).first()).toBeVisible();

    await expect(page.getByRole("heading", { name: "Popular Destinations" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Test Province/ })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Travel Categories" })).toBeVisible();
    await expect(page.locator("#categories").getByRole("link", { name: /^Adventure/ })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Why Sri Lanka" })).toBeVisible();
  });

  test("homepage hero search bar navigates to filtered tours listing", async ({ page }) => {
    await page.goto("/");
    await page.locator('select[name="travelType"]').selectOption("ADVENTURE");
    await page.getByRole("button", { name: "Search Journeys" }).click();

    await expect(page).toHaveURL(/\/tours\?.*travelType=ADVENTURE/);
  });

  test("homepage travel category tile filters tours by type", async ({ page }) => {
    await page.goto("/");
    await page.locator("#categories").getByRole("link", { name: /^Adventure/ }).click();

    await expect(page).toHaveURL(/\/tours\?travelType=ADVENTURE/);
  });

  test("tours listing shows the seeded published package", async ({ page }) => {
    await page.goto("/tours");
    await expect(page.getByRole("link", { name: /E2E Test Package/ })).toBeVisible();
  });

  test("search filter narrows the tours listing", async ({ page }) => {
    await page.goto("/tours?query=E2E+Test+Package");
    await expect(page.getByRole("link", { name: /E2E Test Package/ })).toBeVisible();

    await page.goto("/tours?query=Nonexistent+Package+Name");
    await expect(page.getByText("No tour packages match your filters.")).toBeVisible();
  });

  test("package detail page renders", async ({ page }) => {
    await page.goto(`/tours/${E2E_PACKAGE_SLUG}`);
    await expect(page.getByRole("heading", { name: "E2E Test Package" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Enquire about this tour" })).toBeVisible();
  });

  test("destination detail page renders", async ({ page }) => {
    await page.goto(`/destinations/${E2E_DESTINATION_SLUG}`);
    await expect(page.getByRole("heading", { name: "E2E Test Destination" })).toBeVisible();
  });

  test("destinations listing links to the destination detail page", async ({ page }) => {
    await page.goto("/destinations");
    await page.locator("main").getByRole("link", { name: /E2E Test Destination/ }).click();
    await expect(page).toHaveURL(new RegExp(`/destinations/${E2E_DESTINATION_SLUG}$`));
  });
});
