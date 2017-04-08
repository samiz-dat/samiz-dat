<template>
  <nav>
    <form method="post">
    <label for="search">Search:</label><input type="text" name="search" v-model="search">
    <button v-on:click="submit($event)">Search</button>
    </form>
    <ul>
      <li v-for="letter in authorLetters">{{letter}}</li>
    </ul>
  </nav>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'searchNav',
    components: {},
    data() {
      return {
        search: '',
      };
    },
    computed: {
      ...mapState(['authorLetters']),
    },
    methods: {
      submit(event) {
        if (event) event.preventDefault();
        console.log(this.search);
      },
    },
};
</script>

<style lang="scss" scoped>
  ul {
    display: block;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      list-style-type: none;
      margin: 0.5rem;
      padding: 0;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
