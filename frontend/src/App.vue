<template>
  <v-app>
    <v-app-bar app dark>
      <h1>Airnode Testing Suite</h1>

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
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-card max-width="100%" outlined>
            <br />
            <br />
            <v-row justify="center">
              <v-col cols="12" md="5">
                <Config :config.sync="config" />
              </v-col>
              <v-col cols="12" md="5">
                <Receipt :receipt.sync="receipt" />
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="12" md="10">
                <Endpoint
                  :config="config"
                  :endpoint.sync="endpoint"
                  :params.sync="params"
                />
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                outlined
                @click="httpDialogOpen = true"
                :disabled="!paramsAreFilled"
                >HTTP Request</v-btn
              >
              <v-spacer></v-spacer>

              <v-btn
                outlined
                color="primary"
                @click="requesterDialog = true"
                :disabled="!paramsAreFilled"
              >
                Smart Contract Request
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-main>

    <v-dialog v-model="httpDialogOpen" max-width="1200px" fullscreen>
      <HTTPDialog
        :endpoint="endpoint"
        :receipt="receipt"
        :params="params"
        @closeDialog="httpDialogOpen = false"
      />
    </v-dialog>

    <v-dialog v-model="requesterDialog" max-width="1200px">
      <RequesterDialog
        :endpoint="endpoint"
        :receipt="receipt"
        :params="params"
        @closeDialog="requesterDialog = false"
      />
    </v-dialog>
  </v-app>
</template>

<script>
import Config from "./components/Config.vue";
import Receipt from "./components/Receipt.vue";
import Endpoint from "./components/Endpoint.vue";
import HTTPDialog from "./components/HTTPDialog.vue";
import RequesterDialog from "./components/RequesterDialog.vue";

export default {
  name: "App",
  components: {
    Config,
    Receipt,
    Endpoint,
    HTTPDialog,
    RequesterDialog,
  },
  data: () => ({
    config: null,
    endpoint: null,
    dragover: false,
    receipt: null,
    params: null,
    selectedEndpoint: null,
    httpDialogOpen: false,
    requesterDialog: false,
  }),
  computed: {
    paramsAreFilled() {
      if (!this.params) return false;
      for (let param in this.params) {
        if (!this.params[param]) return false;
      }
      return true;
    },
  },
  methods: {},
};
</script>
