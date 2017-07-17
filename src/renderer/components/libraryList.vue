<template>
  <el-collapse>
    <el-collapse-item v-for="(dat, index) in dats" :key="dat.dat" :title="dat.name">
      <template slot="title">
        <i class="header-icon el-icon-edit" v-show="dat.writeable === true"></i>
        {{ dat.name }}
      </template>
      To share this library with someone, send them this key:
      <p>
        <el-input readonly :value="dat.dat"></el-input>
      </p>
      <el-button-group>
        <el-button type="primary" v-on:click="downloadDat(dat.dat)" v-show="!dat.writeable">Download entire library</el-button>
        <el-button type="primary" v-on:click="openLibrary(dat.dat)"><i class="el-icon-view"></i></el-button>
        <el-button type="primary" v-on:click="openAddFileDialog(dat.dat)" v-if="dat.writeable">Add file</el-button>
        <el-button type="warning" v-on:click="confirmDeleteVisible = true"><i class="el-icon-delete"></i></el-button>
      </el-button-group>
      <el-dialog title="Are you sure?" :visible.sync="confirmDeleteVisible">
        <p>Are you sure you want to delete this library?</p>
        <el-button v-on:click="confirmedRemove(dat.dat)" type="danger">Delete</el-button>
        <el-button @click="confirmDeleteVisible = false">Not now</el-button>
      </el-dialog>
      <el-dialog title="Add a file?" :visible.sync="addFileDialogIsVisible">
        <add-file :defaultDat="selectedDat"></add-file>
      </el-dialog>
      <library-stats :dat="dat"/>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
  import { shell } from 'electron';
  import libraryStats from 'components/libraryStats';
  import addFile from 'components/addFile';

  export default {
    name: 'libraryList',
    components: {
      libraryStats,
      addFile,
    },
    props: {
      dats: {
        type: Array,
      },
    },
    data() {
      return {
        selectedDat: '',
        addFileDialogIsVisible: false,
        confirmDeleteVisible: false,
      };
    },
    computed: {
      ...mapState(['loading', 'error', 'route']),
      ...mapGetters(['datStats', 'datWithKey']),
      stats() {
        return this.datStats(this.dat.dat);
      },
    },
    methods: {
      ...mapActions(['removeDat', 'download']),
      confirmedRemove(dat) {
        this.removeDat(dat);
        this.confirmDeleteVisible = false;
      },
      downloadDat(key) {
        this.download({ dat: key });
        this.$notify({
          title: 'Download',
          message: 'starting now',
        });
      },
      openLibrary(key) {
        const dir = this.datWithKey(key).dir;
        shell.showItemInFolder(dir);
      },
      openAddFileDialog(key) {
        this.selectedDat = key;
        this.addFileDialogIsVisible = true;
      }
    },
};
</script>
