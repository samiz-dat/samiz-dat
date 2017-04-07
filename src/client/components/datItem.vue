<template>
  <div :class="{downloaded: file.downloaded}">
  <a v-on:click="downloadAuthor">{{file.author}}</a> <em>{{file.title}}</em><a v-on:click="action">{{file.file}}</a>
  </div>
</template>

<script>
  import path from 'path';
  import { shell } from 'electron';
  import { mapActions } from 'vuex';

  export default {
    name: 'datItem',
    components: {},
    props: {
      dir: {
        type: String,
      },
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
          // shell.openItem()
          shell.showItemInFolder(path.join(this.dir, this.file.author, this.file.title, this.file.file));
        } else {
          // this.download();
          this.download(this.file);
          // console.log('download');
        }
      },
      downloadAuthor: function () {
        this.download({ author: this.file.author });
      },
    },
};
</script>

<style lang="scss" scoped>
  div.downloaded {
    color: black;
  }
  div {
    color: gray;
  }
  a {
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
</style>
