import DialogSimple from './simple/dialog.simple';
import Vue from 'vue';
import DialogInput from './input/dialog.input';
import DialogPreview from './preview/dialog.preview';
import DialogTag from './tag/tag';

declare module 'vue/types/vue' {
  interface Vue {
    $dialogSimple: DialogSimple;
    $dialogInput: DialogInput;
    $dialogPreview: DialogPreview;
    $dialogTag: DialogTag;
  }
}

export default {
  install(vue, options) {
    const dialogSimple = new DialogSimple();
    dialogSimple.$mount(
      document.body.appendChild(document.createElement('div'))
    );
    Vue.prototype.$dialogSimple = dialogSimple;

    const dialogInput = new DialogInput();
    dialogInput.$mount(
      document.body.appendChild(document.createElement('div'))
    );
    Vue.prototype.$dialogInput = dialogInput;

    const dialogPreview = new DialogPreview();
    dialogPreview.$mount(
      document.body.appendChild(document.createElement('div'))
    );
    Vue.prototype.$dialogPreview = dialogPreview;

    const dialogTag = new DialogTag();
    dialogTag.$mount(document.body.appendChild(document.createElement('div')));
    Vue.prototype.$dialogTag = dialogTag;
  }
};
