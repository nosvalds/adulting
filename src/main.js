import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'

// Set up Axios
Vue.prototype.$http = Axios;
Vue.prototype.$http.defaults.baseURL = "https://secure.splitwise.com/api/v3.0";
Vue.prototype.$http.defaults.headers = { 
    'Accept': 'application/json', 
    'Authorization': '', 
    'Content-Type': 'application/json'
  };

Vue.config.productionTip = false

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)

new Vue({
  render: h => h(App),
}).$mount('#app')
