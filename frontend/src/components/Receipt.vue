<template>
  <v-card
    @drop.prevent="uploadReceipt($event)"
    @dragover.prevent="dragover = true"
    @dragenter.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    :class="{ accent: dragover }"
  >
    <v-card-title>Receipt</v-card-title>
    <v-card-subtitle v-if="!receipt">
      Drop your receipt.json file from deployment here
    </v-card-subtitle>
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
    gatewayKey: null,
  }),
  computed: {},
  methods: {
    async uploadReceipt(e) {
      console.log(e);
      this.dragover = false;
      try {
        this.receipt = await new Promise(resolve => {
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
