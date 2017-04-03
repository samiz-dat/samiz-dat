<template>
  <form method="post">
    <label for="key">Dat Key:</label><input type="text" name="key" v-model="key"><br>
    <label for="name">Dat Name:</label><input type="text" name="name" v-model="name"><br>
    <button v-on:click="submit($event)">import</button>
  </form>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'DatImportField',
    components: {},
    data() {
      return {
        key: '',
        name: '',
      };
    },
    methods: {
      ...mapActions(['importDat']),
      submit(event) {
        if (event) event.preventDefault();
        const { key, name } = this;
        this.importDat({ key, name });
      },
    },
};
</script>

<style lang="css">
  body, html {  }
</style>
