async function dragAndDrop(page, selector, buffer) {
  // Create the DataTransfer and File
  const dataTransfer = await page.evaluateHandle(data => {
    const dt = new DataTransfer();
    // Convert the buffer to a hex array
    const file = new File([JSON.stringify(data)], "file.json", {
      type: "application/json",
    });
    dt.items.add(file);
    return dt;
  }, buffer);

  // Now dispatch
  await page.dispatchEvent(selector, "drop", { dataTransfer });
}

async function loadExampleFiles(page) {
  const config = require("../src/utils/exampleConfig.json");
  const receipt = require("../src/utils/exampleReceipt.json");
  await dragAndDrop(page, "#config-card", config);
  await dragAndDrop(page, "#receipt-card", receipt);
}

module.exports = {
  dragAndDrop,
  loadExampleFiles,
};
