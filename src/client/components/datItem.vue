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
      action: function action() {
        if (this.file.downloaded) {
          const filepath = path.join(this.dir, this.file.author, this.file.title, this.file.file);
          // shell.openItem(filepath)
          shell.showItemInFolder(filepath);
        } else {
          this.download(this.file);
        }
      },
      downloadAuthor: function downloadAuthor() {
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
