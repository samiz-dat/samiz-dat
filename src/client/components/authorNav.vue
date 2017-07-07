<template>
  <div>
    <el-button-group>
      <el-button v-for="(letter, index) in allLetters"
      :key="letter"
      @click="loadLetter(letter)"
      :disabled="!authorLetters.includes(letter)"
      size="mini"
      >
      {{letter}}
      </el-button>
    </el-button-group>
    <div v-show="searchIndex">
      <h2>Authors starting with <span class="capitalize">{{searchIndex}}</span></h2>
      <el-table
        :data="authorList"
        empty-text="..."
        stripe
        style="width: 100%">
        <el-table-column
          prop="author"
          label="Name">
          <template scope="scope">
            <a v-on:click="getFilesByAuthor(scope.row.author)">{{scope.row.author}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="Texts"
          width="100">
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        @current-change="goToPage"
        :current-page.sync="currentPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'authorNav',
    components: {},
    data() {
      return {
        letter: 'a',
        currentPage: 1,
        pageSize: 3,
      };
    },
    computed: {
      ...mapState(['pagerLimit', 'pagerOffset', 'authorLetters', 'allLetters', 'authorList', 'searchIndex']),
    },
    methods: {
      ...mapActions(['getAuthorsStartingWith', 'getFilesByAuthor']),
      loadLetter(letter) {
        this.letter = letter;
        this.currentPage = 1;
        this.goToPage(this.currentPage);
      },
      goToPage(page) {
        this.$store.commit('setPagerLimit', this.pageSize);
        this.$store.commit('setPage', page);
        this.$store.dispatch('getAuthorsStartingWith', this.letter);
      }
    },
};
</script>
