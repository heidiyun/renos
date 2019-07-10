import Progress from './progress';
import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $progress: Progress;
  }
}

export default {
  install(vue, options) {
    const progress = new Progress();
    progress.$mount(document.body.appendChild(document.createElement('div')));
    Vue.prototype.$progress = progress;
  }
};
