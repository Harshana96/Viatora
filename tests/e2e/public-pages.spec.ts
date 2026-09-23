import { expect, test } from "@playwright/test";

import { E2E_DESTINATION_SLUG, E2E_PACKAGE_SLUG } from "./global-setup";

test.describe("public pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Your Sri Lanka Journey, Planned Simply." })).toBeVisible();
  });

  test("homepage shows popular packages, destinations and travel categories", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Popular Tour Packages" })).toBeVisible();
    await expect(page.getByRole("link", { name: /E2E Test Package/ })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Popular Destinations" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Test Province/ })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Travel Categories" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Adventure" })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Why Sri Lanka" })).toBeVisible();
  });

  test("homepage search box navigates to filtered tours listing", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Search tours, e.g. 'hill country'").fill("E2E Test Package");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page).toHaveURL(/\/tours\?query=/);
    await expect(page.getByRole("link", { name: /E2E Test Package/ })).toBeVisible();
  });

  test("homepage travel category link filters tours by type", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Adventure" }).click();

    await expect(page).toHaveURL(/\/tours\?travelType=ADVENTURE/);
  });

  test("tours listing shows the seeded published package", async ({ page }) => {
    await page.goto("/tours");
    await expect(page.getByRole("link", { name: /E2E Test Package/ })).toBeVisible();
  });

  test("packages only show an estimated price once group size and arrival month are selected", async ({ page }) => {
    await page.goto("/tours");
    await expect(page.getByText("Select a group size and arrival month")).toBeVisible();
    await expect(page.getByText("/ person")).toHaveCount(0);

    await page.getByLabel("Group size").selectOption({ index: 1 });
    await page.getByLabel("Arrival month").selectOption({ index: 1 });
    await page.getByRole("button", { name: "Apply" }).click();

    await expect(page.getByText("/ person").first()).toBeVisible();
  });

  test("package detail page renders", async ({ page }) => {
    await page.goto(`/tours/${E2E_PACKAGE_SLUG}`);
    await expect(page.getByRole("heading", { name: "E2E Test Package" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Request This Trip" })).toBeVisible();
  });

  test("destination detail page renders", async ({ page }) => {
    await page.goto(`/destinations/${E2E_DESTINATION_SLUG}`);
    await expect(page.getByRole("heading", { name: "E2E Test Destination" })).toBeVisible();
  });

  test("destinations listing links to the destination detail page", async ({ page }) => {
    await page.goto("/destinations");
    await page.getByRole("link", { name: /E2E Test Destination/ }).click();
    await expect(page).toHaveURL(new RegExp(`/destinations/${E2E_DESTINATION_SLUG}$`));
  });
});
