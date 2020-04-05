import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';

// Install Vue plugin
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '*', redirect: { name: 'home' } },
  ],
});