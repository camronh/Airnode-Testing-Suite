<template>
  <v-card flat>
    <template>
      <v-card-text>
        <v-autocomplete
          auto-select-first
          label="Endpoint"
          outlined
          @change="parseParams"
          :items="endpointNames"
          v-model="selectedEndpoint"
          dense
          :disabled="!config"
          :filled="selectedEndpoint"
        />
      </v-card-text>
    </template>
    <template v-if="endpoint">
      <v-card-title>Parameters</v-card-title>
      <v-card-subtitle> The parameters to be sent to Airnode </v-card-subtitle>
      <v-row>
        <template v-for="(value, name) in allParams">
          <v-col cols="12" md="4" :key="name">
            <v-card-text>
              <v-row align="center">
                <v-checkbox
                  @change="$emit('update:params', enabledParams)"
                  :id="`${name}-checkbox`"
                  v-model="enabled[name]"
                >
                </v-checkbox>
                <v-text-field
                  dense
                  @input="$emit('update:params', enabledParams)"
                  :label="name"
                  :id="`${name}-text-field`"
                  :disabled="!enabled[name]"
                  v-model="params[name]"
                ></v-text-field>
              </v-row>
            </v-card-text>
          </v-col>
        </template>
      </v-row>
    </template>
  </v-card>
</template>

<script>
export default {
  name: "App",
  props: ["config", "params"],

  data: () => ({
    enabled: {
      _type: true,
      _path: true,
    },
    allParams: {},
    selectedEndpoint: null,
  }),
  computed: {
    paramNames() {
      console.log(this.endpoint);
      if (!this.endpoint) return [];
      let paramsList = this.endpoint.parameters.map((param) => param.name);
      paramsList.push(...["_type", "_path"]);
      return paramsList;
    },
    endpointNames() {
      if (!this.config) return [];
      return this.config.triggers.rrp.map((endpoint) => endpoint.endpointName);
    },
    enabledParams() {
      const enabledParams = {};
      for (let param in this.params) {
        if (this.enabled[param]) enabledParams[param] = this.params[param];
      }
      return enabledParams;
    },

    endpoint() {
      if (!this.config || !this.selectedEndpoint) return null;

      let endpoint = this.config.ois[0].endpoints.find(
        (endpoint) => endpoint.name === this.selectedEndpoint
      );

      endpoint.endpointId = this.config.triggers.rrp.find(
        (endpoint) => endpoint.endpointName === this.selectedEndpoint
      ).endpointId;
      return endpoint;
    },
  },
  methods: {
    parseParams() {
      let paramsList = this.endpoint.parameters.map((param) => param.name);
      paramsList.push(...["_type", "_path"]);
      let params = {};
      paramsList.forEach((param) => {
        params[param] = "";
      });
      this.params = params;
      this.allParams = params;
      this.$emit("update:endpoint", this.endpoint);
      this.$emit("update:params", params);
    },
  },
};
</script>
