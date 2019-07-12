import DialogSimple from './simple/dialog.simple';
import Vue from 'vue';
import DialogInput from './input/dialog.input';

declare module 'vue/types/vue' {
  interface Vue {
    $dialogSimple: DialogSimple;
    $dialogInput: DialogInput;
  }
}

export default {
  install(vue, options) {
    const dialogSimple = new DialogSimple();
    dialogSimple.$mount(document.body.appendChild(document.createElement('div')));
    Vue.prototype.$dialogSimple = dialogSimple;

    const dialogInput = new DialogInput();
    dialogInput.$mount(document.body.appendChild(document.createElement('div')));
    Vue.prototype.$dialogInput = dialogInput;
  }
};
