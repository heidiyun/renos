import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class DialogInput extends Vue {
  private title = '';
  private inputModel = '';
  private negative = '취소';
  private positive = '확인';
  private on: boolean = false;


  public open(title: string, defaultText: string, negative: string, positive: string,
  ) {
    this.on = true;
    this.title = title;
    this.inputModel = defaultText;
    this.positive = positive;
    this.negative = negative;

    return new Promise<string>((resovle, reject) => {
      this.resolve = resovle;
      this.reject = reject;
    });

  }

  private onClickPositive() {
    // this.onPositive(this.inputModel);
    this.on = false;
    this.resolve(this.inputModel);
  }

  private onClickNegative() {
    this.on = false;
    this.reject();
  }

  private resolve = (text: string) => {
    // block
  }
  private reject = () => {
    // block
  }
  private onPositive = (a: string) => {
    // Empty Block
  }


}
