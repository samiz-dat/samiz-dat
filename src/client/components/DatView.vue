<template>
  <div>
    <h1>Library: {{dat.name}}</h1>
    <p><strong>Key:</strong>{{dat.dat}}</p>
    <ul>
      <li v-for="file in getDatFiles(dat.dat)">
        {{file.author}}, <em>{{file.title}}</em>: {{file.file}}
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'DatView',
    components: {},
    props: ['dat'],
    data() {
      return {};
    },
    created() {
      this.getFiles(this.dat.dat);
    },
    computed: {
      ...mapGetters(['getDatFiles']),
    },
    methods: {
      ...mapActions(['getFiles']),
    },
};
</script>

<style lang="css">
  body, html {  }
</style>
