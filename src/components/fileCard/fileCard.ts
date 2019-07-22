import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument, Storage } from '@/vue-common';
import ProjectFile from '@/models/projectFile';
import Collections from '@/models/collections';

@Component({})
export default class FileCard extends Vue {
  @Prop()
  public file!: FirestoreDocument<ProjectFile>;
  @Prop()
  public isOwner!: boolean;
  private enableDelete: boolean = false;

  private async onDelete() {
    this.$progress.show();
    await this.file.delete();
    const storage = new Storage(`/files/${this.file.id}`);
    await storage.delete();
    this.$progress.off();
  }

  private isAuthorized() {
    if (this.file.data.uid === this.$store.getters.user.id || this.isOwner) {
      this.enableDelete = true;
      return;
    } else {
      this.enableDelete = false;
      return;
    }
  }

  private async showPreview() {
    this.file.data.accessDate = new Date().toUTCString();
    await this.file.saveSync();

    this.$dialogPreview.on(
      this.file.data.name,
      this.file.data.fileType,
      this.file.data.fileURL
    );
  }

  private showComment() {
    this.$store.commit('setSelectedFile', this.file);
    this.$emit('open-comment');
  }

  private get fileIcon() {
    // TODO 확장자 추가 or로 달고 image는 필요없음.
    const fileExtension = this.file.data.name.split('.');
    if (this.file.data.fileType.startsWith('image')) {
      return {
        tag: 'image',
        kind: 'image',
        icon: 'image',
        color: 'rgb(240,180,0)'
      };
    } else if (this.file.data.fileType.startsWith('application/pdf')) {
      return {
        tag: 'pdf',
        kind: 'file',
        icon: 'file-pdf',
        color: 'rgb(233,67,52)'
      };
    } else if (this.file.data.fileType.startsWith('video')) {
      return {
        tag: 'video',
        kind: 'video',
        icon: 'video-camera',
        playable: this.file.data.name.endsWith('.mp4'),
        color: 'rgb(217, 48, 37)'
      };
    } else if (
      fileExtension[1] === 'docx' ||
      fileExtension[1] === 'doc' ||
      this.file.data.fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return {
        tag: 'word',
        kind: 'file',
        icon: 'file-word',
        color: 'rgb(75, 135, 228)'
      };
    } else if (
      fileExtension[1] === 'xlsx' ||
      fileExtension[1] === 'xls' ||
      this.file.data.fileType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return {
        tag: 'excel',
        kind: 'file',
        icon: 'file-excel',
        color: 'rgb(14, 157, 89)'
      };
    } else if (
      fileExtension[1] === 'pptx' ||
      this.file.data.fileType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      return {
        tag: 'ppt',
        kind: 'file',
      icon: 'file-ppt',
        color: 'rgb(253, 117, 65)'
      };
    } else {
      return {
        tag: 'file',
        kind: 'file',
        icon: 'file',
        color: 'rgb(192,192,192)'
      };
    }
  }

  private mounted() {
    this.file.data.kind = this.fileIcon.kind;
    this.file.saveSync();
  }
}
