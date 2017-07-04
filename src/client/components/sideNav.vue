<template>
  <reading-list-nav/>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import readingListNav from 'components/readingListNav';
  // TODO: make this fixed, independent of main areas scroll.

  export default {
    name: 'sideNav',
    components: {
      readingListNav,
    },
    data() {
      return {};
    },
    computed: {},
    methods: {},
};
</script>
