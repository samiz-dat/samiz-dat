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
          <el-button type="primary" v-on:click="download({ dat: dat.dat })" v-show="!dat.writeable">Download entire library</el-button>
          <el-button type="warning" v-on:click="removeDat(dat.dat)"><i class="el-icon-delete"></i></el-button>
        </el-button-group>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import datImportField from 'components/datImportField';

  export default {
    name: 'libraries',
    components: {
      datImportField,
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
      ...mapActions(['loadDirectoryAsDat', 'createDirectoryAsDat', 'removeDat', 'download']),
    },
};
</script>
