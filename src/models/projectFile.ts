import { FirestoreDocumentData } from '@/vue-common';

export default class ProjectFile extends FirestoreDocumentData {
  public name: string = '';
  public pid: string = '';
  public uid: string = '';
  public fileType: string = '';
  public uploadDate: string = '';
  public fileURL: string = '';
  public tag: String[] = [];
}
