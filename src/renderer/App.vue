<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <el-row type="flex" class="extra-light-grey-bg" align="middle" justify="space-around">
      <el-col :span="16">
        <el-menu :router="true" :default-active="$route.path" mode="horizontal">
          <el-menu-item index="/search">Browse</el-menu-item>
          <el-menu-item index="/libraries">Libraries</el-menu-item>
          <el-menu-item index="/">Info</el-menu-item>
          <!-- <el-menu-item index="/reading-lists">reading lists</el-menu-item> -->
        </el-menu>
      </el-col>
      <el-col :span="8">
        <search-nav />
      </el-col>
    </el-row>
    <router-view></router-view>
    <transition>
      <download-progress v-show="showProgress" :downloadStat="downloadStat" class="bottom-bar"/>
    </transition>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from 'components/loader';
  import error from 'components/error';
  import searchNav from 'components/searchNav';
  import downloadProgress from 'components/downloadProgress';

  export default {
    name: 'App',
    components: {
      error,
      loader,
      searchNav,
      downloadProgress,
    },
    data() {
      return {
        downloadTimeout: null,
        showProgress: false,
      };
    },
    created() {
      // initialise catalog on app start
      // this is currently failing occationally for two reasons
      // 1. error because dat is LOCKED
      // 2. promise from datcat is never resolved for some reason.
      this.loadCatalog()
        .then(() => this.getDats())
        // .then(() => this.getAvailableReadingLists())
        .then(() => this.getAuthorLetters());
    },
    beforeDestroy() {
      if (this.timeout) clearTimeout(this.timeout);
    },
    watch: {
      downloadStat() {
        if (!this.downloadStat) return;
        if (this.timeout) clearTimeout(this.timeout);
        this.showProgress = true;
        this.timeout = setTimeout(() => {
          this.showProgress = false;
        }, 1000);
      },
    },
    computed: {
      ...mapState(['dats', 'loading', 'error', 'route', 'downloadStat']),
    },
    methods: {
      ...mapActions(['loadCatalog', 'getDats', 'getAvailableReadingLists', 'getAuthorLetters']),
    },
};
</script>

<style src="assets/fonts/fonts.scss"></style>
<style src="assets/main.scss" lang="scss"></style>
<style lang="scss" scoped>
  .bottom-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .extra-light-grey-bg {
    background-color: #EFF2F7;
  }

  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-leave-to {
    opacity: 0;
  }
</style>
