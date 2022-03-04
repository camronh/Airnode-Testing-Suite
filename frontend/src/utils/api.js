const axios = require("axios");

let apiUrl = "http://localhost:3000";
apiUrl = "https://9x0flm9891.execute-api.us-east-1.amazonaws.com/latest"

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
