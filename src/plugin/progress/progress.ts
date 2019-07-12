import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Progress extends Vue {
  private showProgress: boolean = false;

  public show() {
    this.showProgress = true;
  }

  public off() {
    this.showProgress = false;
  }
}
