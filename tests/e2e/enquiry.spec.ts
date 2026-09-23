import { expect, test } from "@playwright/test";

import { E2E_PACKAGE_SLUG } from "./global-setup";

test.describe("enquiry submission", () => {
  test("submitting the enquiry form shows a thank-you message", async ({ page }) => {
    await page.goto("/enquiry");

    await page.getByLabel("Name").fill("E2E Test Traveller");
    await page.getByLabel("Email").fill("e2e-enquiry@viatora.test");
    await page.getByLabel("WhatsApp / phone").fill("+94771234567");
    await page.getByLabel("Number of travellers").fill("2");
    await page.getByLabel("Message").fill("This is an automated end-to-end test enquiry.");

    await page.getByRole("button", { name: "Send enquiry" }).click();

    await expect(page).toHaveURL(/\/enquiry\?success=1/);
    await expect(page.getByRole("heading", { name: "Thank you!" })).toBeVisible();
  });

  test("enquiry form pre-selects the package from the URL", async ({ page }) => {
    await page.goto(`/tours/${E2E_PACKAGE_SLUG}`);
    await page.getByRole("link", { name: "Request This Trip" }).click();

    await expect(page).toHaveURL(/\/enquiry\?package=/);
    await expect(page.getByLabel("Package")).toHaveValue(/.+/);
  });
});
