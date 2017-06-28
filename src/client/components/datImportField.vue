<template>
  <form method="post">
    <p>Import external library:</p>
    <el-input name="key" v-model="key" placeholder="Dat Key"></el-input><br />
    <el-input name="name" v-model="name" placeholder="Name it"></el-input><br />
    <el-button v-on:click="submit($event)" size="mini">Import</el-button>
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

<style lang="scss" scoped>
  form {
    margin: 1rem;
  }
</style>
