<template>
  <nav>
    <form method="post">
    <el-input
      placeholder="Search"
      name="search"
      v-model="searchQuery"
      size="mini"
    >
      <el-button slot="append" icon="search" v-on:click="submit($event)"></el-button>
    </el-input>
    </form>
  </nav>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'searchNav',
    components: {},
    data() {
      return {
        searchQuery: '',
      };
    },
    computed: {
      ...mapState(['searchIndex']),
    },
    methods: {
      ...mapActions(['search']),
      submit(event) {
        if (event) event.preventDefault();
        this.search(this.searchQuery);
        this.searchQuery = '';
      },
    },
};
</script>

<style lang="scss" scoped>

  nav {
    border-bottom: thick solid black;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  .capitalize {
    text-transform: uppercase;
  }

  a {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
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
