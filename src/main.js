import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import '@fortawesome/fontawesome-free/less/fontawesome.less'
import '@fortawesome/fontawesome-free/js/all.js'

import '@/assets/main.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
