<template>
  <el-row>
    <el-col :span="4">Libraries:</el-col>
    <el-col :span="20">
      <el-row>
        <el-col :span="3">
          <el-checkbox-button label="all" key="all" v-model="selectAll" checked>All</el-checkbox-button>
        </el-col>
        <el-col :span="18">
          <el-checkbox-group v-model="selected">
            <el-checkbox-button v-for="(dat, index) in dats" :label="dat.dat" :key="dat.dat">{{dat.name}}</el-checkbox-button>
          </el-checkbox-group>
        </el-col>
        <el-col :span="3">
          <el-button @click="addDatDialogIsVisible = true">+</el-button>
          <el-dialog title="Add a new library" :visible.sync="addDatDialogIsVisible">
            <el-button v-on:click="loadDirectoryAsDat">+ Local Library</el-button>
            <dat-import-field/>
          </el-dialog>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import datImportField from 'components/datImportField';

  // TODO: make this fixed, independent of main areas scroll.

  export default {
    name: 'datNav',
    components: {
      datImportField,
    },
    data() {
      return {
        addDatDialogIsVisible: false,
      };
    },
    computed: {
      ...mapState(['dats']),
      selectAll: {
        get() {
          return (this.$store.state.selectedDats.length === 0) ? ['all'] : [];
        },
        set() {
          this.$store.commit('selectDats', []);
          this.$store.dispatch('getAuthorLetters');
        },
      },
      selected: {
        get() {
          return this.$store.state.selectedDats;
        },
        set(value) {
          this.$store.commit('selectDats', value);
          this.$store.dispatch('getAuthorLetters');
        },
      },
    },
    methods: {
      ...mapActions(['loadDirectoryAsDat']),
    },
};
</script>
