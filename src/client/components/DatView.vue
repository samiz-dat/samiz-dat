<template>
  <div>
    <h1>Library: {{dat.name}}</h1>
    <p><strong>Key:</strong>{{dat.dat}}</p>
    <ul>
      <li v-for="file in getDatFiles(dat.dat)">
        <dat-item :file="file" :dir="dat.dir"/>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import datItem from 'components/datItem';

  export default {
    name: 'DatView',
    components: { datItem },
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
