import { Vue, Component } from 'vue-property-decorator';
import { FirestoreDocument } from '@/vue-common';
import ProjectFile from '@/models/projectFile';

@Component({})
export default class FileCard extends Vue {
    public file!: FirestoreDocument<ProjectFile>;
    
}
