<template>
  <div class="item">
    <div :class="{ header: true, downloaded: book.downloaded }">
      <!--
      <div class="author">{{book.author}}</div>
      <div class="title">{{book.title}}</div>
      -->
      <el-button-group>
        <!-- <button v-show="book.downloaded" v-on:click="showItemInFolder">Reveal in Finder</button> -->
        <el-button v-show="!book.downloaded" v-on:click="downloadTitle" size="mini">Download Text</el-button>
        <el-button v-show="!book.downloaded" v-on:click="downloadAuthor" size="mini">Download All By Author</el-button>
      </el-button-group>
    </div>
    <el-row
      v-for="(file, index) in book.files"
      :key="index"
      >
      <el-col :span="4">
        <i :class="fileIcon(file)"></i>
        <!-- show spinner different icon when not downloaded? -->
      </el-col>
      <el-col :span="20">
        <div>
          {{file.file}}
          <el-button v-if="file.downloaded" size="mini" icon="search" v-on:click="showItemInFolder(index)">Show</el-button>
          <el-tag type="gray">{{ datWithKey(file.dat).name }}</el-tag>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import path from 'path';
  import { shell } from 'electron';
  import { mapActions, mapGetters } from 'vuex';
  import { formatPath } from 'dat-cardcat-formats';

  export default {
    name: 'datBook',
    components: {},
    props: {
      book: {
        type: Object,
      },
    },
    data() {
      return {
        downloading: false,
      };
    },
    computed: {
      ...mapGetters(['datWithKey']),
      filepath: function filepath() {
        return this.book.files.map(file => path.join(
          this.datWithKey(file.dat).dir,
          formatPath({
            author: this.book.author,
            title: this.book.title,
            file: file.file,
            format: this.datWithKey(file.dat).format,
          })
        ));
      },
    },
    methods: {
      ...mapActions(['download']),
      showItemInFolder: function showItemInFolder(index) {
        console.log(this.filepath[index]);
        const success = shell.showItemInFolder(this.filepath[index]);
      },
      downloadTitle: function downloadTitle() {
        this.downloading = true;
        this.download({ author: this.book.author, title: this.book.title });
      },
      downloadAuthor: function downloadAuthor() {
        this.downloading = true;
        this.download({ author: this.book.author });
      },
      fileIcon(file) {
        if (file.downloaded) return 'el-icon-check';
        if (this.downloading) return 'el-icon-loading';
        return 'el-icon-minus';
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


    .header {
      display: flex;
      flex-flow: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: flex-start;
      margin: 0.5rem 0;
      color: gray;

      &.downloaded {
        color: black;
      }

      .author {
        flex: 1;
      }
      .title {
        flex: 2;
        font-style: italic;
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
      color: gray;
      li.downloaded {
        color: black;
        a {
          cursor: pointer;
          &:hover {
            color: red;
          }
        }
      }
      .dat {
        font-size: 0.5rem;
      }
    }
  }
</style>
