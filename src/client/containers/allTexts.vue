<template>
  <div>
    <h2>Everything</h2>
    <textList :data="results"/>
    <!-- refactor this so its part of list and configurable via props -->
    <el-pagination
      :layout="pagerLayout"
      v-show="results.length !== 0"
      :page-size="pagerLimit"
      @current-change="goToPage"
      :current-page.sync="page">
    </el-pagination>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import store from 'store/store';
  import textList from 'components/textList';

  export default {
    name: 'allTexts',
    components: {
      textList,
    },
    created() {
      store.dispatch('showEverything');
    },
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'fetching',
        'results',
        'page',
        'pagerLimit',
      ]),
      pagerLayout: {
        get() {
          // @TODO: Someday we should get total counts but for now this handles the end of the pager
          return (this.results.length < this.pagerLimit) ? 'prev' : 'prev, next';
        },
      },
    },
    methods: {
      ...mapMutations(['setPage']),
      ...mapActions(['getEverything']),
      goToPage(page) {
        if (!this.fetching) {
          this.setPage(page);
          this.getEverything();
        }
        return null;
      },
    },
};
</script>
