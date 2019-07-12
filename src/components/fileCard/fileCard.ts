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

  private mounted() {
    console.log('filecard', this.file);
  }
}
