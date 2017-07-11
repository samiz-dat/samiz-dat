<template>
  <el-row v-show="percentage">
    <el-col :span="8">
      {{ downloadStat.file }}
    </el-col>
    <el-col :span="16">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(percentage)" status="success"></el-progress>
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
      percentage() {
        return (this.downloadStat && this.downloadStat.progress) ? this.downloadStat.progress : 0;
      },
    },
};
</script>
