<template>
  <el-table
    id="authorList"
    :data="data"
    empty-text="..."
    stripe
    style="width: 100%"
    @row-click="clickedRow"
  >
    <el-table-column
      prop="author"
      label="Name"
    />
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
    methods: {
      clickedRow(row) {
        this.action(row.author);
      },
    },
};
</script>
<style lang="scss">
  // total hack to get pointer cursor
  #authorList .el-table__row {
    &:hover {
      cursor: pointer !important;
    }
  }
</style>
