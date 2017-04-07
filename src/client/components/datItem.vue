<template>
  <div>
  <a v-on:click="downloadAuthor">{{file.author}}</a> <em>{{file.title}}</em><a v-on:click="action">{{file.file}}</a>
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
          this.download(this.file);
          // console.log('download');
        }
      },
      downloadAuthor: function() {
        this.download({ author:this.file.author });
      },
    },
};
</script>

<style lang="css">
</style>
