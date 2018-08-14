<template>
  <div>
    <h2>{{title}}<span v-show="query">{{query}}</span></h2>
    <h3>{{subtitle}}</h3>
    <textList :data="results"/>
    <!-- refactor this so its part of list and configurable via props -->
    <el-pagination
      v-show="results.length !== 0"
      :page-size="pagerLimit"
      @current-change="goToPage"
      :current-page.sync="page"
      layout="prev, pager, next"
      :total="totalResults">
    </el-pagination>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
  import store from 'store/store';
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
      return {
        query: null,
      };
    },
    beforeRouteEnter(to, from, next) {
      // this is not defined so have to access store directely
      if (to.params.author) {
        store.dispatch('showFilesByAuthor', to.params.author)
          .then(() => next(vm => vm.setQuery(to.params.author)));
      } else if (to.params.query) {
        store.dispatch('newSearch', to.params.query)
          .then(() => next(vm => vm.setQuery(to.params.query)));
      }
    },
    beforeRouteUpdate(to, from, next) {
      // this is not defined so have to access store directely
      if (to.params.author) {
        this.setQuery(to.params.author);
        store.dispatch('showFilesByAuthor', to.params.author)
          .then(() => next());
      } else if (to.params.query) {
        this.setQuery(to.params.query);
        store.dispatch('newSearch', to.params.query)
          .then(() => next());
      }
    },
    computed: {
      ...mapState([
        'fetching',
        'results',
        'totalResults',
        'searchQuery',
        'page',
        'pagerLimit',
        'selectedDats',
      ]),
      ...mapGetters([
        'datWithKey',
      ]),
      subtitle() {
        if (this.selectedDats.length === 0) return 'From all libraries';
        if (this.selectedDats.length === 1) return `From ${this.datWithKey(this.selectedDats[0]).name}`;
        return `From ${this.selectedDats.length} selected libraries`;
      },
      title() {
        switch (this.display) {
          case 'SEARCH':
            return 'Search Results: ';
          case 'BY_AUTHOR':
            return 'Text by: ';
          default:
            return '';
        }
      },
    },
    methods: {
      ...mapMutations(['setPage']),
      ...mapActions(['search', 'getFilesByAuthor']),
      setQuery(q) {
        this.query = q;
      },
      goToPage(page) {
        if (!this.fetching) {
          this.setPage(page);
          switch (this.display) {
            case 'SEARCH':
              return this.search(this.query);
            case 'BY_AUTHOR':
              return this.getFilesByAuthor(this.query);
          }
        }
        return null;
      },
    },
};
</script>
