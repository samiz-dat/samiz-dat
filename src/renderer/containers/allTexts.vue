<template>
  <div>
    <h2>Everything</h2>
    <textList :data="results"/>
    <!-- refactor this so its part of list and configurable via props -->
    <el-pagination
      layout="prev, pager, next"
      v-show="results.length !== 0"
      :page-size="pagerLimit"
      @current-change="goToPage"
      :current-page.sync="page"
      :total="totalResults">
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
        'totalResults',
        'page',
        'pagerLimit',
      ]),
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
