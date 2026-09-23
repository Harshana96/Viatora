import { expect, test } from "@playwright/test";

import { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_PACKAGE_SLUG } from "./global-setup";

test.describe("reviews", () => {
  test("submitting a review shows a pending confirmation and is hidden until approved, then admin approval publishes it", async ({
    page,
  }) => {
    const reviewerName = `E2E Reviewer ${Date.now()}`;
    const comment = `Automated e2e review comment ${Date.now()}`;

    await page.goto(`/tours/${E2E_PACKAGE_SLUG}`);
    await page.getByLabel("Name").fill(reviewerName);
    await page.getByLabel("Email").fill("e2e-reviewer@viatora.test");
    await page.getByLabel("Rating").selectOption("4");
    await page.getByLabel("Your review").fill(comment);
    await page.getByRole("button", { name: "Submit Review" }).click();

    await expect(page).toHaveURL(/\/tours\/.+\?reviewed=1/);
    await expect(page.getByText("Thanks for your review!")).toBeVisible();
    await expect(page.getByText(comment)).not.toBeVisible();

    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(E2E_ADMIN_EMAIL);
    await page.getByLabel("Password").fill(E2E_ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard$/);

    await page.goto("/admin/reviews");
    const pendingItem = page.locator("li", { hasText: reviewerName });
    await expect(pendingItem).toBeVisible();
    await pendingItem.getByRole("button", { name: "Approve" }).click();
    await expect(pendingItem).not.toBeVisible();

    await page.goto(`/tours/${E2E_PACKAGE_SLUG}`);
    await expect(page.getByText(comment)).toBeVisible();
  });
});
