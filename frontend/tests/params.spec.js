const { test, expect } = require("@playwright/test");

test("Params Sync", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await require("./testUtils").loadExampleFiles(page);
  await expect(page.locator("text=CamsCSRNG")).toBeVisible();
  await page.click("text=Endpoint", { force: true });
  await page.click("text=GET /randomNumber");
  let checkboxes = await page.$$(".v-input--checkbox");
  expect(checkboxes.length).toBe(5);
  await page.click("#max-checkbox", { force: true });
  await page.type("text=max", "100");
  await expect(page.locator("text=Blockchain Request")).toBeDisabled();
  await page.type("text=_type", "string");
  await page.type("text=_path", "randomNumber");
  checkboxes = await page.$$(".v-input--checkbox");
  expect(checkboxes.length).toBe(5);
  await page.click("text=HTTP Request");
  await expect(page.locator("text=curl")).toBeVisible();
  await page.type("#_type-http-field", "uint256");
  await page.click(".mdi-close");
  const textBoxValue = await page.evaluate(
    () => document.querySelector("#_type-text-field").value
  );
  expect(textBoxValue).toBe("uint256string");
});
