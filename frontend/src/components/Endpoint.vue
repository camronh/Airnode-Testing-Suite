<template>
  <v-card flat>
    <template>
      <v-card-text>
        <v-autocomplete
          auto-select-first
          label="Endpoint"
          outlined
          @change="$emit('update:endpoint', endpoint)"
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
      <v-card-subtitle>
        The parameters to be sent to the HTTP Gateway
      </v-card-subtitle>
      <v-row>
        <template v-for="param of paramNames">
          <v-col cols="12" md="4" :key="param">
            <v-card-text>
              <v-row align="center">
                <v-checkbox @change="$emit('update:params', enabledParams)" :id="`${param}-checkbox`" v-model="enabled[param]">
                </v-checkbox>
                <v-text-field
                  dense
                  @input="$emit('update:params', enabledParams)"
                  :label="param"
                  :disabled="!enabled[param]"
                  v-model="parameters[param]"
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
  props: ["config"],

  data: () => ({
    selectedParams: [],
    parameters: {},
    enabled: {
      _type: true,
      _path: true,
    },
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
      for (let param of this.paramNames) {
        if (this.enabled[param]) enabledParams[param] = this.parameters[param];
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
    emitData() {
      let endpoint = this.config.ois[0].endpoints.find(
        (endpoint) => endpoint.name === this.selectedEndpoint
      );

      endpoint.endpointId = this.config.triggers.rrp.find(
        (endpoint) => endpoint.endpointName === this.selectedEndpoint
      ).endpointId;
      this.$emit("update:endpoint", endpoint);
    },
  },
};
</script>
