<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <br />
      <v-card>
        <v-card-title>Testing Suite</v-card-title>
        <v-row justify="center">
          <v-col cols="12" md="4">
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
              <v-card-text v-else>
                <b>Title:</b> {{ config.ois[0].title }}<br />
                <b>Base URL:</b>
                {{ config.ois[0].apiSpecifications.servers[0].url }}<br />
                <v-autocomplete
                  auto-select-first
                  label="Endpoint"
                  :items="endpointNames"
                  v-model="selectedEndpoint"
                  dense
                  @change="parseStoredEndpoint"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>Receipt</v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title>HTTP Gateway API Key</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    config: null,
    dragover: false,
  }),
  computed: {
    endpointNames() {
      if (!this.endpoints) return [];
      return this.endpoints.map((endpoint) => endpoint.name);
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
  },
};
</script>
