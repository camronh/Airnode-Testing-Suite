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
      <v-text-field outlined dense label="Gateway Key" v-model="gatewayKey"> </v-text-field>
      <v-row>
        <v-col cols="12" md="2" v-for="(value, name) in params" :key="name">
          <v-text-field outlined dense v-model="parameters[name]" :label="name">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn block outlined color="primary"> Make Request </v-btn>
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
          <v-text-field outlined dense label="Result" readonly :disabled="!response"></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            dense
            label="Raw Response"
            outlined
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
export default {
  name: "App",
  props: ["endpoint", "receipt", "params"],
  data() {
    return {
      parameters: this.params,
      gatewayKey: "",
      response: null,
    };
  },
  methods: {},
  computed: {
    curlString() {
      return `curl -v -X POST -H 'Content-Type: application/json' -H 'x-api-key: ${this.gatewayKey}' \\
-d '${JSON.stringify({ parameters: this.parameters })}' \\
'${this.receipt.api.httpGatewayUrl}/${this.endpoint.endpointId}'`;
    },
  },
};
</script>
