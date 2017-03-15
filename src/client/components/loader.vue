<template>
  <transition name="fade">
    <div v-show="loading" class="loader">
      <h1>Loading...</h1>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'loader',
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() { return {}; },
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  $background-color: #e8e8e8;

  div.loader {
    background-color: $background-color;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    h1 {
      color: white;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
