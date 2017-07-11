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
        <el-button type="warning" v-on:click="removeDat(dat.dat)"><i class="el-icon-delete"></i></el-button>
      </el-button-group>
      <library-stats :dat="dat"/>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
  import libraryStats from 'components/libraryStats';

  export default {
    name: 'libraryList',
    components: {
      libraryStats,
    },
    props: {
      dats: {
        type: Array,
      },
    },
    data() {
      return {
      };
    },
    computed: {
      ...mapState(['loading', 'error', 'route']),
      ...mapGetters(['datStats']),
      stats() {
        return this.datStats(this.dat.dat);
      }
    },
    methods: {
      ...mapActions(['removeDat', 'download']),
      downloadDat(key) {
        this.download({ dat: key });
        this.$notify({
          title: 'Download',
          message: 'starting now',
        });
      }
    },
};
</script>
