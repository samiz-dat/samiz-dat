<template>
  <div>
    <div v-show="data.length === 0">Nothing found</div>
    <el-table v-show="data.length !== 0" :data="data" style="width:100%">
      <el-table-column type="expand">
        <template scope="books">
          <dat-book :key="books.row.dat" :book="books.row"/>
        </template>
      </el-table-column>
      <el-table-column
        label="Author"
        prop="author">
      </el-table-column>
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import datBook from 'components/datBook';

  export default {
    name: 'textList',
    components: {
      datBook,
    },
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
};
</script>

<style lang="scss" scoped>
  .capitalize {
    text-transform: uppercase;
  }

  ul.index {
    display: block;
    padding: 0;
    margin: 0;

    li {
      display: inline-block;
      list-style-type: none;
      margin: 0.5rem;
      padding: 0;
      cursor: pointer;

      &:hover, &.active {
        text-decoration: underline;
      }
    }
  }
</style>
