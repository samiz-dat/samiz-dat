<template>
  <div id="libraries">
    <div class="submenu">
      <div class="subtitle">
        <h2>Libraries</h2>
      </div>
      <div class="buttons">
        <el-button size="mini" type="primary" v-on:click="createDirectoryAsDat">Create New Library</el-button>
        <el-button size="mini" type="primary" v-on:click="loadDirectoryAsDat">Import Calibre Library</el-button>
        <el-button size="mini" type="primary" @click="addRemoteDialogIsVisible = true">Import Library With Key</el-button>
      </div>
    </div>
    <el-dialog title="Import a remote library" :visible.sync="addRemoteDialogIsVisible">
      <dat-import-field :onSubmit="() => addRemoteDialogIsVisible=false"/>
    </el-dialog>
    <library-list :dats="dats"/>

  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import datImportField from 'components/datImportField';
  import libraryList from 'components/libraryList';

  export default {
    name: 'libraries',
    components: {
      datImportField,
      libraryList,
    },
    data() {
      return {
        addRemoteDialogIsVisible: false,
      };
    },
    computed: {
      ...mapState(['dats', 'loading', 'error', 'route']),
    },
    methods: {
      ...mapActions(['loadDirectoryAsDat', 'createDirectoryAsDat']),
      loadDat() {
        this.loadDirectoryAsDat();
        this.addRemoteDialogIsVisible = false;
      },
      createDat() {
        this.createDirectoryAsDat();
        this.addRemoteDialogIsVisible = false;
      },
    },
};
</script>

<style lang="scss" scoped>
  .submenu {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;

    padding: 0 1rem;

    div {
      display: flex;
    }

    div.buttons {
      align-items: center;
    }
  }
</style>

