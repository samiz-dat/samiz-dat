<template>
  <div :class="{ item: true, downloaded: book.downloaded }">
    <div class="header">
      <div class="author">{{book.author}}</div>
      <div class="title">{{book.title}}</div>
      <div class="options">
        <!-- <button v-show="book.downloaded" v-on:click="showItemInFolder">Reveal in Finder</button> -->
        <button v-show="!book.downloaded" v-on:click="downloadTitle">Download Text</button>
        <button v-show="!book.downloaded" v-on:click="downloadAuthor">Download All By Author</button>
      </div>
    </div>
    <div class="extra">
      <ul>
        <li v-for="(file, index) in book.files">
          <div><a v-on:click="showItemInFolder(index)">{{file.file}}</a></div>
          <div class="dat">DAT: {{file.dat}} library</div>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import path from 'path';
  import { shell } from 'electron';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'datBook',
    components: {},
    props: {
      book: {
        type: Object,
      },
    },
    data() {
      return {};
    },
    computed: {
      ...mapGetters(['datWithKey']),
      filepath: function filepath() {
        return this.book.files.map(file => path.join(this.datWithKey(file.dat).dir, this.book.author, this.book.title, file.file));
      },
    },
    methods: {
      ...mapActions(['download']),
      showItemInFolder: function showItemInFolder(index) {
        shell.showItemInFolder(this.filepath[index]);
      },
      downloadTitle: function downloadTitle() {
        this.download({ author: this.book.author, title: this.book.title });
      },
      downloadAuthor: function downloadAuthor() {
        this.download({ author: this.book.author });
      },
    },
};
</script>

<style lang="scss" scoped>
  div.item {
    border-bottom: thin solid black;
    &:last-of-type {
      border-bottom: none;
    }
    // &:nth-of-type(even) {
    //   background-color: red;
    // }

    &.downloaded {
      color: black;
    }

    .header {
      display: flex;
      flex-flow: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-start;
      color: gray;
      margin: 0.5rem 0;

      .author {
        flex: 1;
      }
      .title {
        flex: 2;
      }
      .author,
      .title,
      .options {
        justify-content: flex-start;
      }
      .options {
        display: flex;
        flex: 0;
        flex-flow: column;
        align-items: flex-end;
        button {
          display: block;
          margin: 0.25rem 0;
          white-space: nowrap;
        }
      }
    }
    .extra {
      font-size: 0.8rem;
      .dat {
        font-size: 0.5rem;
      }
    }
  }

  a {
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
</style>
