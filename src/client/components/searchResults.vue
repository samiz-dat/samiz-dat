<template>
  <div>
    <h2>Search Results: <span v-show="searchQuery">{{searchQuery}}</span></h2>
    <div v-show="results.length === 0">Nothing found</div>
    <el-table v-show="results.length !== 0" :data="results" style="width:100%">
      <el-table-column type="expand">
        <template scope="books">
          <dat-book :key="books.row.dat" :book="books.row"/>
        </template>
      </el-table-column>
      <el-table-column
        label="Author"
        prop="author">
      </el-table-column>
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
    </el-table>
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
  import datBook from 'components/datBook';

  export default {
    name: 'searchResults',
    components: {
      datBook,
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
    },
    methods: {
      ...mapMutations(['setPage']),
      ...mapActions(['search']),
      goToPage(page) {
        this.setPage(page);
        this.search(this.searchQuery);
      },
    },
};
</script>

<style lang="scss" scoped>
  .capitalize {
    text-transform: uppercase;
  }

  ul.index {
    display: block;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      list-style-type: none;
      margin: 0.5rem;
      padding: 0;
      cursor: pointer;

      &:hover, &.active {
        text-decoration: underline;
      }
    }
  }
</style>
