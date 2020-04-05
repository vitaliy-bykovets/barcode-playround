import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

import router from './routers';

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
