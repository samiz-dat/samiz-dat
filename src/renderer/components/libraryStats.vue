<template>
  <div>
    <p/>
    <el-row>
      <el-col :span="4">
        <el-badge :value="stats.peers.peers || '0'" class="item">Peers</el-badge>
      </el-col>
      <el-col :span="4">
        <el-badge :value="stats.peers.total || '0'" class="item">Total</el-badge>
      </el-col>
      <el-col :span="16"/>
    </el-row>
    <el-row>
      <el-col :span="8">
        Files:
      </el-col>
      <el-col :span="16">
        {{ stats.filesCount.total }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        Downloaded Content:
      </el-col>
      <el-col :span="16">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(percentage)" status="success"></el-progress>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        Downloaded Metadata:
      </el-col>
      <el-col :span="16">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(metadataPercentage)" status="primary"></el-progress>
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
          metadata: 0,
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
        return this.datStats(this.dat.dat) || this.defaultStats;
      },
      percentage() {
        const stats = this.stats;
        return stats.downloaded || 0;
      },
      metadataPercentage() {
        const stats = this.stats;
        return stats.metadata || 0;
      },
    },
    methods: {},
};
</script>
