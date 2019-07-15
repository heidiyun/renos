import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class DialogPreview extends Vue {
  private fileName: string = '';
  private fileType: string = '';
  private fileURL: string = '';
  private show: boolean = false;


  public on(fileName: string, fileType: string, fileURL: string) {
    this.show = true;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileURL = fileURL;
  }

  public off() {
    this.show = false;
  }

  private downloadFile() {
    window.open(this.fileURL);
  }
}
