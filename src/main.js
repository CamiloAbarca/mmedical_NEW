// main.js
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Importa tu store de Vuex
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

// Importa los estilos de Bootstrap y BootstrapVue
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

// Instala BootstrapVue y el plugin de íconos
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  store, // Inyecta el store de Vuex aquí
  render: h => h(App),
}).$mount('#app');