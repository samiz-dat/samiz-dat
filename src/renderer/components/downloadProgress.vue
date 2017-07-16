<template>
  <el-row v-show="currFile">
    <el-col :span="8">
      {{ currFile }}
    </el-col>
    <el-col :span="16">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(currPercentage)" status="success"></el-progress>
    </el-col>
  </el-row>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'downloadProgress',
    components: {},
    data() {
      return {};
    },
    computed: {
      ...mapState(['loading', 'error', 'route', 'downloadStat']),
      currFile() {
        return (this.downloadStat && this.downloadStat.file) ? this.downloadStat.file : undefined;
      },
      currPercentage() {
        return (this.downloadStat
          && this.downloadStat.progress
          && !isNaN(this.downloadStat.progress)
          && this.downloadStat.progress <=100 )
        ? this.downloadStat.progress
        : 0;
      },
    },
};
</script>
