<template>
  <v-sheet color="transparent">
    <v-btn icon color="primary" @click="dialogOpen = true">
      <v-icon large>mdi-help-circle-outline</v-icon>
    </v-btn>

    <v-dialog v-model="dialogOpen" max-width="60%">
      <v-card tile outlined>
        <v-card-title>
          <h2>Airnode Testing Instructions</h2>
          <v-spacer></v-spacer>
          <v-btn @click="dialogOpen = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Welcome to the
          <a
            href="https://master.d3unh1kz3ytpci.amplifyapp.com/"
            target="_blank"
            >Airnode Testing Suite</a
          >! This suite is designed to help you test your
          <a href="https://docs.api3.org/airnode/v0.5/" target="_blank"
            >Airnode</a
          >
          on and off-chain. It is assumed that you have done an
          <a
            href="https://docs.api3.org/airnode/v0.5/grp-providers/tutorial/"
            target="_blank"
            >cloud deployment</a
          >
          of your Airnode and have a copy of your deployment files handy. You
          will also need
          <a href="https://metamask.io/" target="_blank">Metamask</a> with some
          Ropsten testnet ETH for the blockchain requests. To get Ropsten test
          ETH, you may use a
          <a href="https://ropsten.oregonctf.org/" target="_blank">faucet</a>.
        </v-card-text>
        <br />

        <v-card-subtitle>
          <h3>⬆️ Step 1: Upload Deployment Files</h3>
        </v-card-subtitle>
        <v-card-text>
          Either drag-and-drop or click to upload your
          <code>config.json</code> file located in the
          <code>config</code> directory of your deployment package into the
          Config box on the top left. Do the same for the Receipt box with your
          <code>receipt.json</code> file located in the
          <code>output</code> directory.
        </v-card-text>
        <br />

        <v-card-subtitle>
          <h3>⚙️ Step 2: Configure Your Request</h3>
        </v-card-subtitle>
        <v-card-text>
          Choose the endpoint you would like to test from the dropdown menu and
          check the boxes for any parameters you would like to pass to the
          endpoint, then fill in their values. Keep in mind,
          <code>_type</code> and <code>_path</code> are
          <a
            href="https://docs.api3.org/ois/v1.0.0/reserved-parameters.html"
            target="_blank"
            >Reserved Parameters</a
          >
          required by Airnode. The <code>_type</code> defines the
          <a
            href="https://docs.soliditylang.org/en/latest/abi-spec.html#types"
            target="_blank"
            >Solidity type</a
          >, and the <code>_path</code> defines the value to be returned
          on-chain.
        </v-card-text>
        <br />

        <v-card-subtitle>
          <h3>🌐 Step 3: Test Airnode Off-Chain</h3>
        </v-card-subtitle>

        <v-card-text>
          Before testing on-chain, we will use the
          <a
            href="https://docs.api3.org/airnode/v0.5/grp-providers/guides/build-an-airnode/http-gateway.html"
            target="_blank"
            >Airnode HTTP Gateway
          </a>
          to quickly and easily make sure our request is a valid Blockchain
          request. Press the HTTP Request button to open the HTTP Testing menu.
          In the field labeled "Gateway Key", input the
          <code>HTTP_GATEWAY_API_KEY</code> from your
          <code>secrets.env</code> file located inside the
          <code>config</code> directory. Use the "Make Request" button or CURL
          command to make your request and adjust any params as needed.
        </v-card-text>
        <br />

        <v-card-subtitle>
          <h3>🔗 Step 4: Make a Blockchain Request</h3>
        </v-card-subtitle>
        <v-card-text>
          When you are satisfied with the response from the HTTP Gateway
          testing, we can move on to an on-chain request. Close the HTTP Gateway
          menu and press &quot;Blockchain Request&quot;. Connect your Metamask
          to Ropsten testnet and fund the
          <a
            href="https://docs.api3.org/airnode/v0.5/concepts/sponsor.html#sponsorwallet"
            target="_blank"
            >Sponsor Wallet</a
          >
          if the &quot;SponsorWallet Balance&quot; is 0. When you&#39;re ready,
          press &quot;Make Request&quot; and keep an eye on the logs for more
          information.
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      dialogOpen: false,
    };
  },
};
</script>
