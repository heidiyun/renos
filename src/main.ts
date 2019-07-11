import Vue from 'vue';
import './plugins/vuetify';
import App from '@/app';
import router from './router';
import store from './store';
import './registerServiceWorker';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
