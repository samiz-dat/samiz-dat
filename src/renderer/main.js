import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import router from 'routes/routes';
import store from 'store/store';
import App from './App';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  store,
  router,
  render: h => h(App),
});
