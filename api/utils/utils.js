const axios = require("axios");

async function makeGatewayRequest(url, gatewayKey, parameters) {
  const response = await axios.post(url, {
    gatewayKey,
    parameters,
  });
  return response.data;
}

module.exports = {
  makeGatewayRequest,
};
