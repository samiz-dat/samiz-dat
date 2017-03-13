import Vue from 'vue';
import App from './App.vue';
import store from './store/store';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  store,
});
