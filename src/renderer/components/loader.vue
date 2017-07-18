<template>
  <transition name="fade">
    <div v-show="loading" class="loader">
      <div class="content">
        <icon-outline class="white-svg"/>
        <h1>Loading...</h1>
      </div>
    </div>
  </transition>
</template>

<script>
import IconOutline from 'assets/icons/icon-outline.svg';

export default {
  name: 'loader',
  components: {
    IconOutline,
  },
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
<style lang="scss">
  .white-svg {
    path {
      stroke: white;
    }
  }
</style>
<style lang="scss" scoped>
  div.loader {
    background-color: rgba(0,0,0,0.8);
    position: fixed;
    align-items: center;
    justify-content: center;
    text-align: center;
    display: flex;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    .content {
      width: 10em;
      animation: flickerAnimation 2s infinite ease-in-out;
      h1 {
        color: white;

      }
    }
  }

  @keyframes flickerAnimation {
    0%   { opacity:1; }
    50%  { opacity:0; }
    100% { opacity:1; }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
