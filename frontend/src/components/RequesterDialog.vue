<template>
  <v-sheet>
    <v-btn
      outlined
      color="primary"
      @click="
        connectWallet;
        dialog = true;
      "
      :disabled="!paramsAreFilled"
      text
    >
      Blockchain Request
    </v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          Smart Contract Request
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle v-if="walletConnected">
          SponsorWallet Balance: {{ sponsorWalletBalance }} ETH
        </v-card-subtitle>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="12" md="3">
              <v-btn
                block
                outlined
                text
                color="primary"
                @click="fundSponsorWallet"
                v-if="walletConnected"
                :loading="fundingSponsorWallet"
              >
                Fund Sponsor Wallet
              </v-btn>
            </v-col>
            <v-col cols="12" md="3">
              <v-btn
                block
                outlined
                text
                :disabled="!sponsorWalletFunded || makingRequest"
                color="primary"
                @click="makeRequest"
                v-if="walletConnected"
              >
                Make Request
              </v-btn>
            </v-col>
          </v-row>
          <br />

          <v-divider></v-divider>
          <br />
          <v-row align="center" justify="center">
            <v-btn
              v-if="!walletConnected"
              @click="connectWallet"
              outlined
              color="primary"
            >
              Connect Wallet
            </v-btn>
            <v-col cols="12" md="11" v-else>
              <v-textarea
                dense
                label="Request Logs"
                outlined
                auto-grow
                readonly
                :value="logString"
                :loading="makingRequest"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import { ethers } from "ethers";

export default {
  name: "App",
  props: ["endpoint", "receipt", "params"],
  data() {
    return {
      logString: "",
      makingRequest: false,
      fundingSponsorWallet: false,
      provider: null,
      chainId: null,
      signer: null,
      address: "",
      walletConnected: false,
      sponsorAddress: "0xe2dB4f54F8FAB66e44386e49aFcB3EF4a87a8787",
      sponsorWalletAddress: "",
      sponsorWalletBalance: 0,
      requesterContract: null,
      rrpContract: null,
      dialog: false,
    };
  },
  methods: {
    async connectWallet() {
      const { deriveSponsorWalletAddress } = require("@api3/airnode-admin");
      try {
        this.provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        // Prompt user for account connections
        await this.provider.send("eth_requestAccounts", []);
        this.signer = this.provider.getSigner();
        this.address = await this.signer.getAddress();
        const network = await this.provider.getNetwork();
        this.chainId = network.chainId;
        this.requesterContract = new ethers.Contract(
          this.requesterAddress,
          this.requesterAbi,
          this.signer
        );

        this.rrpContract = new ethers.Contract(
          this.rrpAddress,
          this.rrpAbi,
          this.signer
        );

        this.sponsorWalletAddress = await deriveSponsorWalletAddress(
          this.receipt.airnodeWallet.airnodeXpub,
          this.receipt.airnodeWallet.airnodeAddress,
          this.sponsorAddress
        );

        this.sponsorWalletBalance = await this.provider.getBalance(
          this.sponsorWalletAddress
        );

        this.sponsorWalletBalance = ethers.utils.formatEther(
          this.sponsorWalletBalance
        );

        this.walletConnected = true;
        console.log(this.rrpContract.filters);

        console.log(this.params);
      } catch (error) {
        console.log(error);
      }
    },
    async fundSponsorWallet() {
      this.fundingSponsorWallet = true;
      this.postToLog(
        `Funding Sponsor Wallet: ${this.sponsorWalletAddress}...`,
        true
      );
      try {
        const tx = await this.signer.sendTransaction({
          to: this.sponsorWalletAddress,
          value: ethers.utils.parseEther(`0.5`),
        });
        // Wait for tx to be mined
        await tx.wait();
        await this.connectWallet();
        this.postToLog(`Sent 0.5 ETH to Sponsor Wallet`);
      } catch (error) {
        this.postToLog(`Error funding Sponsor Wallet: ${error.message}`);
      }
      this.fundingSponsorWallet = false;
    },
    async makeRequest() {
      this.makingRequest = true;
      const { encode } = require("@api3/airnode-abi");
      this.postToLog(
        `Airnode Address: ${this.receipt.airnodeWallet.airnodeAddress}
Endpoint: ${this.endpoint.endpointId} (${this.endpoint.name})
Params: ${JSON.stringify(this.params)}\n\nMaking Request...`,
        true
      );
      try {
        let params = [];
        for (let key in this.params) {
          params.push({
            type: "string32",
            name: key,
            value: key == "_type" ? "string" : this.params[key],
          });
        }
        const { provider, rrpContract, requesterContract } = this;

        const receipt = await requesterContract.makeRequest(
          this.receipt.airnodeWallet.airnodeAddress,
          this.endpoint.endpointId,
          this.sponsorAddress,
          this.sponsorWalletAddress,
          encode(params)
        );

        const requestId = await new Promise((resolve) =>
          provider.once(receipt.hash, (tx) => {
            const parsedLog = rrpContract.interface.parseLog(tx.logs[0]);
            resolve(parsedLog.args.requestId);
          })
        );
        this.postToLog(`Request put on chain!`);
        this.postToLog(`Request ID: ${requestId}\n`);
        this.postToLog("Waiting for Airnode to respond ...");
        const fulfilledPromise = new Promise((resolve) =>
          provider.once(
            rrpContract.filters.FulfilledRequest(null, requestId),
            resolve
          )
        );
        const failedPromise = new Promise((resolve) =>
          provider.once(
            rrpContract.filters.FailedRequest(null, requestId),
            resolve
          )
        );
        let response = await Promise.race([fulfilledPromise, failedPromise]);
        console.log({ response });
        const decodedData = await requesterContract.decodedData(requestId);
        console.log({ decodedData });
        if (!decodedData) this.postToLog(`Airnode request failed! ❌`);
        else this.postToLog(`Airnode request fulfilled! ✅`);
        this.postToLog(
          `Etherscan: https://ropsten.etherscan.io/tx/${response.transactionHash}\n`
        );
        if (decodedData) this.postToLog(`Result: ${decodedData}`);
      } catch (error) {
        this.postToLog("Error:\n" + error.message);
      }
      this.makingRequest = false;
    },
    postToLog(text, clear) {
      if (clear) this.logString = "";
      this.logString += text + "\n";
    },
  },
  computed: {
    requesterAddress() {
      return require("../utils/addresses.json")[this.chainId];
    },
    requesterAbi() {
      const requesterArtifacts = require("../artifacts/contracts/Requester.sol/Requester.json");
      return requesterArtifacts.abi;
    },
    rrpAddress() {
      const airnodeProtocol = require("@api3/airnode-protocol");
      let address = airnodeProtocol.AirnodeRrpAddresses[this.chainId];
      if (!address) address = airnodeProtocol.AirnodeRrpAddresses["3"];
      return address;
    },
    rrpAbi() {
      const airnodeProtocol = require("@api3/airnode-protocol");
      const rrpArtifacts = airnodeProtocol.AirnodeRrpFactory;
      return rrpArtifacts.abi;
    },
    paramsAreFilled() {
      if (!this.params || !this.endpoint) return false;
      for (let param in this.params) if (!this.params[param]) return false;
      return true;
    },
    sponsorWalletFunded() {
      const wei = ethers.utils.parseEther(this.sponsorWalletBalance);
      const weiThreshold = ethers.utils.parseEther(".05");
      return Number(wei) >= Number(weiThreshold);
    },
  },
};
</script>
