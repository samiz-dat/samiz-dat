<template>
  <div id="libraries">
    <h1>LIBRARIES</h1>

    <el-dialog title="Import a remote library" :visible.sync="addRemoteDialogIsVisible">
      <dat-import-field/>
    </el-dialog>

    <el-button-group>
      <el-button size="mini" type="primary" v-on:click="createDirectoryAsDat">Create New Library</el-button>
      <el-button size="mini" type="primary" @click="addRemoteDialogIsVisible = true">Import Remote Library</el-button>
      <el-button size="mini" type="primary" v-on:click="loadDirectoryAsDat">Import Calibre Library</el-button>
    </el-button-group>

    <library-list :dats="dats"/>

  </div>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
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
        addRemoteDialogIsVisible = false;
      },
      createDat() {
        this.createDirectoryAsDat();
        addRemoteDialogIsVisible = false;
      },
    },
};
</script>
