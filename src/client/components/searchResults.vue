<template>
  <div>
    <h2>Search Results: <span v-show="searchQuery">{{searchQuery}}</span></h2>
    <div v-show="results.length === 0">Nothing found</div>
    <div v-for="file in results">
      <dat-item :file="file" :dir="datWithKey(file.dat).dir"/>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import datItem from './datItem.vue';

  export default {
    name: 'searchResults',
    components: {
      datItem,
    },
    data() {
      return {};
    },
    computed: {
      ...mapState(['results', 'searchQuery', 'dats']),
    },
    methods: {
      datWithKey: function datWithKey(key) {
        return this.dats.find(d => d.dat === key);
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
