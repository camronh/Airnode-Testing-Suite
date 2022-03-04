const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

app.post("/gatewayRequest", async (req, res) => {
  const { url, gatewayKey, parameters } = req.body;
  console.log({ url, gatewayKey, parameters });
  if (!url || !gatewayKey || !parameters) {
    console.log("Missing parameters");
    return res.status(400).send("Missing Params");
  }
  try {
    const { makeGatewayRequest } = require("./utils/utils");
    const result = await makeGatewayRequest(url, gatewayKey, parameters);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// app.listen(3000, () => {
//   console.log("Example app listening on port 3000!");
// });

module.exports = app; // add this line
