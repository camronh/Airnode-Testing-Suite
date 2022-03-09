const { test, expect } = require("@playwright/test");

test("Drag and drop config and receipt", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await require("./testUtils").loadExampleFiles(page);
  await expect(page.locator("text=CamsCSRNG")).toBeVisible();
  await expect(
    page.locator("text=0x849d0BAbB15212fA166E33Cc9F1715786d0c482D")
  ).toBeVisible();
});
