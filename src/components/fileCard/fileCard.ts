import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument, Storage } from '@/vue-common';
import ProjectFile from '@/models/projectFile';

@Component({})
export default class FileCard extends Vue {
  @Prop()
  public file!: FirestoreDocument<ProjectFile>;

  private async onDelete() {
    this.$progress.show();
    await this.file.delete();
    const storage = new Storage(`/files/${this.file.id}`);
    await storage.delete();
    this.$progress.off();
  }

  private get fileIcon() {
    // TODO 확장자 추가 or로 달고 image는 필요없음.
    if (this.file.data.fileType.startsWith('image')) {
      return {
        tag: 'image',
        icon: 'image',
        color: 'rgb(240,180,0)'
      };
    } else if (this.file.data.fileType.startsWith('application/pdf')) {
      return {
        tag: 'pdf',
        icon: 'file-pdf',
        color: 'rgb(233,67,52)'
      };
    } else if (this.file.data.fileType.startsWith('video')) {
      return {
        tag: 'video',
        icon: 'video-camera',
        color: 'rgb(217, 48, 37)'
      }
    } else if (this.file.data.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return {
        tag: 'word',
        icon: 'file-word',
        color: 'rgb(75, 135, 228)'
      }
    } else if (this.file.data.fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return {
        tag: 'excel',
        icon: 'file-excel',
        color: 'rgb(14, 157, 89)'
      }
    } else if (this.file.data.fileType ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      return {
        tag: 'ppt',
        icon: 'file-ppt',
        color: 'rgb(253, 117, 65)'
      }
    }

    else {
      return {
        tag: 'file',
        icon: 'file',
        color: 'rgb(192,192,192)'
      };
    }

  }

  private mounted() {
    console.log('filecard', this.file.data.fileType);

  }
}
