<template>
  <div>
    <p/>
    <el-row>
      <el-col :span="4">
        <el-badge :value="stats.peers.total || '0'" class="item">Peers</el-badge>
      </el-col>
      <el-col :span="4">
        <el-badge :value="stats.peers.complete || '0'" class="item">Complete</el-badge>
      </el-col>
      <el-col :span="4">
        &uarr; {{ stats.uploadSpeed || 0 }} &bull; &darr; {{ stats.downloadSpeed || 0 }}
      </el-col>
      <el-col :span="12"/>
    </el-row>
    <el-row>
      <el-col :span="8">
        Files:
      </el-col>
      <el-col :span="16">
        {{ stats.filesCount.total }} ({{ this.datSize }})
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
  import { mapState, mapGetters } from 'vuex';
  import { isFinite } from 'lodash';
  import prettyBytes from 'pretty-bytes';

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
          filesCount: { have: 0, total: 0 },
          peers: { complete: 0, total: 0 },
          metadata: 0,
          downloaded: 0,
          uploadSpeed: 0,
          downloadSpeed: 0,
          size: 0,
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
        return this.sanitisePercentage(stats.downloaded);
      },
      metadataPercentage() {
        const stats = this.stats;
        return this.sanitisePercentage(stats.metadata);
      },
      datSize() {
        const stats = this.stats;
        return prettyBytes(stats.size);
      },
    },
    methods: {
      sanitisePercentage: (value) => {
        return (value
          && isFinite(value)
          && value <= 100)
        ? value
        : 0;
      }
    },
};
</script>
