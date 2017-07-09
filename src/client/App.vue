<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <!-- <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">Processing Center</el-menu-item>
      <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item>
    </el-menu> -->
    <!-- @todo: make this into a proper nav -->
    <router-link to="/">home</router-link>
    <router-link to="/search">search</router-link>
    <router-link to="/libraries">libraries</router-link>
    <router-link to="/reading-lists">reading lists</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from 'components/loader';
  import error from 'components/error';

  export default {
    name: 'App',
    components: {
      error,
      loader,
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
        .then(() => this.getAvailableReadingLists())
        .then(() => this.getAuthorLetters());
    },
    computed: {
      ...mapState(['dats', 'loading', 'error', 'route']),
    },
    methods: {
      ...mapActions(['loadCatalog', 'getDats', 'getAvailableReadingLists', 'getAuthorLetters']),
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
