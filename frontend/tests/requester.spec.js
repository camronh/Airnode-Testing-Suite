const { test, expect } = require("@playwright/test");

test("Blockchain Request", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await require("./testUtils").loadExampleFiles(page);
  await expect(page.locator("text=CamsCSRNG")).toBeVisible();
  await page.click("text=Endpoint", { force: true });
  await page.click("text=GET /randomNumber");
  await expect(page.locator("text=Blockchain Request")).toBeDisabled();

  await page.click("#max-checkbox", { force: true });
  await page.type("text=max", "100");
  await expect(page.locator("text=Blockchain Request")).toBeDisabled();
  await page.type("text=_type", "string");
  await page.type("text=_path", "randomNumber");
  await page.click("text=Blockchain Request");
  await expect(page.locator("text=SponsorWallet")).toBeVisible();
});
