<template>
  <div class="stats">
    {{ stats.files }} files ({{ size || 0 }}) in {{ stats.count }} collections<br />
    {{ stats.peers || '0' }} peers &uarr; {{ upload || 0 }} &bull; &darr; {{ download || 0 }}
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';
  import { isFinite } from 'lodash';
  import prettyBytes from 'pretty-bytes';

  export default {
    name: 'appStats',
    components: {},
    data() {
      return {
        defaultStats: {
          peers: 0,
	      downloadSpeed: 0,
	      uploadSpeed: 0,
	      files: 0,
	      size: 0,
        },
      };
    },
    computed: {
      ...mapState(['loading', 'error', 'route']),
      ...mapGetters(['appStats']),
      stats() {
        return this.appStats || this.defaultStats;
      },
      datSize() {
        const stats = this.stats;
        return prettyBytes(stats.size);
      },
      download() {
        const stats = this.stats;
        return prettyBytes(stats.downloadSpeed || 0);
      },
      upload() {
        const stats = this.stats;
        return prettyBytes(stats.uploadSpeed || 0);
      },
      size() {
        const stats = this.stats;
        return prettyBytes(stats.size || 0);
      },
    },
};
</script>

<style lang="scss" scoped>
  .stats {
    font-size: .65rem;
    color: #666666;
  }
</style>
