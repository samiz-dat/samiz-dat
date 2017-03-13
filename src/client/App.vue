<template>
  <div id="dat-library">
    <h1>Dat Library</h1>
    <div>{{loading}}</div>
    <div>{{dats}}</div>
    <div>{{error}}</div>
    <button v-on:click="getDats">List dats</button>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'App',
    components: {},
    data() {
      return {};
    },
    created() {
      // do something
      this.loadCatalog();
      console.log('created', this);
    },
    computed: {
      ...mapState(['dats', 'loading', 'error']),
    },
    methods: {
      ...mapActions(['loadCatalog', 'getDats']),
    },
};
</script>
