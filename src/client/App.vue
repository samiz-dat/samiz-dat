<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <el-row>
      <el-col :span="19">
        <main>
          <dat-nav/>
          <search-nav/>
          <search-results/>
        </main>
      </el-col>
      <el-col :span="5">
        <side-nav/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from 'components/loader';
  import error from 'components/error';
  import datImportField from 'components/datImportField';
  import datNav from 'components/datNav';
  import sideNav from 'components/sideNav';
  import searchNav from 'components/searchNav';
  import searchResults from 'components/searchResults';

  export default {
    name: 'App',
    components: {
      error,
      loader,
      datImportField,
      datNav,
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
        .then(() => this.getCollections())
        .then(() => this.getAuthorLetters());
    },
    computed: {
      ...mapState(['dats', 'loading', 'error']),
    },
    methods: {
      ...mapActions(['loadCatalog', 'getDats', 'getCollections', 'getAuthorLetters']),
      submit(event) {
        if (event) event.preventDefault();
        console.log(this.search);
      },
    },
};
</script>
<!--
<style src="assets/fonts/fonts.scss"></style>
<style src="assets/main.scss" lang="scss"></style>
<style lang="scss">
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
      min-height: 100%;
      margin: 1rem;
      overflow: hidden;
    }
  }
</style>
-->
