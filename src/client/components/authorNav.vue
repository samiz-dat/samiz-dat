<template>
  <div>
    <el-button-group>
      <el-button v-for="letter in allLetters"
      v-on:click="getAuthorsStartingWith(letter)"
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
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'authorNav',
    components: {},
    data() {
      return {};
    },
    computed: {
      ...mapState(['authorLetters', 'allLetters', 'authorList', 'searchIndex']),
    },
    methods: {
      ...mapActions(['getAuthorsStartingWith', 'getFilesByAuthor']),
    },
};
</script>
