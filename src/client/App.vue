<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <main>
      <h1>Dat Library</h1>
      <search-nav/>
      <search-results/>
    <!-- <button v-on:click="getDats">List dats</button> -->
      <!-- <dat-view v-for="dat in dats" :dat="dat" :key="dat.dat"/> -->
    </main>
    <side-nav/>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from 'components/loader';
  import error from 'components/error';
  import datImportField from 'components/datImportField';
  import DatView from 'components/DatView';
  import sideNav from 'components/sideNav';
  import searchNav from 'components/searchNav';
  import searchResults from 'components/searchResults';

  export default {
    name: 'App',
    components: {
      error,
      loader,
      datImportField,
      DatView,
      sideNav,
      searchNav,
      searchResults,
    },
    data() {
      return {};
    },
    created() {
      // initialise catalog on app start
      // this is currently failing occationally for two reasons
      // 1. error because dat is LOCKED
      // 2. promise from datcat is never resolved for some reason.
      this.loadCatalog()
        .then(() => this.getDats())
        .then(() => this.getAuthorLetters());
    },
    computed: {
      ...mapState(['dats', 'loading', 'error']),
    },
    methods: {
      ...mapActions(['loadCatalog', 'getDats', 'getAuthorLetters']),
      submit(event) {
        if (event) event.preventDefault();
        console.log(this.search);
      },
    },
};
</script>

<style lang="scss">

  button {
    border: solid thin black;
    background-color: white;
    cursor: pointer;
    margin: 1rem;
    transition: color ease 300ms, background-color ease 300ms;

    &:hover {
      color: white;
      background-color: black;
    }
  }

  body, html {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
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
