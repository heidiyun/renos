import { Vue, Component, Prop } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import ProjectFile from '@/models/projectFile';

@Component({})
export default class FileCard extends Vue {
  @Prop()
  public file!: FirestoreDocument<ProjectFile>;


  private mounted() {
    console.log('filecard', this.file);
  }
}
