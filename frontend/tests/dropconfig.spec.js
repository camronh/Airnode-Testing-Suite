const { test, expect } = require("@playwright/test");

test("Drag and drop config and receipt", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await require("./testUtils").loadExampleFiles(page);
  await expect(page.locator("text=CamsCSRNG")).toBeVisible();
  await expect(
    page.locator("text=0x5CC8357acC9F605f66B710259751E87310c00536")
  ).toBeVisible();
});
