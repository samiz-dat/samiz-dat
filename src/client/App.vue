<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <!-- <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">Processing Center</el-menu-item>
      <el-menu-item index="3"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item>
    </el-menu> -->
    <el-row type="flex" class="extra-light-grey-bg" align="middle" justify="space-around">
      <el-col :span="16">
        <el-menu :router="true" :default-active="$route.path" mode="horizontal">
          <el-menu-item index="/">home</el-menu-item>
          <el-menu-item index="/search">browse</el-menu-item>
          <el-menu-item index="/libraries">libraries</el-menu-item>
          <el-menu-item index="/reading-lists">reading lists</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="8">
        <search-nav />
        <!-- <el-input
          placeholder="Search"
          name="search"
          v-model="searchQuery"
          size="mini"
        >
          <el-button slot="append" icon="search" v-on:click.stop.prevent="submit($event)"></el-button>
        </el-input> -->
      </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from 'components/loader';
  import error from 'components/error';
  import searchNav from 'components/searchNav';

  export default {
    name: 'App',
    components: {
      error,
      loader,
      searchNav,
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

<!-- <style src="assets/fonts/fonts.scss"></style>
<style src="assets/main.scss" lang="scss"></style> -->
<style lang="scss">
  body {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    margin: 0;
    padding: 0;
    width:100%;
  }
  .extra-light-grey-bg {
    background-color: #EFF2F7;
  }
  // #dat-library {
  //   display: flex;
  //   flex-direction: row;
  //   align-items: stretch;
  //   flex-wrap: nowrap;
  //   justify-content: center;
  //   min-height: 100%;
  //   width: 100%;

  //   main {
  //     flex: 1;
  //     min-height: 100%;
  //     margin: 1rem;
  //     overflow: hidden;
  //   }
  // }
</style>
