<template>
  <div>
    <h2>Authors starting with <span class="capitalize">{{selectedLetter}}</span></h2>
    <author-list :data="results" :action="showTextsBy" />
    <el-pagination
      v-show="results.length !== 0"
      @current-change="goToPage"
      :layout="pagerLayout"
      :page-size="pagerLimit"
      :current-page.sync="page"
    />
  </div>
</template>

<script>
  import { mapState, mapActions, mapMutations } from 'vuex';
  import store from 'store/store';

  import authorList from 'components/authorList';

  export default {
    name: 'authors',
    components: {
      authorList,
    },
    data() {
      return {};
    },
    beforeRouteEnter(to, from, next) {
      // this is not defined so have to access store directely
      store.dispatch('showAuthorsStartingWith', to.params.letter)
        .then(() => next());
    },
    beforeRouteUpdate(to, from, next) {
      store.dispatch('showAuthorsStartingWith', to.params.letter)
        .then(() => next());
    },
    computed: {
      ...mapState([
        'page',
        'pagerLimit',
        'pagerOffset',
        'authorLetters',
        'allLetters',
        'results',
        'selectedLetter',
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
      ...mapActions(['getAuthors']),
      goToPage(page) {
        this.setPage(page);
        this.getAuthors();
      },
      showTextsBy(author) {
        // @TODO: use url param to pass to container and do action from there.
        this.$router.push({ name: 'byAuthor', params: { author } });
      },
    },
};
</script>
