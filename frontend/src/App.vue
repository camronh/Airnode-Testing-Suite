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
            <Config :config.sync="config" :endpointId.sync="endpointId" />
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <Receipt :receipt.sync="receipt" />
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
import Config from "./components/Config.vue";
import Receipt from "./components/Receipt.vue";

export default {
  name: "App",
  components: {
    Config,
    Receipt,
  },
  data: () => ({
    config: null,
    endpointId: null,
    dragover: false,
    receipt: null,
    selectedEndpoint: null,
  }),
  computed: {
    endpointNames() {
      if (!this.config) return [];
      return this.config.triggers.rrp.map(
        (endpoint) => `${endpoint.endpointName} (${endpoint.endpointId})`
      );
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
