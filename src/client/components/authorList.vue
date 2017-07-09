<template>
  <el-table
    :data="data"
    empty-text="..."
    stripe
    style="width: 100%"
  >
    <el-table-column
      prop="author"
      label="Name"
    >
      <template scope="scope">
        <a v-on:click="action(scope.row.author)">{{scope.row.author}}</a>
      </template>
    </el-table-column>
    <el-table-column
      prop="count"
      label="Texts"
      width="100"
    />
  </el-table>
</template>

<script>
  export default {
    name: 'authorList',
    props: {
      data: {
        type: Array,
        required: true,
      },
      action: {
        type: Function,
        required: true,
      },
    },
};
</script>
