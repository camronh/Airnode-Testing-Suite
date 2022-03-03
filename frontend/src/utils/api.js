const axios = require("axios");

const apiUrl = "http://localhost:3000";

async function makeRequest(url, gatewayKey, parameters) {
  const results = await axios.post(`${apiUrl}/gatewayRequest`, {
    url,
    gatewayKey,
    parameters,
  });
  return results.data;
}

module.exports = {
  makeRequest,
};
