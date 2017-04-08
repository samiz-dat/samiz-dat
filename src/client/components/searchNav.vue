<template>
  <nav>
    <form method="post">
    <label for="search">Search:</label><input type="text" name="search" v-model="search">
    <button v-on:click="submit($event)">Search</button>
    </form>
    <h2>Author Index</h2>
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
          <span><a>{{author.author}}</a> ({{author.count}})</span>
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
        search: '',
      };
    },
    computed: {
      ...mapState(['authorLetters', 'searchIndex', 'authorList']),
    },
    methods: {
      ...mapActions(['getAuthorsStartingWith']),
      submit(event) {
        if (event) event.preventDefault();
        console.log(this.search);
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
