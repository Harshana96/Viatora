import { expect, test } from "@playwright/test";

import { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD } from "./global-setup";

test.describe("admin authentication", () => {
  test("visiting an admin route while signed out redirects to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login\?callbackUrl=%2Fadmin%2Fdashboard/);
  });

  test("wrong credentials show an error and stay on the login page", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(E2E_ADMIN_EMAIL);
    await page.getByLabel("Password").fill("definitely-the-wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\/login\?error=1/);
    await expect(page.getByText("Invalid email or password.")).toBeVisible();
  });

  test("correct credentials sign in and reach the dashboard", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(E2E_ADMIN_EMAIL);
    await page.getByLabel("Password").fill(E2E_ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible();
    await expect(page.getByText("Total packages")).toBeVisible();
  });

  test("signing in respects the callbackUrl and signing out blocks access again", async ({ page }) => {
    await page.goto("/admin/destinations");
    await expect(page).toHaveURL(/\/admin\/login\?callbackUrl=%2Fadmin%2Fdestinations/);

    await page.getByLabel("Email").fill(E2E_ADMIN_EMAIL);
    await page.getByLabel("Password").fill(E2E_ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\/destinations$/);

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);

    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login\?callbackUrl=%2Fadmin%2Fdashboard/);
  });
});
