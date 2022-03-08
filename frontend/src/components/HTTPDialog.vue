<template>
  <v-card>
    <v-card-title>
      HTTP Request
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDialog')" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field outlined dense label="Gateway Key" v-model="gatewayKey" auto-focus>
      </v-text-field>
      <v-row>
        <v-col cols="12" md="2" v-for="(value, name) in params" :key="name">
          <v-text-field outlined dense v-model="parameters[name]" :label="name">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn block outlined color="primary" @click="makeRequest">
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
          <v-text-field
            outlined
            dense
            :value="response.values"
            label="Result"
            readonly
            :disabled="!response"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            dense
            label="Raw Response"
            outlined
            :value="JSON.stringify(response, null, 2)"
            readonly
            :disabled="!response"
          >
          </v-textarea>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import * as api from "../utils/api";

export default {
  name: "App",
  props: ["endpoint", "receipt", "params"],
  data() {
    return {
      parameters: this.params,
      gatewayKey: "",
      response: "",
      url: `${this.receipt.api.httpGatewayUrl}/${this.endpoint.endpointId}`,
    };
  },
  methods: {
    async makeRequest() {
      console.log("Making request...");
      try {
        this.response = await api.makeRequest(
          this.url,
          this.gatewayKey,
          this.parameters
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    curlString() {
      return `curl -v -X POST -H 'Content-Type: application/json' \
       -H 'x-api-key: ${this.gatewayKey}' \\
-d '${JSON.stringify({ parameters: this.parameters })}' \\
'${this.url}'`;
    },
  },
};
</script>
