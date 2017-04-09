<template>
  <div>
    <h2>Search Results: <span v-show="searchQuery">{{searchQuery}}</span></h2>
    <div v-show="results.length === 0">Nothing found</div>
    <dat-book v-for="book in results" :key="book.dat" :book="book"/>
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
      return {};
    },
    computed: {
      ...mapState(['results', 'searchQuery']),
    },
    methods: {},
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
