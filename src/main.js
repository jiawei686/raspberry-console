import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'

//http service
import VueResource from 'vue-resource'

//Bootstrap4-Vue2
import BootstrapVue from 'bootstrap-vue'


// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(VueResource)
Vue.use(BootstrapVue);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
