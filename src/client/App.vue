<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <h1>Dat Library</h1>
    <button v-on:click="getDats">List dats</button>
    <button v-on:click="loadDirectoryAsDat">Load directory</button>
    <dat-import-field/>
    <dat-view v-for="dat in dats" :dat="dat" :key="dat.dat"/>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from './components/loader.vue';
  import error from './components/error.vue';
  import datImportField from './components/datImportField.vue';
  import DatView from './components/DatView.vue';

  export default {
    name: 'App',
    components: {
      error,
      loader,
      datImportField,
      DatView,
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
