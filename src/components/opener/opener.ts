import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Opener extends Vue {
  public isOpen = false;

  public open() {
    if (this.isOpen) {
      this.close();
    } else {
      this.isOpen = true;
    }

    document.body.addEventListener('click', this.close);
    this.sendState();
  }

  public close() {
    this.isOpen = false;
    document.body.removeEventListener('click', this.close);
    this.sendState();
  }

  private sendState() {
    this.$emit('state', this.isOpen);
  }
}
