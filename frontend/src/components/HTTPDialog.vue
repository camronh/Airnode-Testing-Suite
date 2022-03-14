<template>
  <v-sheet>
    <v-btn
      outlined
      text
      @click="dialogOpen = true"
      :disabled="!paramsAreFilled"
    >
      HTTP Request
    </v-btn>
    <v-dialog v-model="dialogOpen" fullscreen>
      <v-card>
        <v-card-title>
          HTTP Request
          <v-spacer></v-spacer>
          <v-btn
            @click="
              $emit('update:params', params);
              dialogOpen = false;
            "
            icon
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            dense
            label="Gateway Key"
            v-model="gatewayKey"
            autofocus
          >
          </v-text-field>
          <v-row>
            <v-col cols="12" md="2" v-for="(value, name) in params" :key="name">
              <v-text-field
                outlined
                dense
                :id="`${name}-http-field`"
                v-model="params[name]"
                :label="name"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="2">
              <v-btn
                block
                outlined
                color="primary"
                @click="makeRequest"
                text
                :disabled="!paramsAreFilled || !gatewayKey"
              >
                Make Request
              </v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <br />
          <v-row>
            <v-col cols="12" md="6">
              <v-textarea
                dense
                label="Curl Command"
                outlined
                readonly
                :value="curlString"
              >
              </v-textarea>
            </v-col>
            <v-col cols="12" md="6">
              <v-textarea
                dense
                label="Raw Response"
                outlined
                :value="
                  response.values ? JSON.stringify(response, null, 2) : ''
                "
                readonly
                :disabled="!response"
              >
              </v-textarea>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                outlined
                dense
                :loading="makingRequest"
                :value="response.values ? response.values : ''"
                label="Result"
                readonly
                :disabled="!response"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script>
import * as api from "../utils/api";

export default {
  name: "App",
  props: ["endpoint", "receipt", "params", "httpParams"],
  data() {
    return {
      gatewayKey: "",
      response: {},
      dialogOpen: false,
      makingRequest: false,
    };
  },
  methods: {
    async makeRequest() {
      console.log("Making request...");
      this.makingRequest = true;
      try {
        this.response = await api.makeRequest(
          this.url,
          this.gatewayKey,
          this.params
        );
      } catch (error) {
        console.log(error);
      }
      this.makingRequest = false;
    },
  },
  computed: {
    curlString() {
      if (!this.paramsAreFilled || !this.gatewayKey) return "";
      return `curl -v -X POST -H 'Content-Type: application/json' \
       -H 'x-api-key: ${this.gatewayKey}' \\
-d '${JSON.stringify({ parameters: this.params })}' \\
'${this.url}'`;
    },
    url() {
      if (!this.endpoint || !this.receipt) return null;
      return `${this.receipt.api.httpGatewayUrl}/${this.endpoint.endpointId}`;
    },

    paramsAreFilled() {
      if (!this.params || !this.endpoint) return false;
      for (let param in this.params) if (!this.params[param]) return false;
      return true;
    },
    allParams() {
      let paramsList = this.endpoint.parameters.map(param => param.name);
      paramsList.push(...["_type", "_path"]);
      let params = {};
      paramsList.forEach(param => {
        params[param] = "";
      });
      for (let param in this.params) params[param] = this.params[param];
      return params;
    },
  },
};
</script>
