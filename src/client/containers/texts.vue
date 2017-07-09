<template>
  <div>
    <h2>{{title}}<span v-show="searchQuery">{{searchQuery}}</span></h2>
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
  import textList from 'components/textList';

  export default {
    name: 'texts',
    components: {
      textList,
    },
    props: {
      display: {
        type: String,
      },
    },
    data() {
      return {};
    },
    computed: {
      ...mapState(['results', 'searchQuery', 'page', 'pagerLimit']),
      pagerLayout: {
        get() {
          // @TODO: Someday we should get total counts but for now this handles the end of the pager
          return (this.results.length < this.pagerLimit) ? 'prev' : 'prev, next';
        },
      },
      title() {
        switch (this.display) {
          case 'SEARCH':
            return 'Search Results: ';
          case 'BY_AUTHOR':
            return 'Text by: ';
          default:
            return 'Everything';
        }
      },
    },
    methods: {
      ...mapMutations(['setPage']),
      ...mapActions(['search', 'getFilesByAuthor']),
      goToPage(page) {
        this.setPage(page);
        switch (this.display) {
          case 'SEARCH':
            return this.search(this.searchQuery);
          case 'BY_AUTHOR':
            return this.getFilesByAuthor(this.searchQuery);
          default:
            return this.search();
        }
      },
    },
};
</script>
