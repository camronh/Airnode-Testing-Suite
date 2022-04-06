# Unofficial Airnode Testing-Suite

## [Try It Out!](https://master.d3unh1kz3ytpci.amplifyapp.com/)

Welcome to the [Airnode Testing Suite](https://master.d3unh1kz3ytpci.amplifyapp.com/)! This suite is designed to help you test your [Airnode](https://docs.api3.org/airnode/v0.5/) on and off-chain. It is assumed that you have done a [cloud deployment](https://docs.api3.org/airnode/v0.5/grp-providers/tutorial/) of your Airnode and have a copy of your deployment files handy. You will also need [Metamask](https://metamask.io/), an Ethereum wallet, with some Ropsten testnet ETH for blockchain requests. To get Ropsten test ETH, you may use a faucet, like one from [here](https://ropsten.oregonctf.org/) or [here](https://www.moonborrow.com/).

## [Repo Structure](https://github.com/camronh/Airnode-Testing-Suite)

- [Frontend](/frontend) - Simple GUI for the Airnode Testing Suite dApp

- [Hardhat](/hardhat) - Our requester Smart Contracts

- [API](/api) - API Workaround for Cors 

## Step 1: Upload Deployment Files
Either drag-and-drop or click to upload your `config.json` file located in the `config` directory of your deployment package into the Config box on the top left. Do the same for the Receipt box with your `receipt.json` file located in the `output` directory.

## Step 2: Configure Your Request
Choose the endpoint you would like to test from the dropdown menu and check the boxes for any parameters you would like to pass to the endpoint, then fill in their values. Keep in mind, `_type` and `_path` are [Reserved Parameters](https://docs.api3.org/ois/v1.0.0/reserved-parameters.html) required by Airnode. The `_type` defines the [Solidity type](https://docs.soliditylang.org/en/latest/abi-spec.html#types), and the `_path` defines the value to be returned on-chain.

## Step 3: Test Airnode Off-Chain
Before testing on-chain, we will use the Airnode [HTTP Gateway](https://docs.api3.org/airnode/v0.5/grp-providers/guides/build-an-airnode/http-gateways.html) to quickly and easily make sure our request is a valid Blockchain request (configured in the previous step). Press the HTTP Request button to open the HTTP Testing menu. In the field labeled "Gateway Key", input the `HTTP_GATEWAY_API_KEY` from your `secrets.env` file located inside the `config` directory. Use the "Make Request" button or the generated CURL command to make your request and adjust any params as needed.

## Step 4: Make a Blockchain Request
When you are satisfied with the response from the HTTP Gateway testing, we can move on to an on-chain request. Close the HTTP Gateway menu and press "Blockchain Request". Connect your Metamask to Ropsten testnet and fund the [Sponsor Wallet](https://docs.api3.org/airnode/v0.5/concepts/sponsor.html#sponsorwallet) if the "SponsorWallet Balance" is 0. When you're ready, press "Make Request" and keep an eye on the logs for more information. You should see the desired response from your API. 

## Conclusion
Congratulations! Your Airnode can successfully receive blockchain requests and return responses to the blockchain! Web3 developers can start [here](https://docs.api3.org/airnode/v0.5/grp-developers/).