<template>
  <div>
    <h2>Authors starting with <span class="capitalize">{{selectedLetter}}</span></h2>
    <el-table
      :data="results"
      empty-text="..."
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="author"
        label="Name"
      >
        <template scope="scope">
          <a v-on:click="getFilesByAuthor(scope.row.author)">{{scope.row.author}}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="Texts"
        width="100"
      />
    </el-table>
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

  export default {
    name: 'authorList',
    components: {},
    data() {
      return {};
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
      ...mapActions(['getAuthors', 'getFilesByAuthor']),
      goToPage(page) {
        this.setPage(page);
        this.getAuthors();
      },
    },
};
</script>
