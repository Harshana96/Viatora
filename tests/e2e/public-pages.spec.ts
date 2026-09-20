import { expect, test } from "@playwright/test";

import { E2E_DESTINATION_SLUG, E2E_PACKAGE_SLUG } from "./global-setup";

test.describe("public pages", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Viatora" })).toBeVisible();
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
    await page.getByRole("link", { name: /E2E Test Destination/ }).click();
    await expect(page).toHaveURL(new RegExp(`/destinations/${E2E_DESTINATION_SLUG}$`));
  });
});
