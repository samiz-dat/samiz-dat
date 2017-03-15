<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <h1>Dat Library</h1>
    <div>{{dats}}</div>
    <div>{{error}}</div>
    <button v-on:click="getDats">List dats</button>
    <button v-on:click="loadDirectoryAsDat">Load directory</button>
    <dat-import-field/>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from './components/loader.vue';
  import datImportField from './components/datImportField.vue';

  export default {
    name: 'App',
    components: {
      loader,
      datImportField,
    },
    data() {
      return {};
    },
    created() {
      // initialise catalog on app start
      this.loadCatalog();
    },
    computed: {
      ...mapState(['dats', 'loading', 'error']),
    },
    methods: {
      ...mapActions(['loadCatalog', 'loadDirectoryAsDat', 'getDats']),
    },
};
</script>

<style lang="css">
  body, html {  }
</style>
