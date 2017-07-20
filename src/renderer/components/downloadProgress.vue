<template>
  <div v-show="currFile" class='status-bar'>
    <div class="smallprint">
      {{ currFile }}
    </div>
    <div class="progress">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="Math.round(currPercentage)" status="success"></el-progress>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'downloadProgress',
    components: {},
    props: {
      downloadStat: {
        type: Object,
      },
    },
    data() {
      return {};
    },
    computed: {
      currFile() {
        return this.downloadStat && this.downloadStat.file;
      },
      currPercentage() {
        return (this.downloadStat
          && this.downloadStat.progress
          && !isNaN(this.downloadStat.progress)
          && this.downloadStat.progress <= 100)
        ? this.downloadStat.progress
        : 0;
      },
    },
};
</script>

<style lang="scss" scoped>
  .status-bar {
    background-color: white;
    display: flex;
    height: 2rem;
    flex-direction: column;
    padding: 0.5rem;
    border: none;
    border-top: black solid 0.1rem;
    div.smallprint {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // div.progress {
    //   width: 80%;
    // }
  }
</style>
