<template>
  <v-card
    @drop.prevent="uploadConfig($event)"
    @dragover.prevent="dragover = true"
    @dragenter.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    :class="{ primary: dragover }"
    :light="dragover"
    id="config-card"
    height="100%"
    max-height="100%"
    outlined
  >
    <v-card-title class="justify-center">Config</v-card-title>
    <v-card-subtitle v-if="!config" class="text-center">
      Drag and Drop your config.json file here
    </v-card-subtitle>
    <v-row v-if="!config" justify="center">
      <v-col cols="12" md="5">
        <UploadButton v-model="file" />

        <!-- <v-file-input hide-input prepend-icon="mdi-upload" /> -->
      </v-col>
    </v-row>
    <template v-else>
      <v-card-text>
        <b>Title:</b> {{ config.ois[0].title }}<br />
        <b>Base URL:</b>
        {{ config.ois[0].apiSpecifications.servers[0].url }}<br />
      </v-card-text>
      <v-card-text>
        <v-autocomplete
          auto-select-first
          label="Endpoint"
          outlined
          :items="endpointNames"
          v-model="selectedEndpoint"
          dense
          :filled="selectedEndpoint"
          @change="emitData"
        />
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
import UploadButton from "./UploadConfig.vue";

export default {
  name: "App",
  components: {
    UploadButton,
  },

  data: () => ({
    config: null,
    dragover: false,
    selectedEndpoint: null,
    file: null,
  }),
  computed: {
    endpointNames() {
      if (!this.config) return [];
      return this.config.triggers.rrp.map((endpoint) => endpoint.endpointName);
    },
  },
  methods: {
    async uploadConfig(e) {
      console.log(e);
      this.dragover = false;
      try {
        this.config = await new Promise((resolve) => {
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
      } catch (error) {
        console.log(error);
      }
    },
    emitData() {
      let endpoint = this.config.ois[0].endpoints.find(
        (endpoint) => endpoint.name === this.selectedEndpoint
      );

      endpoint.endpointId = this.config.triggers.rrp.find(
        (endpoint) => endpoint.endpointName === this.selectedEndpoint
      ).endpointId;
      this.$emit("update:endpoint", endpoint);
      this.$emit("update:config", this.config);
    },
  },
};
</script>

<style scoped>
.file-select > .select-button {
  padding: 1rem;

  color: white;
  background-color: #2ea169;

  border-radius: 0.3rem;

  text-align: center;
  font-weight: bold;
}

/* Don't forget to hide the original file input! */
.file-select > input[type="file"] {
  display: none;
}
</style>
