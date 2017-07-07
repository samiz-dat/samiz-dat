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
      layout="prev, pager, next"
      :page-size="pageSize"
      @current-change="goToPage"
      :current-page.sync="currentPage">
    </el-pagination>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import datBook from 'components/datBook';

  export default {
    name: 'searchResults',
    components: {
      datBook,
    },
    data() {
      return {
        pageSize: 5,
      };
    },
    computed: {
      ...mapState(['results', 'searchQuery', 'pagerOffset']),
      currentPage: {
        get() {
          return (this.pagerOffset/this.pageSize) + 1;
        },
      },
    },
    methods: {
      goToPage(page) {
        this.$store.commit('setPagerLimit', this.pageSize);
        this.$store.commit('setPage', page);
        this.$store.dispatch('search', this.searchQuery);
      }
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
