<template>
  <div>
    <el-button @click="addReadingListDialogIsVisible = true">+ reading list</el-button>
    <el-dialog title="Load a reading list" :visible.sync="addReadingListDialogIsVisible">
      <el-select v-model="readingListChoice" filterable placeholder="Select">
        <el-option
          v-for="rl in availableReadingLists"
          :key="rl[0]"
          :label="rl[0]"
          :value="rl[0]">
        </el-option>
      </el-select>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  // TODO: make this fixed, independent of main areas scroll.

  export default {
    name: 'addReadingList',
    components: {},
    data() {
      return {
        addReadingListDialogIsVisible: false,
        readingListChoice: '',
      };
    },
    computed: {
      ...mapState(['availableReadingLists']),
    },
    methods: {},
};
</script>
