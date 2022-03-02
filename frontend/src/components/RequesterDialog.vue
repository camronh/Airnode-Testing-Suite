<template>
  <v-card>
    <v-card-title>
      Smart Contract Request
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDialog')" icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3" v-for="(value, name) in params" :key="name">
          <v-text-field outlined dense :value="value" :label="name" readonly>
          </v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <br />
      <v-row align="center" justify="center">
        <v-col cols="12" md="11">
          <v-textarea
            dense
            label="Request Logs"
            outlined
            readonly
            :value="logString"
            :loading="makingRequest"
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
      sponsorAddress: "",
      logString: "",
      makingRequest: false,
    };
  },
  methods: {
    makeRequest(){
      
    }
  },
  computed: {
    curlString() {
      return `curl -v -X POST -H 'Content-Type: application/json' -H 'x-api-key: ${
        this.gatewayKey
      }' \\
-d '${JSON.stringify({ parameters: this.parameters })}' \\
'${this.receipt.api.httpGatewayUrl}/${this.endpoint.endpointId}'`;
    },
  },
};
</script>
