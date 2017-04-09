<template>
  <nav>
    <form method="post">
    <label for="search">Search:</label><input type="text" name="search" v-model="searchQuery">
    <button v-on:click="submit($event)">Search</button>
    </form>
    <ul class="index">
      <li v-for="letter in authorLetters"
        :class="{active: searchIndex === letter}"
        v-on:click="getAuthorsStartingWith(letter)"
      >
        {{letter}}
      </li>
    </ul>
    <div v-show="searchIndex">
      <h2>Authors starting with <span class="capitalize">{{searchIndex}}</span></h2>
      <ul>
        <li v-for="author in authorList">
          <span><a v-on:click="getFilesByAuthor(author.author)">{{author.author}}</a> ({{author.count}})</span>
        </li>
      </ul>
    </div>
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
      ...mapState(['authorLetters', 'searchIndex', 'authorList']),
    },
    methods: {
      ...mapActions(['getAuthorsStartingWith', 'getFilesByAuthor', 'search']),
      submit(event) {
        if (event) event.preventDefault();
        this.search(this.searchQuery);
        this.searchQuery = '';
      },
    },
};
</script>

<style lang="scss" scoped>
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
