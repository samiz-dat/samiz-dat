<template>
  <transition name="fade">
    <div v-show="error" class="background">
      <div  v-on:click="resetError" class="error">
        <h1>Opps... Something went wrong:</h1>
        <h2>{{error && error.message}}</h2>
        <p>{{error && error.stack}}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'error',
  props: ['error'],
  data() { return {}; },
  computed: {},
  methods: {
    ...mapMutations(['resetError']),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  $background-color: #e8e8e8;

  div.background {
    background-color: rgba(232, 232, 232, 0.33);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 9999999;
  }

  div.error {
    flex: 1;
    background: rgb(255,232,232);
    color: red;
    max-width: 80%;
    max-height: 80%;
    overflow: scroll;
    cursor: pointer;
    p, h1, h2 {
      margin: 2rem;
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
