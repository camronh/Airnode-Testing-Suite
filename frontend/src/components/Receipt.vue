<template>
  <v-card
    @drop.prevent="uploadReceipt($event)"
    @dragover.prevent="dragover = true"
    @dragenter.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    :class="{ accent: dragover }"
    :light="dragover"
    height="100%"
    max-height="100%"
    id="receipt-card"
    outlined
  >
    <v-card-title class="justify-center"> Receipt</v-card-title>
    <v-card-subtitle v-if="!receipt" class="text-center">
      Drop your receipt.json file from deployment here
    </v-card-subtitle>
    <v-row v-if="!receipt" justify="center">
      <v-col cols="12" md="6">
        <v-file-input
          placeholder="Upload receipt.json"
          prepend-icon="mdi-upload"
          v-model="file"
          outlined
          color="accent"
          dense
          :error="fileError"
          :error-messages="fileError ? 'Invalid receipt.json' : ''"
        />
      </v-col>
    </v-row>
    <template v-else>
      <v-card-text>
        <b>Airnode Address:</b> {{ receipt.airnodeWallet.airnodeAddress }}<br />
        <b>{{ receipt.deployment.cloudProvider.type.toUpperCase() }}:</b>
        {{ receipt.deployment.cloudProvider.region }}<br />
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    receipt: null,
    dragover: false,
    file: null,
    fileError: false,
    gatewayKey: null,
  }),
  computed: {},
  watch: {
    async file() {
      this.receipt = null;
      this.receipt = await new Promise((resolve) => {
        console.log({ file: this.file });
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(this.file);
        fileReader.onloadend = function () {
          try {
            let receipt = fileReader.result;
            receipt = JSON.parse(receipt);
            if (receipt.airnodeWallet) resolve(receipt);
            else throw "Invalid receipt";
          } catch (error) {
            this.fileError = true;
            resolve(null);
          }
        };
      });
      if (!this.receipt) this.fileError = true;
    },
  },
  methods: {
    async uploadReceipt(e) {
      console.log(e);
      this.dragover = false;
      try {
        this.receipt = await new Promise((resolve) => {
          if (e.dataTransfer.files.length > 1) {
            console.log("Only 1 file at a time");
          } else {
            const file = e.dataTransfer.files[0];
            let reader = new FileReader();
            reader.onload = function (event) {
              const uploadString = event.target.result;
              resolve(JSON.parse(uploadString));
            };
            reader.readAsText(file);
          }
        });
        this.$emit("update:receipt", this.receipt);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
