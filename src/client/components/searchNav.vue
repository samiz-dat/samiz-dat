<template>
  <nav>
    <form method="post" v-on:submit.stop.prevent="submit()" >
      <el-input
        placeholder="Search"
        name="search"
        v-model="searchQuery"
        size="mini"
      >
        <el-button slot="append" icon="search" v-on:click.stop.prevent="submit($event)"></el-button>
      </el-input>
    </form>
  </nav>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'searchNav',
    components: {},
    data() {
      return {
        searchQuery: '',
      };
    },
    methods: {
      ...mapActions(['newSearch']),
      submit() {
        this.$router.push('/search');
        this.newSearch(this.searchQuery);
        this.searchQuery = '';
      },
    },
};
</script>

<style lang="scss" scoped>

  nav {
    margin: 0 1rem;
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
