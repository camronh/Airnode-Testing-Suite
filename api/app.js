const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post("/makeGatewayRequest", (req, res) => {
  const { url, gatewayKey, params } = req.body;
  if (!url || !gatewayKey || !params) {
    return res.status(400).send("Missing Params");
  }
  try {
    const { makeGatewayRequest } = require("./utils/utils");
    const result = await makeGatewayRequest(url, gatewayKey, params);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
