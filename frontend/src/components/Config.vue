<template>

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
