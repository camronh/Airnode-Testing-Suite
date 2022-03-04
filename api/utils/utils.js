const axios = require("axios");

async function makeGatewayRequest(url, gatewayKey, parameters) {
  try {
    const response = await axios.post(
      url,
      {
        parameters,
      },
      {
        headers: {
          ["x-api-key"]: gatewayKey,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  makeGatewayRequest,
};
