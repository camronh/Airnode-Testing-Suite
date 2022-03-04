<template>
  <v-card flat>
    <v-card-title>Parameters</v-card-title>
    <v-card-subtitle>
      The parameters to be sent to the HTTP Gateway
    </v-card-subtitle>
    <v-card-text>
      <v-autocomplete
        outlined
        dense
        :disabled="!endpoint"
        multiple
        small-chips
        v-model="selectedParams"
        @change="$emit('update:params', parameters)"
        clearable
        :items="paramsNames"
      />
    </v-card-text>
    <template v-if="endpoint">
      <v-card-title> Values </v-card-title>
      <v-card-subtitle> Parameter values </v-card-subtitle>
      <v-card-text>
        <v-row justify="center">
          <v-col cols="12" md="3" v-for="param of selectedParams" :key="param">
            <v-text-field
              outlined
              dense
              @change="$emit('update:params', parameters)"
              :label="param"
              v-model="parameters[param]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>

<script>
export default {
  name: "App",
  props: ["endpoint"],

  data: () => ({
    selectedParams: [],
    parameters: {},
  }),
  computed: {
    paramsNames() {
      console.log(this.endpoint);
      if (!this.endpoint) return [];
      let paramsList = this.endpoint.parameters.map(param => param.name);
      paramsList.push(...["_type", "_path"]);
      return paramsList;
    },
  },
  methods: {},
};
</script>
