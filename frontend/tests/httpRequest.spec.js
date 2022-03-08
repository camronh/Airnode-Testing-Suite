const { test, expect } = require("@playwright/test");

test("HTTP Request", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await require("./testUtils").loadExampleFiles(page);
  await expect(page.locator("text=CamsCSRNG")).toBeVisible();
  await page.click("text=Endpoint", { force: true });
  await page.click("text=GET /randomNumber");
  await page.click("#max-checkbox", { force: true });
  await page.type("text=max", "100");
  await expect(page.locator("text=HTTP Request")).toBeDisabled();
  await page.type("text=_type", "string");
  await page.type("text=_path", "randomNumber");
  await page.click("text=HTTP Request");
  await expect(page.locator("text=curl")).toBeVisible();
});
