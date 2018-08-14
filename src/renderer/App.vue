<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <main-nav/>
    <router-view></router-view>
    <transition name="fade">
      <download-progress v-show="showProgress" :downloadStat="downloadStat" class="bottom-bar"/>
    </transition>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from 'components/loader';
  import error from 'components/error';
  import mainNav from 'components/mainNav';
  import downloadProgress from 'components/downloadProgress';

  export default {
    name: 'App',
    components: {
      error,
      loader,
      mainNav,
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
  #dat-library {
    margin-bottom: 3rem;
  }

  .bottom-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-leave-to {
    opacity: 0;
  }
</style>
