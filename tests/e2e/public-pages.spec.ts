import { expect, test } from "@playwright/test";

import { E2E_DESTINATION_SLUG, E2E_PACKAGE_SLUG } from "./global-setup";

test.describe("public pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Unscripted Ceylon/ })).toBeVisible();
  });

  test("homepage shows curated journeys, waypoints and craft-of-slow-travel sections", async ({ page }) => {
    await page.goto("/");

    const main = page.locator("main");
    await expect(main.getByRole("heading", { name: "Curated Expeditions" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Sri Lanka Grand Journey" }).first()).toBeVisible();

    await expect(main.getByRole("heading", { name: "The Island Cartography & Waypoints" })).toBeVisible();
    await expect(main.getByRole("heading", { name: "Sigiriya" }).first()).toBeVisible();

    await expect(page.getByText("The Craft of Slow Travel")).toBeVisible();
  });

  test("homepage group size and arrival month form navigates to the tours page", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Group size").selectOption({ index: 1 });
    await page.getByLabel("Arrival month").selectOption({ index: 1 });
    await page.getByRole("button", { name: "Explore Journeys" }).click();

    await expect(page).toHaveURL(/\/tours\?groupSize=.+&month=\d+/);
  });

  test("tours listing shows the seeded published package", async ({ page }) => {
    await page.goto("/tours");
    await expect(page.locator("main").getByRole("link", { name: /E2E Test Package/ })).toBeVisible();
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
    await page.locator("main").getByRole("link", { name: /E2E Test Destination/ }).click();
    await expect(page).toHaveURL(new RegExp(`/destinations/${E2E_DESTINATION_SLUG}$`));
  });
});
