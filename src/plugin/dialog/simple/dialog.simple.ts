import { Vue, Component } from 'vue-property-decorator';
import { relativeTimeThreshold } from 'moment';

@Component({})
export default class DialogSimple extends Vue {

  private title = '';
  private content = '';
  private negative = '취소';
  private positive = '확인';
  private on: boolean = false;


  public open(title: string, content: string, negative: string, positive: string) {
    this.on = true;
    this.title = title;
    this.content = content;
    this.positive = positive;
    this.negative = negative;
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  private resolve = () => {
    // Empty Function
  }
  private reject = () => {
    // Empty Function
  }

  private onClickPositive() {
    this.on = false;
    this.resolve();
  }
  private onClickNegative() {
    this.on = false;
    this.reject();
  }

}
