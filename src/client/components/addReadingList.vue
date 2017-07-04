<template>
  <div>
    <el-button @click="addReadingListDialogIsVisible = true">+ reading list</el-button>
    <el-dialog title="Load a reading list" :visible.sync="addReadingListDialogIsVisible">
      <el-select v-model="readingListChoice" filterable placeholder="Select">
        <el-option
          v-for="rl in this.unusedReadingLists"
          :key="rl"
          :label="rl[0]"
          :value="rl">
        </el-option>
      </el-select>
      <el-button @click="load">Load reading list</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
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
      ...mapState(['availableReadingLists', 'readingLists']),
      ...mapGetters(['uniqueReadingLists']),
      unusedReadingLists: function() {
        const lists = this.uniqueReadingLists();
        return this.availableReadingLists.filter(rl => !lists.includes(rl[0]));
      },
    },
    methods: {
      ...mapActions(['loadReadingList']),
      load() {
        this.loadReadingList(this.readingListChoice);
        this.addReadingListDialogIsVisible = false;
      }
    },
};
</script>
