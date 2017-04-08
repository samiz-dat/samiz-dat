<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <main>
      <h1>Dat Library</h1>
    <!-- <button v-on:click="getDats">List dats</button> -->
      <dat-view v-for="dat in dats" :dat="dat" :key="dat.dat"/>
    </main>
    <side-nav/>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from './components/loader.vue';
  import error from './components/error.vue';
  import datImportField from './components/datImportField.vue';
  import DatView from './components/DatView.vue';
  import sideNav from './components/sideNav.vue';

  export default {
    name: 'App',
    components: {
      error,
      loader,
      datImportField,
      DatView,
      sideNav,
    },
    data() {
      return {
        selectedDats: [],
      };
    },
    created() {
      // initialise catalog on app start
      this.loadCatalog()
        .then(() => this.getDats());
    },
    computed: {
      ...mapState(['dats', 'loading', 'error']),
    },
    methods: {
      ...mapActions(['loadCatalog', 'loadDirectoryAsDat', 'getDats']),
    },
};
</script>

<style lang="scss">
  html {
    height: 100%;
  }

  body, html {
    padding: 0;
    margin: 0;
    width: 100%;
  }

  #dat-library {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: nowrap;
    justify-content: center;
    min-height: 100%;
    width: 100%;

    main {
      flex: 1;
      width: 75%;
      min-height: 100%;
      margin: 1rem;
      overflow: hidden;
    }
  }
</style>
