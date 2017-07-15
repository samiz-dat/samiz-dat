<template>
  <aside>
    <p>Reading lists:</p>
    <add-reading-list/>
    <el-tree
      :data="readingListsTree"
      :props="treeProps"
      :load="loadBranch"
      ref="readingListTree"
      node-key="key"
      empty-text=""
      show-checkbox
      @check-change="checkedBranch"
      lazy
    >
    </el-tree>
  </aside>
</template>

<script>
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
  import addReadingList from 'components/addReadingList';

  export default {
    name: 'readingListNav',
    components: {
      addReadingList,
    },
    data() {
      return {
        treeProps: {
          label: 'label',
          children: 'children',
        },
      };
    },
    computed: {
      ...mapState(['readingLists']),
      ...mapGetters(['uniqueReadingLists']),
      readingListsTree() {
        const lists = this.uniqueReadingLists();
        return lists.map(x => ({ label: x, key: x }));
      },
    },
    methods: {
      ...mapMutations(['selectReadingLists']),
      ...mapActions(['getAuthorLetters']),
      loadBranch(node, resolve) {
        if (node.level === 0) {
          return resolve(this.readingListsTree);
        }
        if (node.data.parent) {
          node.data.parent.push(node.data.label);
        }
        const parent = (node.data.parent)
          ? node.data.parent
          : [node.data.label];
        const data = this.uniqueReadingLists(node.data.key)
          .map(x => ({
            label: x,
            parent,
            key: parent.concat(x).join(';;'),
          }));
        return resolve(data);
      },
      checkedBranch(node, selected, subtreeSelected) {
        this.selectReadingLists(this.$refs.readingListTree.getCheckedKeys());
        this.getAuthorLetters();
      },
    },
};
</script>
