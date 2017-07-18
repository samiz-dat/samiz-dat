<template>
  <div>
    <h3>Filters</h3>
    <!-- <reading-list-nav/> -->
    <h4>by libraries:</h4>
    <dat-nav/>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import readingListNav from 'components/readingListNav';
  import datNav from 'components/datNav';
  // TODO: make this fixed, independent of main areas scroll.

  export default {
    name: 'sideNav',
    components: {
      readingListNav,
      datNav,
    },
    data() {
      return {};
    },
    computed: {},
    methods: {},
};
</script>
