<template>
  <div>
    <p/>
    <el-row>
      <el-col :span="4">
        <el-badge :value="stats.peers || '0'" class="item">Peers</el-badge>
      </el-col>
      <el-col :span="4">
        <el-badge :value="stats.total || '0'" class="item">Total</el-badge>
      </el-col>
      <el-col :span="16"/>
    </el-row>
    <el-row>
    <el-col :span="8">
      Downloaded:
    </el-col>
    <el-col :span="16">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(stats.downloaded)" status="success"></el-progress>
    </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';

  export default {
    name: 'libraryStats',
    components: {},
    props: {
      dat: {
        type: Object,
      },
    },
    data() {
      return {
        defaultStats: {
          total: 0,
          peers: 0,
          downloaded: 0,
          uploadSpeed: 0,
          downloadSpeed: 0,
        },
      };
    },
    computed: {
      ...mapState(['loading', 'error', 'route']),
      ...mapGetters(['datStats']),
      stats() {
        return this.datStats(this.dat.dat) || defaultStats;
      }
    },
    methods: {},
};
</script>
