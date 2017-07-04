<template>
  <aside>
    <p>Reading lists:</p>
    <add-reading-list/>
    <el-tree
      :data="readingListsTree"
      :props="treeProps"
      :load="loadBranch"
      node-key="key"
      show-checkbox
      @check-change="checkedBranch"
      lazy
    >
    </el-tree>
    <!--
    <ul>
      <li>
        <input type="checkbox" id="coll-all" value="all" v-model="clearCollections" checked>
        <label for="dat-all">All items</label>
      </li>
      <li>

      </li>
      <li v-for="(coll, index) in readingLists">
        <input type="checkbox" :id="`coll-${index}`" :value="coll.collection" v-model="selectedCollections">
        <label :for="`coll-${index}`">{{ coll.collection.replace(';;', ' -> ') }}</label>
      </li>
    </ul>
    -->
  </aside>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
  import addReadingList from 'components/addReadingList';
  // TODO: make this fixed, independent of main areas scroll.

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
        }
      };
    },
    computed: {
      ...mapState(['readingLists']),
      ...mapGetters(['uniqueReadingLists']),
      readingListsTree: function() {
        const lists = this.uniqueReadingLists();
        return lists.map(x => ({ label: x, key: x }))
      },
      selectedCollections: {
        get() {
          return this.$store.state.selectedCollections;
        },
        set(value) {
          this.$store.commit('selectReading', value);
          this.$store.dispatch('getAuthorLetters');
        },
      },
    },
    methods: {
      loadBranch(node, resolve) {
        if (node.level === 0) {
          return resolve(this.readingListsTree);
        }
        if (node.data.parent) {
          node.data.parent.push(node.data.label);
        }
        const parent = (node.data.parent)
          ? node.data.parent
          : [ node.data.label ];
        const data = this.uniqueReadingLists(parent)
          .map(x => ({
            label: x,
            parent: parent,
            key: parent.concat(x).join(';;'),
          }));
        return resolve(data);
      },
      checkedBranch(node, selected, subtreeSelected) {
        this.$store.commit('selectReadingLists', node.key);
        this.$store.dispatch('getAuthorLetters');
      }
    },
};
</script>
