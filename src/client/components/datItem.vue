<template>
  <div>{{file.author}} <em>{{file.title}}</em><a v-on:click="action">{{file.file}}</a>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'datItem',
    components: {},
    props: {
      file: {
        type: Object,
      },
    },
    data() {
      return {};
    },
    methods: {
      ...mapActions(['download']),
      action: function () {
        console.log(this.file);
        if (this.file.downloaded) {
          // open file
          console.log('open');
        } else {
          // this.download();
          console.log('download');
        }
      },
    },
};
</script>

<style lang="css">
</style>
