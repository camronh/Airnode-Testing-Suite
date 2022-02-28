<template>
  <v-card
    @drop.prevent="uploadConfig($event)"
    @dragover.prevent="dragover = true"
    @dragenter.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    :class="{ accent: dragover }"
  >
    <v-card-title>Config</v-card-title>
    <v-card-subtitle v-if="!config">
      Drag and Drop your config.json file here
    </v-card-subtitle>
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
export default {
  name: "App",

  data: () => ({
    config: null,
    dragover: false,
    selectedEndpoint: null,
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
      this.$emit("update:config", this.config);
      const endpointId = this.config.triggers.rrp.find(
        (endpoint) => endpoint.endpointName === this.selectedEndpoint
      ).endpointId;
      this.$emit("update:endpointId", endpointId);
    },
  },
};
</script>
