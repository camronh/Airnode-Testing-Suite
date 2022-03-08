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
      <v-col cols="12" md="6">
        <v-file-input
          placeholder="Upload config.json"
          prepend-icon="mdi-upload"
          v-model="file"
          outlined
          color="accent"
          dense
          :error="fileError"
          :error-messages="fileError ? 'Invalid config.json' : ''"
        />
      </v-col>
    </v-row>
    <template v-else>
      <v-card-text>
        <b>Title:</b> {{ config.ois[0].title }}<br />
        <b>Base URL:</b>
        {{ config.ois[0].apiSpecifications.servers[0].url }}<br />
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
export default {
  name: "App",
  components: {},

  data: () => ({
    config: null,
    dragover: false,
    selectedEndpoint: null,
    file: null,
    fileError: false,
  }),
  computed: {
    endpointNames() {
      if (!this.config) return [];
      return this.config.triggers.rrp.map((endpoint) => endpoint.endpointName);
    },
  },
  watch: {
    async file() {
      this.config = null;
      this.config = await new Promise((resolve) => {
        console.log({ file: this.file });
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(this.file);
        fileReader.onloadend = function () {
          try {
            let config = fileReader.result;
            config = JSON.parse(config);
            if (config.chains && config.triggers) resolve(config);
            else throw "Invalid config";
          } catch (error) {
            this.fileError = true;
            resolve(null);
          }
        };
      });
      if (!this.config) this.fileError = true;
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
        this.$emit("update:config", this.config);
      } catch (error) {
        console.log(error);
      }
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
